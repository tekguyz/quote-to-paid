// Logos. The product mark is option A from docs/design/logos.html.
// The business mark belongs to the made-up Gumbo Limbo Air.

import { business } from "@/lib/brand";

export function ProductMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="8" fill="#0e5c57" />
      <path
        d="M9 9.5h14a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-6.5L12 25v-3.5H9A2.5 2.5 0 0 1 6.5 19v-7A2.5 2.5 0 0 1 9 9.5z"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M11.8 15.6l2.8 2.8 5.6-5.6" fill="none" stroke="#f2a541" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight ${className}`}>
      <ProductMark size={28} />
      Quote to Paid
    </span>
  );
}

export function BusinessMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#f2a541" />
      <path d="M16 25c-5-3-7-7.5-6-13 4.5.5 8 3 9 7.5" fill="#0e5c57" />
      <path d="M16 25c4.5-2.5 7-6.5 6.5-12-3 .3-5.5 1.8-7 4.3" fill="#0a4541" />
      <path d="M16 25V15" stroke="#f5f3ee" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function BusinessName() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BusinessMark />
      <span className="leading-tight">
        <span className="block font-display text-base font-semibold">{business.name}</span>
        <span className="block text-xs text-muted">{business.trade} · {business.area}</span>
      </span>
    </span>
  );
}
