// The demo's data. Everything lives in the visitor's own browser (ADR 0001).
// A "day" is a whole number: 0 is the day the visitor opened the demo,
// negative days are the sample history, and "Skip ahead a day" adds one.

export type Stage = "quote" | "booked" | "invoiced" | "paid" | "lost";

export interface Invoice {
  number: string;
  sentDay: number;
  dueDay: number;
  /** The days each reminder went out. Never more than the rules allow. */
  reminders: number[];
}

export interface Deal {
  id: string;
  /** First name and last initial, or a family name. Made up. */
  customer: string;
  firstName: string;
  town: string;
  job: string;
  amount: number;
  /** The day this deal first shows on the board. */
  createdDay: number;
  stage: Stage;
  /** Set when the deal started with a quote. A repair call has none. */
  quote?: { sentDay: number; followUps: number[] };
  /** The customer answered with a question: follow-ups stop, the owner answers. */
  reply?: { day: number; text: string };
  acceptedDay?: number;
  /** The day the crew does the job. */
  jobDay?: number;
  doneDay?: number;
  invoice?: Invoice;
  paidDay?: number;
  lost?: { day: number; reason: string };
  /** The day it moved to "give them a call", after the last follow-up got nothing. */
  needsCallDay?: number;
}

export type EventKind =
  | "quote-sent"
  | "follow-up"
  | "reply"
  | "accepted"
  | "declined"
  | "job-done"
  | "invoice-sent"
  | "reminder"
  | "paid"
  | "needs-call";

export interface DemoEvent {
  id: string;
  day: number;
  dealId: string;
  kind: EventKind;
  /** One line for the timeline. */
  text: string;
  /** The text message the customer would have got. Nothing is really sent. */
  message?: string;
  by: "auto" | "customer" | "owner";
}

/** Something a sample customer does on a given day, if the deal is still waiting on it. */
export interface ScriptStep {
  day: number;
  dealId: string;
  action: "accept" | "reply" | "decline" | "pay";
  text?: string;
}

export interface DemoState {
  version: 1;
  /** The real calendar date of day 0, as YYYY-MM-DD. */
  startDate: string;
  day: number;
  deals: Deal[];
  events: DemoEvent[];
  script: ScriptStep[];
  nextInvoice: number;
  nextId: number;
}
