// The follow-up rules, drawn as two short timelines. Read-only in the demo.

import { rules } from "@/lib/demo/engine";

type Mark = { day: number; label: string; tone: "brand" | "sun" | "clay" };

function Track({ title, marks, length }: { title: string; marks: Mark[]; length: number }) {
  const tone = { brand: "bg-brand", sun: "bg-sun", clay: "bg-clay-ink" };
  return (
    <figure className="rounded-xs border border-line bg-surface p-5">
      <figcaption className="font-display text-xl font-semibold">{title}</figcaption>
      <ol className="mt-4 grid gap-3 lg:hidden">
        {marks.map((m) => (
          <li key={m.label} className="flex items-start gap-3">
            <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${tone[m.tone]}`} aria-hidden="true" />
            <span>
              <span className="tabular font-semibold">Day {m.day}</span> · {m.label}
            </span>
          </li>
        ))}
      </ol>
      <div className="relative mt-6 hidden h-24 lg:block" aria-hidden="true">
        <div className="absolute inset-x-0 top-3 h-px bg-line" />
        {marks.map((m, i) => {
          // The first label hangs right of its dot and the last one left, so neither is cut off at the edge.
          const edge = i === 0 ? "text-left" : i === marks.length - 1 ? "-translate-x-full text-right" : "-translate-x-1/2 text-center";
          const dotEdge = i === 0 ? "" : i === marks.length - 1 ? "ml-auto" : "mx-auto";
          return (
          <div key={m.label} className={`absolute top-0 w-24 ${edge}`} style={{ left: `${(m.day / length) * 100}%` }}>
            <span className={`block size-6 rounded-full border-4 border-surface ${dotEdge} ${tone[m.tone]}`} />
            <span className="tabular mt-1 block text-xs text-muted">Day {m.day}</span>
            <span className="block text-sm leading-tight font-semibold">{m.label}</span>
          </div>
          );
        })}
      </div>
    </figure>
  );
}

export function Rules() {
  const [q1, q2, q3] = rules.quoteFollowUps;
  const [r1, r2, r3] = rules.invoiceReminders;
  const call = rules.callAfterLast;
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Follow-up rules</h1>
        <p className="mt-1 max-w-prose text-muted">Polite, short, and capped. Every text is signed by a person, and it stops the moment the customer answers or pays.</p>
      </div>
      <Track
        title="After a quote goes out"
        length={q3 + call + 1}
        marks={[
          { day: 0, label: "Quote sent", tone: "brand" },
          { day: q1, label: "Did it come through?", tone: "sun" },
          { day: q2, label: "Happy to walk you through it", tone: "sun" },
          { day: q3, label: "Last note from me", tone: "sun" },
          { day: q3 + call, label: "You give them a call", tone: "clay" },
        ]}
      />
      <Track
        title="After the job is done"
        length={r3 + call + 1}
        marks={[
          { day: 0, label: "Invoice sent by itself", tone: "brand" },
          { day: r1, label: "Friendly reminder", tone: "sun" },
          { day: r2, label: "Due today", tone: "sun" },
          { day: r3, label: "Last reminder", tone: "sun" },
          { day: r3 + call, label: "You give them a call", tone: "clay" },
        ]}
      />
      <section aria-labelledby="stop" className="rounded-xs border border-line bg-surface p-5">
        <h2 id="stop" className="font-display text-xl font-semibold">
          When it stops
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li>The moment the customer answers: yes, no, or a question.</li>
          <li>The moment the invoice is paid, by link, cash or check.</li>
          <li>After three texts. There is never a fourth.</li>
          <li>On Sundays. A text due on a Sunday waits for Monday.</li>
        </ul>
        <p className="mt-4 text-sm text-muted">Changing the days and the wording: not available in the demo.</p>
      </section>
    </div>
  );
}
