// Demo days to real dates. Day 0 is the date the visitor opened the demo.
// All math is in UTC so a day never shifts with the visitor's time zone.

export function dayDate(startDate: string, day: number): Date {
  const [y, m, d] = startDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + day));
}

/** 0 is Sunday. */
export function weekday(startDate: string, day: number): number {
  return dayDate(startDate, day).getUTCDay();
}

const short = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const long = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** "Tue, Nov 11" */
export function formatDay(startDate: string, day: number): string {
  return short.format(dayDate(startDate, day));
}

/** "Tuesday, November 11" */
export function formatDayLong(startDate: string, day: number): string {
  return long.format(dayDate(startDate, day));
}

/** "today", "tomorrow", "in 3 days", "yesterday", "3 days ago" */
export function relativeDay(today: number, day: number): string {
  const diff = day - today;
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  return diff > 0 ? `in ${diff} days` : `${-diff} days ago`;
}

/** The visitor's own date today, as YYYY-MM-DD. */
export function localToday(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
