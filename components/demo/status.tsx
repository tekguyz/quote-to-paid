import type { Status } from "@/lib/demo/engine";

const look: Record<Status, { label: string; className: string }> = {
  waiting: { label: "Waiting on answer", className: "bg-sun-soft text-sun-ink" },
  replied: { label: "Replied: your turn", className: "bg-clay-soft text-clay-ink" },
  call: { label: "Give them a call", className: "bg-clay-soft text-clay-ink" },
  booked: { label: "Job booked", className: "bg-sky-soft text-sky-ink" },
  unpaid: { label: "Invoice sent", className: "bg-sun-soft text-sun-ink" },
  overdue: { label: "Past due", className: "bg-clay-soft text-clay-ink" },
  paid: { label: "Paid", className: "bg-leaf-soft text-leaf-ink" },
  lost: { label: "Lost", className: "bg-sunk text-muted" },
};

export function StatusChip({ status }: { status: Status }) {
  const { label, className } = look[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}
