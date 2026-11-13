"use client";

import Link from "next/link";
import { useState } from "react";
import { primary, quiet, secondary } from "@/components/buttons";
import { business } from "@/lib/brand";
import { demoRoutes } from "@/lib/demo-routes";
import { formatDay, formatMoney } from "@/lib/demo/dates";
import { dealLine, whenLabel } from "@/lib/demo/describe";
import { acceptQuote, dealStatus, declineQuote, markJobDone, nextFollowUp, payInvoice } from "@/lib/demo/engine";
import { update, useDemo } from "@/lib/demo/use-demo";
import type { Deal, DemoState } from "@/lib/demo/types";
import { StatusChip } from "./status";
import { Timeline } from "./timeline";

function NextStep({ deal, state }: { deal: Deal; state: DemoState }) {
  const status = dealStatus(deal, state.day);
  const next = nextFollowUp(deal, state);

  let title: string;
  let body: string;
  if (next) {
    const kind = deal.stage === "quote" ? "Follow-up" : "Reminder";
    title = `${kind} ${next.n} of ${next.of} goes out ${whenLabel(state, next.day)}, by itself`;
    body =
      next.n === next.of
        ? `That is the last one. If ${deal.firstName} stays quiet, it comes to you to call.`
        : `It stops the moment ${deal.firstName} ${deal.stage === "quote" ? "answers" : "pays"}.`;
  } else if (status === "replied") {
    title = `${deal.firstName} answered. Your turn.`;
    body = "The follow-ups stopped as soon as the reply came in.";
  } else if (status === "call") {
    title = `Give ${deal.firstName} a call`;
    body = `Three texts went out with no answer, so no more will. A call from ${business.owner} works better now.`;
  } else if (status === "booked") {
    title = `Crew booked for ${formatDay(state.startDate, deal.jobDay!)}`;
    body = "When the crew marks it done, the invoice goes out by itself. Nobody types it.";
  } else if (status === "paid") {
    title = `Paid ${formatDay(state.startDate, deal.paidDay!)}`;
    body = "Nothing more goes out.";
  } else if (status === "lost") {
    title = "Lost";
    body = "Nothing more goes out.";
  } else {
    title = dealLine(deal, state);
    body = "";
  }

  return (
    <div className="rounded-xs border border-line bg-surface p-5">
      <p className="text-sm text-muted">What happens next</p>
      <p className="mt-1 font-display text-xl font-semibold">{title}</p>
      {body ? <p className="mt-1 text-muted">{body}</p> : null}
    </div>
  );
}

function OwnerActions({ deal }: { deal: Deal }) {
  const [notice, setNotice] = useState("");
  const status = dealStatus(deal, 0);

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-3">
        {deal.stage === "quote" ? (
          <>
            {deal.reply ? (
              <button type="button" className={primary} onClick={() => setNotice("Not available in the demo.")}>
                Answer {deal.firstName}
              </button>
            ) : null}
            <button type="button" className={deal.reply ? secondary : primary} onClick={() => update((s) => acceptQuote(s, deal.id, "owner"))}>
              Mark won
            </button>
            <button type="button" className={secondary} onClick={() => update((s) => declineQuote(s, deal.id, "", "owner"))}>
              Mark lost
            </button>
          </>
        ) : null}
        {deal.stage === "booked" ? (
          <button type="button" className={primary} onClick={() => update((s) => markJobDone(s, deal.id, "owner"))}>
            Mark job done
          </button>
        ) : null}
        {deal.stage === "invoiced" ? (
          <button type="button" className={secondary} onClick={() => update((s) => payInvoice(s, deal.id, "owner"))}>
            Mark paid by cash or check
          </button>
        ) : null}
        {status === "call" ? (
          <button type="button" className={secondary} onClick={() => setNotice("Not available in the demo.")}>
            Call {deal.firstName}
          </button>
        ) : null}
      </div>
      <p role="status" className="min-h-5 text-sm text-clay-ink">
        {notice}
      </p>
    </div>
  );
}

export function DealView({ id }: { id: string }) {
  const state = useDemo();
  if (!state) return <p className="text-muted">Opening the sample company…</p>;
  const deal = state.deals.find((d) => d.id === id);
  if (!deal) {
    return (
      <div className="grid gap-3">
        <h1 className="font-display text-2xl font-semibold">This job is not in the demo</h1>
        <Link href={demoRoutes.board} className={quiet}>
          Back to the board
        </Link>
      </div>
    );
  }

  const events = state.events.filter((e) => e.dealId === id);
  const hasCustomerSide = deal.quote || deal.invoice;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
      <div className="grid gap-6">
        <Link href={demoRoutes.board} className={`${quiet} -ml-2 self-start`}>
          <span aria-hidden="true">←</span> Board
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight">{deal.customer}</h1>
            <StatusChip status={dealStatus(deal, state.day)} />
          </div>
          <p className="mt-1 text-muted">
            {deal.job} · {deal.town}
            {deal.invoice ? ` · Invoice ${deal.invoice.number}` : ""}
          </p>
          <p className="tabular mt-3 font-display text-4xl font-semibold">{formatMoney(deal.amount)}</p>
        </div>
        <NextStep deal={deal} state={state} />
        <OwnerActions deal={deal} />
        {hasCustomerSide ? (
          <Link
            href={demoRoutes.customer(deal.id)}
            className="flex items-center justify-between gap-4 rounded-xs border border-brand bg-brand-soft p-5 transition-colors duration-150 hover:bg-surface"
          >
            <span>
              <span className="block font-display text-lg font-semibold">See what {deal.firstName} sees</span>
              <span className="block text-sm text-muted">
                Their phone, with every text.
                {deal.stage === "invoiced" ? " Play the customer: pay the invoice." : deal.stage === "quote" && !deal.reply ? " Play the customer: answer the quote." : ""}
              </span>
            </span>
            <span aria-hidden="true" className="text-2xl text-brand">
              →
            </span>
          </Link>
        ) : null}
      </div>
      <section aria-labelledby="history">
        <h2 id="history" className="mb-4 font-display text-xl font-semibold">
          Everything that happened
        </h2>
        <Timeline events={events} startDate={state.startDate} />
      </section>
    </div>
  );
}
