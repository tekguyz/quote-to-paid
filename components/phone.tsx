"use client";

// A phone drawn in the page (claude-config LOOKS.md, "Phone and browser frames"):
// 9:19.5 body, device corners, island, status bar, a Messages header, and a
// thread that scrolls inside so the phone never runs off a 1440 x 900 screen.
// Colors and type come from the demo's tokens. Sizing lives in `.phone` (globals.css).

import { useEffect, useRef, type ReactNode } from "react";
import { BusinessMark } from "@/components/marks";
import { business } from "@/lib/brand";

function StatusBar() {
  return (
    <div className="relative flex h-11 shrink-0 items-center justify-between px-6 pt-1 text-[13px] font-semibold text-ink">
      <span className="tabular">9:41</span>
      <span aria-hidden="true" className="absolute top-2.5 left-1/2 h-[25px] w-[29%] -translate-x-1/2 rounded-full bg-ink" />
      <span aria-hidden="true" className="flex items-center gap-1">
        <svg width="17" height="11" viewBox="0 0 17 11">
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="currentColor" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="currentColor" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11">
          <path d="M7.5 2.2c2.2 0 4.2.8 5.7 2.2l1.1-1.1A9.6 9.6 0 0 0 7.5.6 9.6 9.6 0 0 0 .7 3.3l1.1 1.1a8 8 0 0 1 5.7-2.2Z" fill="currentColor" />
          <path d="M7.5 5.4c1.3 0 2.5.5 3.4 1.3L12 5.6a6.4 6.4 0 0 0-9 0l1.1 1.1c.9-.8 2.1-1.3 3.4-1.3Z" fill="currentColor" />
          <path d="M7.5 8.4c.5 0 .9.2 1.2.5L7.5 10.1 6.3 8.9c.3-.3.7-.5 1.2-.5Z" fill="currentColor" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" fill="none" stroke="currentColor" opacity="0.45" />
          <rect x="2" y="2" width="15" height="8" rx="1.5" fill="currentColor" />
          <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

function MessagesHeader() {
  return (
    <div className="grid shrink-0 grid-cols-[2rem_1fr_2rem] items-center border-b border-line bg-paper px-3 pb-2">
      <svg aria-hidden="true" width="12" height="20" viewBox="0 0 12 20" className="text-brand">
        <path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="flex flex-col items-center gap-0.5 leading-tight">
        <BusinessMark size={34} />
        <span className="text-[13px] font-semibold">{business.name}</span>
        <span className="text-xs text-muted">Text message</span>
      </p>
    </div>
  );
}

export function Phone({
  label,
  scrollKey,
  footer,
  className = "",
  children,
}: {
  /** Names the thread for screen readers, e.g. "Maria's texts". */
  label: string;
  /** When this changes, the thread scrolls to the newest text. */
  scrollKey?: string | number;
  /** Fixed area under the thread: the quote or invoice the customer acts on. */
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const thread = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [scrollKey]);

  return (
    <div className={`phone relative rounded-[3rem] bg-ink p-[9px] ${className}`}>
      {/* Side buttons: silent switch and volume on the left, power on the right. */}
      <span aria-hidden="true" className="absolute top-[16%] -left-[3px] h-6 w-[3px] rounded-l-xs bg-ink" />
      <span aria-hidden="true" className="absolute top-[23%] -left-[3px] h-11 w-[3px] rounded-l-xs bg-ink" />
      <span aria-hidden="true" className="absolute top-[31%] -left-[3px] h-11 w-[3px] rounded-l-xs bg-ink" />
      <span aria-hidden="true" className="absolute top-[26%] -right-[3px] h-16 w-[3px] rounded-r-xs bg-ink" />
      <div className="flex h-full flex-col overflow-hidden rounded-[2.45rem] bg-paper">
        <StatusBar />
        <MessagesHeader />
        <div
          ref={thread}
          role="region"
          aria-label={label}
          tabIndex={0}
          data-screen-ok="scroll-inside: the drawn phone's thread scrolls inside it so the phone fits the screen (LOOKS.md)"
          className="phone-thread flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-3 focus-visible:outline-offset-[-2px]"
        >
          <div className="mt-auto">{children}</div>
        </div>
        <div className={`shrink-0 ${footer ? "border-t border-line bg-surface" : ""}`}>
          {footer ? <div className="@container px-3 pt-3">{footer}</div> : null}
          <span aria-hidden="true" className="mx-auto mt-2 mb-2 block h-[5px] w-[34%] rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}
