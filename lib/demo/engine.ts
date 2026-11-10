// The follow-up engine. Pure functions: each takes the demo state and returns
// a new one. No clock, no storage, no network. Nothing is ever really sent.
//
// The rules (docs/superpowers/specs/2026-11-10-quote-to-paid-design.md):
// - quotes get follow-ups 2, 5 and 9 days after they go out;
// - invoices go out when the job is done, are due in 7 days, and get
//   reminders 3 days after sending, on the due day and 3 days late;
// - nothing goes out on a Sunday (it moves to Monday);
// - follow-ups stop the moment the customer answers or pays, and never pass three;
// - 3 days after the last one with no answer, the owner is asked to call.

import { business } from "@/lib/brand";
import { formatDay, formatMoney, weekday } from "./dates";
import {
  bookedMessage,
  invoiceSentMessage,
  paidMessage,
  quoteFollowUpMessage,
  quoteSentMessage,
  reminderMessage,
} from "./messages";
import type { Deal, DemoEvent, DemoState } from "./types";

export const rules = {
  quoteFollowUps: [2, 5, 9],
  invoiceDueIn: 7,
  invoiceReminders: [3, 7, 10],
  callAfterLast: 3,
  /** A yes is booked this many days out. */
  jobLeadDays: 2,
} as const;

export type Status = "waiting" | "replied" | "call" | "booked" | "unpaid" | "overdue" | "paid" | "lost";

export function emptyState(startDate: string, day = 0): DemoState {
  return { version: 1, startDate, day, deals: [], events: [], script: [], nextInvoice: 1041, nextId: 1 };
}

/** The days each follow-up is planned for: offset days after `from`, never a Sunday, never two on one day. */
export function plannedDays(startDate: string, from: number, offsets: readonly number[]): number[] {
  const out: number[] = [];
  let prev = from;
  for (const offset of offsets) {
    let d = Math.max(from + offset, prev + 1);
    while (weekday(startDate, d) === 0) d++;
    out.push(d);
    prev = d;
  }
  return out;
}

export function dealStatus(deal: Deal, today: number): Status {
  switch (deal.stage) {
    case "lost":
      return "lost";
    case "paid":
      return "paid";
    case "booked":
      return "booked";
    case "quote":
      if (deal.reply) return "replied";
      return deal.needsCallDay !== undefined ? "call" : "waiting";
    case "invoiced":
      if (deal.needsCallDay !== undefined) return "call";
      return today > deal.invoice!.dueDay ? "overdue" : "unpaid";
  }
}

/** The next automatic message for this deal, or null when nothing more will go out. */
export function nextFollowUp(deal: Deal, state: DemoState): { day: number; n: number; of: number } | null {
  if (deal.needsCallDay !== undefined) return null;
  if (deal.stage === "quote" && deal.quote && !deal.reply) {
    const plan = plannedDays(state.startDate, deal.quote.sentDay, rules.quoteFollowUps);
    const n = deal.quote.followUps.length;
    return n < plan.length ? { day: plan[n], n: n + 1, of: plan.length } : null;
  }
  if (deal.stage === "invoiced" && deal.invoice) {
    const plan = plannedDays(state.startDate, deal.invoice.sentDay, rules.invoiceReminders);
    const n = deal.invoice.reminders.length;
    return n < plan.length ? { day: plan[n], n: n + 1, of: plan.length } : null;
  }
  return null;
}

// ---- helpers -------------------------------------------------------------

function clone(state: DemoState): DemoState {
  return structuredClone(state);
}

function find(state: DemoState, id: string): Deal | undefined {
  return state.deals.find((d) => d.id === id);
}

function log(state: DemoState, event: Omit<DemoEvent, "id" | "day">): void {
  state.events.push({ id: `e${state.events.length + 1}`, day: state.day, ...event });
}

function firstNameOf(customer: string): string {
  return customer.replace(/^The\s+/i, "").split(/[\s&]/)[0];
}

