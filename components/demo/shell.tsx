"use client";

// The frame around every demo screen: the demo banner, the company header with
// the menu, the Today bar with "Skip ahead a day", and the day summary.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { primary } from "@/components/buttons";
import { BusinessName } from "@/components/marks";
import { demoRoutes } from "@/lib/demo-routes";
import { formatDay, formatDayLong } from "@/lib/demo/dates";
import { clearLastSkip, resetDemo, skipDay, useDemo, useLastSkip } from "@/lib/demo/use-demo";
import { DaySummary } from "./day-summary";

const bannerLink = "inline-flex min-h-11 items-center underline-offset-4 hover:underline";

/** DESIGN.md, Demo banner. `data-demo-banner` lets tools/capture hide it. */
function DemoBanner() {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function reset() {
    resetDemo();
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 3000);
  }

  return (
    <aside aria-label="Demo" data-demo-banner className="bg-ink text-sm text-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 px-4 sm:px-6">
        <p className="py-2" role="status">
          {done ? "Back to day one of the sample company." : "Demo: a made-up company. Nothing is really sent or charged."}
        </p>
        <div className="flex flex-wrap items-center gap-x-5">
          <button type="button" onClick={reset} className={bannerLink}>
            Reset demo
          </button>
          <Link href="/" className={bannerLink}>
            Leave the demo
          </Link>
          <p className="text-paper/80">
            Built by{" "}
            <a href="https://tekguyz.com" className={`${bannerLink} text-paper underline`}>
              TEKGUYZ
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}

const menu = [
  { label: "Board", href: demoRoutes.board },
  { label: "Activity", href: demoRoutes.activity },
  { label: "Follow-up rules", href: demoRoutes.rules },
];

function TodayBar() {
  const state = useDemo();
  if (!state) return <div className="h-11" />;
  return (
    <div className="flex items-center justify-between gap-3 md:justify-end">
      <p className="text-sm leading-tight">
        <span className="block text-xs text-muted">Today in the demo</span>
        <span className="font-semibold md:hidden">{formatDay(state.startDate, state.day)}</span>
        <span className="hidden font-semibold md:inline">{formatDayLong(state.startDate, state.day)}</span>
      </p>
      <button type="button" onClick={skipDay} className={`${primary} shrink-0`}>
        Skip ahead a day
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 3l5 5-5 5M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export function DemoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lastSkip = useLastSkip();
  const isCustomer = pathname.endsWith("/customer");
  const active = (href: string) =>
    href === demoRoutes.board ? pathname === href || pathname.startsWith("/demo/jobs") || pathname === demoRoutes.newQuote : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-30 focus:rounded-xs focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <DemoBanner />
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pt-4 sm:px-6 md:flex-row md:items-center md:justify-between md:pb-3">
          <Link href={demoRoutes.board} className="min-h-11 self-start rounded-xs">
            <BusinessName />
          </Link>
          <div className="hidden md:block">
            <TodayBar />
          </div>
        </div>
        <nav aria-label="Demo menu" className="mx-auto max-w-6xl overflow-x-auto px-2 sm:px-4">
          <ul className="flex gap-1">
            {menu.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  aria-current={active(m.href) ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-semibold whitespace-nowrap ${active(m.href) ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"}`}
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {lastSkip && !isCustomer ? <DaySummary key={lastSkip.day} skip={lastSkip} onClose={clearLastSkip} /> : null}
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-32 sm:px-6 md:pb-16">
        {children}
      </main>
      <div
        data-today-bar
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
      >
        <TodayBar />
      </div>
    </>
  );
}
