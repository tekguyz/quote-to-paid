// The texts a customer would get. In the demo nothing is sent: the words are
// shown in the timeline and on the customer's phone screen only.
// Polite, short, signed by a person, and never more than the rules allow.

import { business } from "@/lib/brand";
import { formatDay, formatMoney } from "./dates";
import type { Deal } from "./types";

const sign = `— ${business.owner}, ${business.name}`;

/** "Duct sealing" reads "duct sealing" mid-sentence; "AC tune-up" and "3-ton AC" stay as they are. */
export function jobPhrase(deal: Deal): string {
  const [a, b] = deal.job;
  return b && b === b.toLowerCase() ? a.toLowerCase() + deal.job.slice(1) : deal.job;
}

export function quoteSentMessage(deal: Deal): string {
  return `Hi ${deal.firstName}, here's your quote for the ${jobPhrase(deal)}: ${formatMoney(deal.amount)}. Tap the link to see what's included and say yes when you're ready. ${sign}`;
}

const quoteFollowUps = [
  (d: Deal) =>
    `Hi ${d.firstName}, just checking the quote for the ${jobPhrase(d)} came through OK. Any questions, reply here. ${sign}`,
  (d: Deal) =>
    `Hi ${d.firstName}, happy to walk you through the ${jobPhrase(d)} quote on a quick call if that helps. Just reply with a good time. ${sign}`,
  (d: Deal) =>
    `Hi ${d.firstName}, last note from me on this quote so I don't fill up your phone. Whenever you're ready, reply here and we'll get you on the schedule. ${sign}`,
];

/** n is 1, 2 or 3. */
export function quoteFollowUpMessage(deal: Deal, n: number): string {
  return quoteFollowUps[n - 1](deal);
}

export function bookedMessage(deal: Deal, startDate: string): string {
  return `Thank you ${deal.firstName}! You're booked for ${formatDay(startDate, deal.jobDay!)}. The crew will text when they're on the way. ${sign}`;
}

export function invoiceSentMessage(deal: Deal, startDate: string): string {
  const inv = deal.invoice!;
  return `Hi ${deal.firstName}, thanks for having us out. Invoice ${inv.number} for ${formatMoney(deal.amount)} is ready. Tap the link to pay by card or bank. Due ${formatDay(startDate, inv.dueDay)}. ${sign}`;
}

/** n is 1, 2 or 3. */
export function reminderMessage(deal: Deal, n: number, startDate: string, today: number): string {
  const inv = deal.invoice!;
  const what = `invoice ${inv.number} (${formatMoney(deal.amount)})`;
  if (n === 1) {
    return `Hi ${deal.firstName}, a friendly reminder that ${what} is due ${formatDay(startDate, inv.dueDay)}. Tap the link to pay. ${sign}`;
  }
  if (n === 2) {
    const when = today > inv.dueDay ? `was due ${formatDay(startDate, inv.dueDay)}` : "is due today";
    return `Hi ${deal.firstName}, ${what} ${when}. Already paid? Thank you, and please ignore this. ${sign}`;
  }
  const late = today - inv.dueDay;
  return `Hi ${deal.firstName}, ${what} is now ${late} ${late === 1 ? "day" : "days"} past due. If anything about the job isn't right, reply and we'll make it right. This is my last reminder. ${sign}`;
}

export function paidMessage(deal: Deal): string {
  return `Got it, thank you ${deal.firstName}! Your receipt for ${deal.invoice!.number} is on its way. ${sign}`;
}