// ---- actions -------------------------------------------------------------

export interface NewDeal {
  id?: string;
  customer: string;
  firstName?: string;
  town: string;
  job: string;
  amount: number;
}

/** The owner sends a quote today. */
export function addQuote(state: DemoState, input: NewDeal): DemoState {
  const s = clone(state);
  const id = input.id ?? `d${s.nextId}`;
  s.nextId++;
  const deal: Deal = {
    id,
    customer: input.customer,
    firstName: input.firstName ?? firstNameOf(input.customer),
    town: input.town,
    job: input.job,
    amount: input.amount,
    createdDay: s.day,
    stage: "quote",
    quote: { sentDay: s.day, followUps: [] },
  };
  s.deals.push(deal);
  log(s, {
    dealId: id,
    kind: "quote-sent",
    by: "owner",
    text: `Quote sent: ${formatMoney(deal.amount)}`,
    message: quoteSentMessage(deal),
  });
  return s;
}

/** A repair call booked straight onto the schedule, with no quote. */
export function addRepair(state: DemoState, input: NewDeal & { jobDay: number }): DemoState {
  const s = clone(state);
  const id = input.id ?? `d${s.nextId}`;
  s.nextId++;
  s.deals.push({
    id,
    customer: input.customer,
    firstName: input.firstName ?? firstNameOf(input.customer),
    town: input.town,
    job: input.job,
    amount: input.amount,
    createdDay: s.day,
    stage: "booked",
    jobDay: input.jobDay,
  });
  log(s, { dealId: id, kind: "accepted", by: "owner", text: `Repair call booked for ${formatDay(s.startDate, input.jobDay)}` });
  return s;
}

/** The customer answers with a question. Follow-ups stop; it is the owner's turn. */
export function customerReply(state: DemoState, id: string, text: string): DemoState {
  const deal = find(state, id);
  if (!deal || deal.stage !== "quote" || deal.reply) return state;
  const s = clone(state);
  const d = find(s, id)!;
  d.reply = { day: s.day, text };
  log(s, { dealId: id, kind: "reply", by: "customer", text: `${d.firstName} replied: "${text}" Follow-ups stopped.` });
  return s;
}

export function acceptQuote(state: DemoState, id: string, by: "customer" | "owner"): DemoState {
  const deal = find(state, id);
  if (!deal || deal.stage !== "quote") return state;
  const s = clone(state);
  const d = find(s, id)!;
  d.stage = "booked";
  d.acceptedDay = s.day;
  d.jobDay = plannedDays(s.startDate, s.day, [rules.jobLeadDays])[0];
  delete d.needsCallDay;
  log(s, {
    dealId: id,
    kind: "accepted",
    by,
    text: by === "customer" ? `${d.firstName} said yes. Follow-ups stopped. Booked for ${formatDay(s.startDate, d.jobDay)}.` : `Marked won. Booked for ${formatDay(s.startDate, d.jobDay)}.`,
    message: bookedMessage(d, s.startDate),
  });
  return s;
}

export function declineQuote(state: DemoState, id: string, reason: string, by: "customer" | "owner"): DemoState {
  const deal = find(state, id);
  if (!deal || deal.stage !== "quote") return state;
  const s = clone(state);
  const d = find(s, id)!;
  d.stage = "lost";
  d.lost = { day: s.day, reason };
  log(s, {
    dealId: id,
    kind: "declined",
    by,
    text: by === "customer" ? `${d.firstName} said no: "${reason}" Follow-ups stopped.` : `Marked lost. Follow-ups stopped.`,
  });
  return s;
}

