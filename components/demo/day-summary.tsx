"use client";

import Link from "next/link";
import { demoRoutes } from "@/lib/demo-routes";
import { formatDayLong } from "@/lib/demo/dates";
import { useDemo } from "@/lib/demo/use-demo";
import type { DemoEvent } from "@/lib/demo/types";
import { EventDot } from "./timeline";

/** What happened on the day the visitor just skipped to. */
export function DaySummary({ skip, onClose }: { skip: { day: number; events: DemoEvent[] }; onClose: () => void }) {
  const state = useDemo();
  if (!state) return null;
  const name = (id: string) => state.deals.find((d) => d.id === id)?.customer ?? "";
  const shown = skip.events.filter((e) => e.kind !== "job-done");
  const count = shown.length;

  return (
    <section aria-labelledby="day-summary" className="border-b border-line bg-brand-soft">
      <div className="hairline-draw h-0.5 bg-brand" />
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6" role="status">
        <div className="flex items-start justify-between gap-4">
          <h2 id="day-summary" className="font-display text-lg font-semibold">
            {formatDayLong(state.startDate, skip.day)}:{" "}
            {count === 0 ? "a quiet day. Nothing was due." : `${count} ${count === 1 ? "thing" : "things"} happened while you were on the job`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mt-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xs text-muted hover:bg-surface hover:text-ink"
            aria-label="Close the day summary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {count > 0 ? (
          <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {shown.map((e, i) => (
              <li key={e.id} className="rise flex items-start gap-2.5 text-sm" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="mt-2 flex">
                  <EventDot kind={e.kind} />
                </span>
                <Link href={demoRoutes.job(e.dealId)} className="block min-h-11 rounded-xs py-2.5 underline-offset-4 hover:underline">
                  <span className="font-semibold">{name(e.dealId)}</span> · {e.text}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
