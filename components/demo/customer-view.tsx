"use client";

// The customer's side: their phone, with every text the company would have
// sent, and the quote or invoice they can act on. Nothing is sent or charged.

import Link from "next/link";
import { useState } from "react";
import { primary, quiet, secondary } from "@/components/buttons";
import { BusinessMark } from "@/components/marks";
import { business } from "@/lib/brand";
import { demoRoutes } from "@/lib/demo-routes";
import { formatDay, formatMoney } from "@/lib/demo/dates";
import { acceptQuote, customerReply, declineQuote, payInvoice } from "@/lib/demo/engine";
import { update, useDemo } from "@/lib/demo/use-demo";
import type { Deal, DemoEvent } from "@/lib/demo/types";

type Bubble = { id: string; day: number; side: "in" | "out" | "note"; text: string };

function bubbles(deal: Deal, events: DemoEvent[]): Bubble[] {
  const out: Bubble[] = [];
  for (const e of events) {
    if (e.by === "customer" && e.kind === "reply") out.push({ id: e.id, day: e.day, side: "out", text: deal.reply?.text ?? "" });
    else if (e.by === "customer" && e.kind === "declined") out.push({ id: e.id, day: e.day, side: "out", text: deal.lost?.reason || "No thanks." });
    else if (e.by === "customer" && e.kind === "accepted") out.push({ id: `${e.id}-a`, day: e.day, side: "note", text: "You accepted the quote" });
    else if (e.by === "customer" && e.kind === "paid") out.push({ id: `${e.id}-p`, day: e.day, side: "note", text: `You paid ${formatMoney(deal.amount)}` });
    if (e.message) out.push({ id: e.id, day: e.day, side: "in", text: e.message });
  }
  return out;
}

function Thread({ items, startDate }: { items: Bubble[]; startDate: string }) {
  return (
    <ol className="grid gap-2">
      {items.map((b, i) => {
        const showDay = i === 0 || items[i - 1].day !== b.day;
        return (
          <li key={b.id} className="grid gap-2">
            {showDay ? <p className="mt-2 text-center text-xs text-muted">{formatDay(startDate, b.day)}</p> : null}
            {b.side === "note" ? (
              <p className="text-center text-xs font-semibold text-leaf-ink">{b.text}</p>
            ) : (
              <p
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[15px] leading-snug ${b.side === "in" ? "justify-self-start rounded-bl-sm bg-bubble" : "justify-self-end rounded-br-sm bg-brand text-on-brand"}`}
              >
                {b.text}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function QuoteCard({ deal }: { deal: Deal }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-xs text-muted">Quote from {business.name}</p>
      <p className="mt-1 font-semibold">{deal.job}</p>
      <p className="tabular mt-1 font-display text-2xl font-semibold">{formatMoney(deal.amount)}</p>
      <div className="mt-3 grid gap-2">
        <button type="button" className={primary} onClick={() => update((s) => acceptQuote(s, deal.id, "customer"))}>
          Accept the quote
        </button>
        <div className="grid gap-2">
          <button
            type="button"
            className={`${secondary} px-3`}
            onClick={() => update((s) => customerReply(s, deal.id, "I have a question about the quote. Can you call me?"))}
          >
            Ask a question
          </button>
          <button type="button" className={`${secondary} px-3`} onClick={() => update((s) => declineQuote(s, deal.id, "Not right now, thanks.", "customer"))}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}

function PayCard({ deal, startDate }: { deal: Deal; startDate: string }) {
  const [open, setOpen] = useState(false);
  const inv = deal.invoice!;
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-xs text-muted">
        Invoice {inv.number} · due {formatDay(startDate, inv.dueDay)}
      </p>
      <p className="mt-1 font-semibold">{deal.job}</p>
      <p className="tabular mt-1 font-display text-2xl font-semibold">{formatMoney(deal.amount)}</p>
      {open ? (
        <div className="mt-3 grid gap-2 rounded-xl bg-sunk p-3">
          <p className="text-sm">Demo: no card needed. Nothing is charged.</p>
          <button type="button" className={primary} onClick={() => update((s) => payInvoice(s, deal.id, "customer"))}>
            Pay {formatMoney(deal.amount)} now
          </button>
        </div>
      ) : (
        <button type="button" className={`${primary} mt-3 w-full`} onClick={() => setOpen(true)}>
          Pay by card or bank
        </button>
      )}
    </div>
  );
}

export function CustomerView({ id }: { id: string }) {
  const state = useDemo();
  if (!state) return <p className="text-muted">Opening the sample company…</p>;
  const deal = state.deals.find((d) => d.id === id);
  if (!deal) {
    return (
      <Link href={demoRoutes.board} className={quiet}>
        This job is not in the demo. Back to the board
      </Link>
    );
  }
  const items = bubbles(
    deal,
    state.events.filter((e) => e.dealId === id),
  );
  const canAnswer = deal.stage === "quote" && !deal.reply;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_380px] md:items-start">
      <div className="grid gap-4 md:pt-6">
        <Link href={demoRoutes.job(id)} className={`${quiet} -ml-2 self-start`}>
          <span aria-hidden="true">←</span> Back to the owner&rsquo;s view
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-tight">You are {deal.firstName} now</h1>
        <p className="max-w-prose text-muted">
          This is {deal.firstName}&rsquo;s phone: every text {business.name} sent, by itself, in order. Answer the quote or pay the invoice, then go back to the owner&rsquo;s view.
          The follow-ups stop the moment you do.
        </p>
        <p className="max-w-prose text-sm text-muted">In the demo, no text is sent and no card is charged.</p>
      </div>

      <div className="mx-auto w-full max-w-[380px] rounded-[2.25rem] border-8 border-ink bg-paper shadow-[0_24px_60px_-30px_rgba(21,32,30,0.5)]">
        <div className="flex items-center gap-2.5 rounded-t-[1.75rem] border-b border-line bg-surface px-4 py-3">
          <BusinessMark size={28} />
          <p className="leading-tight">
            <span className="block text-sm font-semibold">{business.name}</span>
            <span className="block text-xs text-muted">Text message</span>
          </p>
        </div>
        <div className="grid gap-4 px-3 pt-2 pb-4">
          <Thread items={items} startDate={state.startDate} />
          {canAnswer ? <QuoteCard deal={deal} /> : null}
          {deal.stage === "invoiced" ? <PayCard deal={deal} startDate={state.startDate} /> : null}
          {deal.stage === "paid" || deal.stage === "booked" || deal.reply || deal.stage === "lost" ? (
            <Link href={demoRoutes.job(id)} className={`${secondary} w-full`}>
              See it from the owner&rsquo;s side
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
