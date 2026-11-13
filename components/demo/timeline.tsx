import { formatDay } from "@/lib/demo/dates";
import type { DemoEvent, EventKind } from "@/lib/demo/types";

const dot: Record<EventKind, string> = {
  "quote-sent": "bg-brand",
  "follow-up": "bg-sun",
  reply: "bg-clay-ink",
  accepted: "bg-sky-ink",
  declined: "bg-muted",
  "job-done": "bg-sky-ink",
  "invoice-sent": "bg-brand",
  reminder: "bg-sun",
  paid: "bg-leaf-ink",
  "needs-call": "bg-clay-ink",
};

export function EventDot({ kind }: { kind: EventKind }) {
  return <span aria-hidden="true" className={`mt-2 size-2 shrink-0 rounded-full ${dot[kind]}`} />;
}

const who: Record<DemoEvent["by"], string> = {
  auto: "Sent by itself",
  customer: "Customer",
  owner: "You",
};

/** A deal's history, newest last, with each text the customer would have got. */
export function Timeline({ events, startDate }: { events: DemoEvent[]; startDate: string }) {
  return (
    <ol className="relative grid gap-5 border-l border-line pl-5">
      {events.map((e) => (
        <li key={e.id} className="relative">
          <span aria-hidden="true" className={`absolute top-1.5 -left-[24.5px] size-2 rounded-full ring-4 ring-paper ${dot[e.kind]}`} />
          <p className="text-xs text-muted">
            {formatDay(startDate, e.day)} · {who[e.by]}
          </p>
          <p className="mt-0.5 font-semibold">{e.text}</p>
          {e.message ? (
            <figure className="mt-2 max-w-md">
              <blockquote className="rounded-xs bg-bubble px-4 py-2.5 text-sm leading-relaxed">{e.message}</blockquote>
              <figcaption className="mt-1 text-xs text-muted">Text message. In the demo, nothing is sent.</figcaption>
            </figure>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
