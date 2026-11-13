"use client";

import Link from "next/link";
import { useState } from "react";
import { demoRoutes } from "@/lib/demo-routes";
import { formatDayLong } from "@/lib/demo/dates";
import { useDemo } from "@/lib/demo/use-demo";
import { EventDot } from "./timeline";

export function Activity() {
  const state = useDemo();
  const [onlyTexts, setOnlyTexts] = useState(false);
  if (!state) return <p className="text-muted">Opening the sample company…</p>;

  const name = (id: string) => state.deals.find((d) => d.id === id)?.customer ?? "";
  const events = state.events.filter((e) => (onlyTexts ? e.message && e.by === "auto" : e.kind !== "job-done"));
  const days = [...new Set(events.map((e) => e.day))].sort((a, b) => b - a);
  const autoCount = state.events.filter((e) => e.message && e.by === "auto").length;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-1 text-muted">
          {autoCount} texts went out by themselves so far. Nobody typed them. In the demo, none were really sent.
        </p>
      </div>
      <label className="inline-flex min-h-11 items-center gap-3 self-start">
        <input type="checkbox" className="size-5 accent-brand" checked={onlyTexts} onChange={(e) => setOnlyTexts(e.target.checked)} />
        Only the texts that went out by themselves
      </label>
      <div className="grid gap-8">
        {days.map((day) => (
          <section key={day} aria-labelledby={`day-${day}`}>
            <h2 id={`day-${day}`} className="border-b border-line pb-2 font-display text-lg font-semibold">
              {formatDayLong(state.startDate, day)}
              {day === state.day ? <span className="ml-2 text-sm font-normal text-muted">today</span> : null}
            </h2>
            <ul className="mt-2 grid gap-1">
              {events
                .filter((e) => e.day === day)
                .reverse()
                .map((e) => (
                  <li key={e.id} className="flex items-start gap-3">
                    <span className="mt-2 flex">
                      <EventDot kind={e.kind} />
                    </span>
                    <div className="min-w-0">
                      <Link href={demoRoutes.job(e.dealId)} className="block min-h-11 py-2.5 underline-offset-4 hover:underline">
                        <span className="font-semibold">{name(e.dealId)}</span> · {e.text}
                      </Link>
                      {e.message && onlyTexts ? <p className="mt-1 max-w-2xl bg-bubble px-3.5 py-2 text-sm">{e.message}</p> : null}
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
