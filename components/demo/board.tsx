"use client";

import Link from "next/link";
import { secondary } from "@/components/buttons";
import { demoRoutes } from "@/lib/demo-routes";
import { formatMoney } from "@/lib/demo/dates";
import { dealLine, needsYou, totals } from "@/lib/demo/describe";
import { dealStatus } from "@/lib/demo/engine";
import { useDemo } from "@/lib/demo/use-demo";
import type { Deal, DemoState, Stage } from "@/lib/demo/types";
import { StatusChip } from "./status";

function DealCard({ deal, state }: { deal: Deal; state: DemoState }) {
  return (
    <li className="-mt-px -ml-px border border-line bg-surface">
      <Link
        href={demoRoutes.job(deal.id)}
        className="group block h-full p-4 transition-colors duration-150 hover:bg-brand-soft/40 focus-visible:outline-offset-[-2px]"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold leading-snug underline-offset-4 group-hover:underline">{deal.customer}</p>
          <p className="tabular font-display font-semibold">{formatMoney(deal.amount)}</p>
        </div>
        <p className="mt-0.5 text-sm text-muted">
          {deal.job} · {deal.town}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusChip status={dealStatus(deal, state.day)} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm">{dealLine(deal, state)}</p>
      </Link>
    </li>
  );
}

/** A ledger sheet: rows on white, split by 1px hairline rules; cells overlap by 1px so each rule is single. */
const sheet = "grid pt-px pl-px";

const columns: { stage: Stage; title: string; empty: string }[] = [
  { stage: "quote", title: "Quotes out", empty: "No quotes waiting." },
  { stage: "booked", title: "Jobs booked", empty: "No jobs booked." },
  { stage: "invoiced", title: "Invoices out", empty: "Every invoice is paid." },
  { stage: "paid", title: "Paid", empty: "Nothing paid yet." },
];

function sortFor(stage: Stage, deals: Deal[]): Deal[] {
  const copy = [...deals];
  if (stage === "paid") return copy.sort((a, b) => b.paidDay! - a.paidDay!);
  if (stage === "booked") return copy.sort((a, b) => a.jobDay! - b.jobDay!);
  return copy.sort((a, b) => b.createdDay - a.createdDay);
}

export function Board() {
  const state = useDemo();
  if (!state) return <p className="text-muted">Opening the sample company…</p>;

  const t = totals(state);
  const waiting = needsYou(state);
  const lost = state.deals.filter((d) => d.stage === "lost");

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Quotes and invoices</h1>
          <p className="mt-1 text-muted">Everything out the door, and what it is waiting on.</p>
        </div>
        <Link href={demoRoutes.newQuote} className={secondary}>
          <span aria-hidden="true">+</span> New quote
        </Link>
      </div>

      <dl className="grid grid-cols-1 divide-y divide-line rounded-xs border border-line bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          { label: "Quotes waiting", ...t.quotes },
          { label: "Unpaid invoices", ...t.unpaid },
          { label: "Paid, last 14 days", ...t.paid },
        ].map((x) => (
          <div key={x.label} className="px-4 py-3">
            <dt className="text-sm text-muted">{x.label}</dt>
            <dd className="mt-1 flex items-baseline gap-2">
              <span className="tabular font-display text-2xl font-semibold">{formatMoney(x.amount)}</span>
              <span className="text-sm text-muted">
                {x.count} {x.count === 1 ? "job" : "jobs"}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="needs-you">
        <h2 id="needs-you" className="border-b-2 border-clay-ink pb-2 font-display text-xl font-semibold">
          Needs you {waiting.length > 0 ? <span className="text-clay-ink">({waiting.length})</span> : null}
        </h2>
        {waiting.length === 0 ? (
          <p className="mt-2 text-muted">Nothing needs you today. The follow-ups have the rest.</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">A customer answered, or went quiet after the last follow-up. The texts stopped; this one is yours.</p>
            <ul className={`mt-3 md:grid-cols-2 lg:grid-cols-3 ${sheet}`}>
              {waiting.map((d) => (
                <DealCard key={d.id} deal={d} state={state} />
              ))}
            </ul>
          </>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((c) => {
          const deals = sortFor(
            c.stage,
            state.deals.filter((d) => d.stage === c.stage),
          );
          return (
            <section key={c.stage} aria-labelledby={`col-${c.stage}`} className="min-w-0">
              <h2 id={`col-${c.stage}`} className="flex items-baseline justify-between border-b border-line pb-2 font-display text-lg font-semibold">
                {c.title}
                <span className="text-sm font-normal text-muted">{deals.length}</span>
              </h2>
              {deals.length === 0 ? (
                <p className="mt-3 text-sm text-muted">{c.empty}</p>
              ) : (
                <ul className={`mt-3 ${sheet}`}>
                  {deals.map((d) => (
                    <DealCard key={d.id} deal={d} state={state} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {lost.length > 0 ? (
        <details className="group/lost border-t border-line">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold [&::-webkit-details-marker]:hidden">
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" className="text-muted transition-transform duration-150 group-open/lost:rotate-90">
              <path d="M3 1.5 6.5 5 3 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Lost ({lost.length})
          </summary>
          <ul className={`mt-2 md:grid-cols-2 xl:grid-cols-4 ${sheet}`}>
            {lost.map((d) => (
              <DealCard key={d.id} deal={d} state={state} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
