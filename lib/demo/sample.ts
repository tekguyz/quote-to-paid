// The sample company: Gumbo Limbo Air, a made-up AC and heating shop in
// Broward and Palm Beach. Every customer, job and amount here is invented.
//
// The history is not typed in by hand: the engine plays the past 16 days, so
// the timeline always follows the same rules a visitor sees going forward.
// The script also has steps after day 0, so "Skip ahead a day" shows customers
// answering and paying.

import { addQuote, addRepair, advanceDay, emptyState, type NewDeal } from "./engine";
import type { DemoState, ScriptStep } from "./types";

const FIRST_DAY = -16;

type Opening = { day: number } & ({ kind: "quote"; deal: NewDeal } | { kind: "repair"; deal: NewDeal; jobDay: number });

const openings: Opening[] = [
  { day: -16, kind: "repair", jobDay: -15, deal: { id: "gloria", customer: "Gloria P.", town: "Margate", job: "Emergency AC repair", amount: 485 } },
  { day: -14, kind: "quote", deal: { id: "marco", customer: "Marco D.", town: "Coconut Creek", job: "Duct sealing", amount: 1180 } },
  { day: -11, kind: "quote", deal: { id: "okafor", customer: "The Okafor family", firstName: "Grace", town: "Boca Raton", job: "Duct cleaning and sealing", amount: 1450 } },
  { day: -10, kind: "repair", jobDay: -9, deal: { id: "ana", customer: "Ana & Tom G.", town: "Margate", job: "Condenser fan motor and capacitor", amount: 640 } },
  { day: -9, kind: "quote", deal: { id: "luis", customer: "Luis M.", town: "Lighthouse Point", job: "Mini-split for the garage office", amount: 3200 } },
  { day: -8, kind: "quote", deal: { id: "jonas", customer: "Jonas B.", town: "Boca Raton", job: "Thermostat and zoning upgrade", amount: 2150 } },
  { day: -6, kind: "quote", deal: { id: "maria", customer: "Maria R.", town: "Pompano Beach", job: "3-ton AC system replacement", amount: 9850 } },
  { day: -3, kind: "repair", jobDay: -2, deal: { id: "kendra", customer: "Kendra W.", town: "Parkland", job: "AC tune-up and drain line flush", amount: 289 } },
  { day: -3, kind: "quote", deal: { id: "priya", customer: "Priya S.", town: "Deerfield Beach", job: "Heat pump for a two-story home", amount: 12400 } },
  { day: -1, kind: "quote", deal: { id: "dwayne", customer: "Dwayne T.", town: "Coconut Creek", job: "Air handler and coil replacement", amount: 4300 } },
  { day: 0, kind: "quote", deal: { id: "sam", customer: "Sam K.", town: "Pompano Beach", job: "4-ton AC system replacement", amount: 11200 } },
];

const script: ScriptStep[] = [
  // The past
  { day: -12, dealId: "marco", action: "accept" },
  { day: -5, dealId: "marco", action: "pay" },
  { day: -6, dealId: "luis", action: "accept" },
  { day: -1, dealId: "kendra", action: "pay" },
  { day: -1, dealId: "jonas", action: "accept" },
  // After the visitor arrives
  { day: 1, dealId: "dwayne", action: "reply", text: "Can someone look at the attic unit before I decide? Afternoons are best." },
  { day: 1, dealId: "ana", action: "pay" },
  { day: 2, dealId: "maria", action: "accept" },
  { day: 3, dealId: "priya", action: "decline", text: "We're going to wait until spring." },
  { day: 4, dealId: "luis", action: "pay" },
  { day: 5, dealId: "sam", action: "accept" },
];

export function createSampleState(startDate: string): DemoState {
  let s: DemoState = { ...emptyState(startDate, FIRST_DAY), script };
  for (let day = FIRST_DAY; day <= 0; day++) {
    if (day > FIRST_DAY) s = advanceDay(s).state;
    for (const o of openings.filter((x) => x.day === day)) {
      s = o.kind === "quote" ? addQuote(s, o.deal) : addRepair(s, { ...o.deal, jobDay: o.jobDay });
    }
  }
  return s;
}