/** The crew finishes the job. The invoice goes out by itself, with nothing typed. */
export function markJobDone(state: DemoState, id: string, by: "auto" | "owner" = "owner"): DemoState {
  const deal = find(state, id);
  if (!deal || deal.stage !== "booked") return state;
  const s = clone(state);
  const d = find(s, id)!;
  d.stage = "invoiced";
  d.doneDay = s.day;
  d.invoice = {
    number: `${business.invoicePrefix}-${s.nextInvoice}`,
    sentDay: s.day,
    dueDay: s.day + rules.invoiceDueIn,
    reminders: [],
  };
  s.nextInvoice++;
  log(s, { dealId: id, kind: "job-done", by, text: "Crew marked the job done" });
  log(s, {
    dealId: id,
    kind: "invoice-sent",
    by: "auto",
    text: `Invoice ${d.invoice.number} sent by itself: ${formatMoney(d.amount)}, due ${formatDay(s.startDate, d.invoice.dueDay)}`,
    message: invoiceSentMessage(d, s.startDate),
  });
  return s;
}

export function payInvoice(state: DemoState, id: string, by: "customer" | "owner"): DemoState {
  const deal = find(state, id);
  if (!deal || deal.stage !== "invoiced") return state;
  const s = clone(state);
  const d = find(s, id)!;
  d.stage = "paid";
  d.paidDay = s.day;
  delete d.needsCallDay;
  log(s, {
    dealId: id,
    kind: "paid",
    by,
    text: by === "customer" ? `${d.firstName} paid ${formatMoney(d.amount)}. Reminders stopped.` : `Marked paid: ${formatMoney(d.amount)}. Reminders stopped.`,
    message: paidMessage(d),
  });
  return s;
}

// ---- time ----------------------------------------------------------------

/**
 * Move the demo one day forward. In order: the day's follow-ups go out
 * (morning), sample customers do what their script says, crews finish the
 * jobs booked for today, and anything that went quiet is handed to the owner.
 */
export function advanceDay(state: DemoState): { state: DemoState; events: DemoEvent[] } {
  let s = clone(state);
  s.day++;
  const before = s.events.length;

  for (const d of s.deals) {
    const next = nextFollowUp(d, s);
    if (!next || next.day > s.day) continue;
    if (d.stage === "quote") {
      d.quote!.followUps.push(s.day);
      log(s, {
        dealId: d.id,
        kind: "follow-up",
        by: "auto",
        text: `Follow-up ${next.n} of ${next.of} sent by itself`,
        message: quoteFollowUpMessage(d, next.n),
      });
    } else {
      d.invoice!.reminders.push(s.day);
      log(s, {
        dealId: d.id,
        kind: "reminder",
        by: "auto",
        text: `Reminder ${next.n} of ${next.of} sent by itself`,
        message: reminderMessage(d, next.n, s.startDate, s.day),
      });
    }
  }

  for (const step of s.script.filter((x) => x.day === s.day)) {
    if (step.action === "accept") s = acceptQuote(s, step.dealId, "customer");
    if (step.action === "reply") s = customerReply(s, step.dealId, step.text ?? "");
    if (step.action === "decline") s = declineQuote(s, step.dealId, step.text ?? "", "customer");
    if (step.action === "pay") s = payInvoice(s, step.dealId, "customer");
  }

  for (const d of s.deals.filter((x) => x.stage === "booked" && x.jobDay !== undefined && x.jobDay <= s.day)) {
    s = markJobDone(s, d.id, "auto");
  }

  for (const d of s.deals) {
    if (d.needsCallDay !== undefined) continue;
    const sent =
      d.stage === "quote" && !d.reply ? d.quote!.followUps : d.stage === "invoiced" ? d.invoice!.reminders : null;
    const max = d.stage === "quote" ? rules.quoteFollowUps.length : rules.invoiceReminders.length;
    if (!sent || sent.length < max) continue;
    if (s.day >= sent[sent.length - 1] + rules.callAfterLast) {
      d.needsCallDay = s.day;
      log(s, {
        dealId: d.id,
        kind: "needs-call",
        by: "auto",
        text: `No answer after ${max} ${d.stage === "quote" ? "follow-ups" : "reminders"}. No more texts: give ${d.firstName} a call.`,
      });
    }
  }

  return { state: s, events: s.events.slice(before) };
}
