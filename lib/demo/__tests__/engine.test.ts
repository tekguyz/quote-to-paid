import { describe, expect, it } from "vitest";
import {
  acceptQuote,
  addQuote,
  advanceDay,
  customerReply,
  dealStatus,
  emptyState,
  markJobDone,
  nextFollowUp,
  payInvoice,
  plannedDays,
  rules,
} from "../engine";
import { jobPhrase } from "../messages";
import { createSampleState } from "../sample";
import type { DemoState } from "../types";

// 2026-11-09 is a Monday, so day 6 is a Sunday.
const MONDAY = "2026-11-09";

function skip(state: DemoState, days: number): DemoState {
  let s = state;
  for (let i = 0; i < days; i++) s = advanceDay(s).state;
  return s;
}

function withQuote(): DemoState {
  return addQuote(emptyState(MONDAY), {
    customer: "Test C.",
    town: "Pompano Beach",
    job: "AC replacement",
    amount: 9000,
  });
}

const kinds = (s: DemoState, kind: string) => s.events.filter((e) => e.kind === kind);

describe("plannedDays", () => {
  it("adds each offset to the day it was sent", () => {
    expect(plannedDays(MONDAY, 0, [2, 5, 9])).toEqual([2, 5, 9]);
  });

  it("moves a Sunday follow-up to Monday", () => {
    expect(plannedDays(MONDAY, 0, [6])).toEqual([7]);
  });

  it("never plans two on one day after a Sunday move", () => {
    expect(plannedDays(MONDAY, 0, [6, 7])).toEqual([7, 8]);
  });
});

describe("quote follow-ups", () => {
  it("go out on day 2, 5 and 9 after the quote", () => {
    const s = skip(withQuote(), 9);
    expect(kinds(s, "follow-up").map((e) => e.day)).toEqual([2, 5, 9]);
  });

  it("never go past three, and ask the owner to call once", () => {
    const s = skip(withQuote(), 40);
    expect(kinds(s, "follow-up")).toHaveLength(rules.quoteFollowUps.length);
    expect(kinds(s, "needs-call")).toHaveLength(1);
    expect(kinds(s, "needs-call")[0].day).toBe(9 + rules.callAfterLast);
    expect(dealStatus(s.deals[0], s.day)).toBe("call");
  });

  it("stop the moment the customer answers", () => {
    let s = skip(withQuote(), 3);
    s = customerReply(s, s.deals[0].id, "Can you come Tuesday?");
    s = skip(s, 30);
    expect(kinds(s, "follow-up")).toHaveLength(1);
    expect(kinds(s, "needs-call")).toHaveLength(0);
    expect(dealStatus(s.deals[0], s.day)).toBe("replied");
    expect(nextFollowUp(s.deals[0], s)).toBeNull();
  });

  it("show the next follow-up while waiting", () => {
    const s = withQuote();
    expect(nextFollowUp(s.deals[0], s)).toEqual({ day: 2, n: 1, of: 3 });
  });

  it("put every message in the timeline as text that was not sent", () => {
    const s = skip(withQuote(), 2);
    const msg = kinds(s, "follow-up")[0].message;
    expect(msg).toContain("Test");
    expect(msg).toContain("Gumbo Limbo Air");
  });
});

describe("from yes to paid", () => {
  it("books the job, then sends the invoice by itself on the job day", () => {
    let s = acceptQuote(skip(withQuote(), 1), "d1", "customer");
    const deal = s.deals[0];
    expect(deal.stage).toBe("booked");
    s = skip(s, deal.jobDay! - s.day);
    const after = s.deals[0];
    expect(after.stage).toBe("invoiced");
    expect(after.invoice?.sentDay).toBe(deal.jobDay);
    expect(after.invoice?.dueDay).toBe(deal.jobDay! + rules.invoiceDueIn);
    expect(kinds(s, "invoice-sent")).toHaveLength(1);
  });

  it("sends at most three invoice reminders, then asks for a call", () => {
    let s = acceptQuote(withQuote(), "d1", "customer");
    s = markJobDone(s, "d1");
    s = skip(s, 40);
    expect(kinds(s, "reminder")).toHaveLength(3);
    expect(dealStatus(s.deals[0], s.day)).toBe("call");
  });

  it("stops reminders the moment it is paid", () => {
    let s = markJobDone(acceptQuote(withQuote(), "d1", "customer"), "d1");
    s = skip(s, 4);
    s = payInvoice(s, "d1", "customer");
    s = skip(s, 30);
    expect(kinds(s, "reminder")).toHaveLength(1);
    expect(s.deals[0].stage).toBe("paid");
    expect(dealStatus(s.deals[0], s.day)).toBe("paid");
  });

  it("does nothing when paying twice", () => {
    let s = markJobDone(acceptQuote(withQuote(), "d1", "customer"), "d1");
    s = payInvoice(s, "d1", "customer");
    const again = payInvoice(s, "d1", "customer");
    expect(kinds(again, "paid")).toHaveLength(1);
  });
});

describe("jobPhrase", () => {
  it("lowercases a plain job name but keeps AC in capitals", () => {
    const deal = (job: string) => ({ job }) as Parameters<typeof jobPhrase>[0];
    expect(jobPhrase(deal("Duct sealing"))).toBe("duct sealing");
    expect(jobPhrase(deal("3-ton AC system replacement"))).toBe("3-ton AC system replacement");
    expect(jobPhrase(deal("AC tune-up"))).toBe("AC tune-up");
  });
});

describe("the sample company", () => {
  it("starts on day 0 with history behind it", () => {
    const s = createSampleState(MONDAY);
    expect(s.day).toBe(0);
    expect(s.events.length).toBeGreaterThan(10);
    expect(s.events.every((e) => e.day <= 0)).toBe(true);
  });

  it("has something waiting on the owner, and something paid", () => {
    const s = createSampleState(MONDAY);
    const statuses = s.deals.map((d) => dealStatus(d, s.day));
    expect(statuses).toContain("call");
    expect(statuses).toContain("paid");
    expect(statuses).toContain("waiting");
  });

  it("moves when the visitor skips ahead a few days", () => {
    const s = createSampleState(MONDAY);
    const later = skip(s, 4);
    const newEvents = later.events.filter((e) => e.day > 0);
    expect(newEvents.some((e) => e.kind === "follow-up")).toBe(true);
    expect(newEvents.some((e) => e.kind === "paid")).toBe(true);
    expect(newEvents.some((e) => e.kind === "accepted")).toBe(true);
    expect(newEvents.some((e) => e.kind === "invoice-sent")).toBe(true);
  });

  it("is the same every time for the same start date", () => {
    expect(createSampleState(MONDAY)).toEqual(createSampleState(MONDAY));
  });

  it("works whatever weekday the visitor starts on", () => {
    for (const date of ["2026-11-08", "2026-11-10", "2026-11-13", "2026-11-14"]) {
      const s = skip(createSampleState(date), 14);
      for (const d of s.deals) {
        expect(d.quote?.followUps.length ?? 0).toBeLessThanOrEqual(3);
        expect(d.invoice?.reminders.length ?? 0).toBeLessThanOrEqual(3);
      }
    }
  });
});
