// Short lines that say where a deal stands, for cards and headers.

import { formatDay, relativeDay } from "./dates";
import { dealStatus, nextFollowUp, rules } from "./engine";
import type { Deal, DemoState } from "./types";

export function whenLabel(state: DemoState, day: number): string {
  const rel = relativeDay(state.day, day);
  return rel === "today" || rel === "tomorrow" ? rel : formatDay(state.startDate, day);
}

export function dealLine(deal: Deal, state: DemoState): string {
  const status = dealStatus(deal, state.day);
  const next = nextFollowUp(deal, state);
  switch (status) {
    case "waiting":
      if (next) return `Follow-up ${next.n} of ${next.of} goes out ${whenLabel(state, next.day)}`;
      return `All 3 follow-ups sent. No answer by ${whenLabel(state, deal.quote!.followUps.at(-1)! + rules.callAfterLast)} and it comes to you.`;
    case "replied":
      return `"${deal.reply!.text}"`;
    case "call":
      return deal.stage === "quote" ? "No answer after 3 follow-ups. No more texts." : "Unpaid after 3 reminders. No more texts.";
    case "booked":
      return `Crew booked for ${whenLabel(state, deal.jobDay!)}`;
    case "unpaid":
    case "overdue": {
      const due = `${deal.invoice!.number} due ${whenLabel(state, deal.invoice!.dueDay)}`;
      return next ? `${due} · reminder ${next.n} of ${next.of} ${whenLabel(state, next.day)}` : due;
    }
    case "paid":
      return `Paid ${whenLabel(state, deal.paidDay!)}`;
    case "lost":
      return deal.lost!.reason ? `"${deal.lost!.reason}"` : "Marked lost";
  }
}

/** Deals that wait on the owner: a customer question, or a "give them a call". */
export function needsYou(state: DemoState): Deal[] {
  return state.deals.filter((d) => {
    const s = dealStatus(d, state.day);
    return s === "replied" || s === "call";
  });
}

export function totals(state: DemoState) {
  const sum = (ds: Deal[]) => ds.reduce((n, d) => n + d.amount, 0);
  const quotes = state.deals.filter((d) => d.stage === "quote");
  const unpaid = state.deals.filter((d) => d.stage === "invoiced");
  const paid = state.deals.filter((d) => d.stage === "paid" && d.paidDay! > state.day - 14);
  return {
    quotes: { count: quotes.length, amount: sum(quotes) },
    unpaid: { count: unpaid.length, amount: sum(unpaid) },
    paid: { count: paid.length, amount: sum(paid) },
  };
}
