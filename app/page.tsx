import Link from "next/link";
import { primary } from "@/components/buttons";
import { Phone } from "@/components/phone";
import { Wordmark } from "@/components/marks";
import { business } from "@/lib/brand";
import { demoRoutes } from "@/lib/demo-routes";

// The landing page: the page every link opens (DEMO-STANDARD.md). It sells the
// idea by itself, on a phone first. No prices, no statistics.

const bubbleIn = "max-w-[85%] justify-self-start rounded-[18px] rounded-bl-[4px] bg-bubble px-3.5 py-2";

function HeroPhone() {
  return (
    <div aria-hidden="true" inert className="relative mx-auto w-fit">
      <Phone label="Maria's texts" className="mx-auto max-md:w-[min(100%,300px)]">
        <div className="grid gap-2 text-[15px] leading-snug">
          <p className="text-center text-xs text-muted">Tuesday</p>
          <p className={`${bubbleIn}`}>
            Hi Maria, here&rsquo;s your quote for the 3-ton AC system replacement: $9,850. Tap the link to see what&rsquo;s included.
          </p>
          <p className="mt-1 text-center text-xs text-muted">Thursday</p>
          <p className={`${bubbleIn}`}>Hi Maria, just checking the quote came through OK. Any questions, reply here. — Renata</p>
          <p className="max-w-[85%] justify-self-end rounded-[18px] rounded-br-[4px] bg-brand px-3.5 py-2 text-on-brand">Yes, let&rsquo;s do it! Is Thursday OK?</p>
          <p className="mt-1 justify-self-center rounded-xs bg-leaf-soft px-2 py-0.5 text-xs font-semibold text-leaf-ink">Follow-ups stopped · job booked</p>
        </div>
      </Phone>
      <div className="absolute top-[22%] -left-4 rounded-xs border border-ink bg-surface px-4 py-3 sm:-left-16">
        <p className="text-xs text-muted">Follow-up 1 of 3</p>
        <p className="text-sm font-semibold">Sent by itself, on day 2</p>
      </div>
    </div>
  );
}

const steps = [
  { n: "1", title: "Send the quote", body: "The way you do now. It goes in as one line on the board." },
  { n: "2", title: "It follows up by itself", body: "A short, polite text on day 2, 5 and 9, signed by you. The moment they answer, it stops." },
  { n: "3", title: "The job's done, the invoice goes out", body: "When the crew marks the job done, the invoice is sent with a pay link. Nobody types it." },
  { n: "4", title: "Reminders until it's paid", body: "Three at most, then it stops and tells you who to call. Paid shows up on the board." },
];

const promises = [
  { title: "Three texts at most", body: "Never a fourth. After the last one, it hands the job to you with a note to call." },
  { title: "Stops the moment they answer", body: "A yes, a no or a question ends the follow-ups right away. Paying ends the reminders." },
  { title: "Quiet on Sundays", body: "A text due on a Sunday waits for Monday morning." },
  { title: "Sounds like you", body: "Short, friendly, signed with your name. No pushy sales lines." },
];

function BoardPreview() {
  const rows = [
    { who: "Grace O.", what: "Duct cleaning and sealing", chip: "Give them a call", tone: "bg-clay-soft text-clay-ink", amount: "$1,450" },
    { who: "Dwayne T.", what: "Air handler and coil", chip: "Replied: your turn", tone: "bg-clay-soft text-clay-ink", amount: "$4,300" },
    { who: "Sam K.", what: "4-ton AC replacement", chip: "Follow-up 1 of 3 tomorrow", tone: "bg-sun-soft text-sun-ink", amount: "$11,200" },
    { who: "Luis M.", what: "Mini-split, garage office", chip: "Invoice sent", tone: "bg-sun-soft text-sun-ink", amount: "$3,200" },
    { who: "Ana & Tom G.", what: "Condenser fan motor", chip: "Paid", tone: "bg-leaf-soft text-leaf-ink", amount: "$640" },
  ];
  return (
    <div aria-hidden="true" className="rounded-xs border border-line bg-surface p-4 sm:p-6">
      <p className="font-display text-lg font-semibold">This morning</p>
      <ul className="mt-3 divide-y divide-line">
        {rows.map((r) => (
          <li key={r.who} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{r.who}</p>
              <p className="truncate text-sm text-muted">{r.what}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="tabular font-display font-semibold">{r.amount}</span>
              <span className={`rounded-xs px-2 py-0.5 text-xs font-semibold ${r.tone}`}>{r.chip}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Landing() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Wordmark />
        <Link href={demoRoutes.board} className={primary}>
          Try the demo
        </Link>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-14 px-4 pt-8 pb-20 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:pt-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-brand uppercase">For roofing and AC companies</p>
            <h1 className="mt-3 font-display text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">No quote or invoice goes quiet.</h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Quote to Paid follows up on every quote and every unpaid invoice by text, politely, until the customer answers or pays. Then it stops.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={demoRoutes.board} className={`${primary} min-h-12 px-7 text-lg`}>
                Try the demo
              </Link>
              <p className="text-sm text-muted">No signup. Opens a made-up AC company.</p>
            </div>
          </div>
          <HeroPhone />
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              A quote with no answer isn&rsquo;t a no. It just needs a nudge nobody on the truck has time to send.
            </h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <li key={s.n}>
                  <span className="tabular flex size-10 items-center justify-center rounded-xs bg-brand-soft font-display text-lg font-semibold text-brand">{s.n}</span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Persistent. Never pushy.</h2>
            <p className="mt-3 max-w-prose text-muted">Your customers hear from you at the right time, and never too often. The rules are simple enough to say out loud.</p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              {promises.map((p) => (
                <div key={p.title} className="border-t-2 border-brand pt-3">
                  <dt className="font-semibold">{p.title}</dt>
                  <dd className="mt-1 text-muted">{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <BoardPreview />
            <p className="mt-3 text-sm text-muted">One board: what&rsquo;s waiting, who answered, who to call, what got paid.</p>
          </div>
        </section>

        <section className="bg-brand text-on-brand">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">See a week go by in a minute.</h2>
              <p className="mt-3 max-w-2xl text-on-brand/85">
                The demo opens {business.name}, a made-up AC company in South Florida. Press &ldquo;Skip ahead a day&rdquo; and watch the follow-ups go out, customers answer, and invoices get paid.
                Then play the customer yourself.
              </p>
            </div>
            <Link href={demoRoutes.board} className="inline-flex min-h-12 items-center justify-center rounded-xs bg-sun px-7 text-lg font-semibold text-ink transition-colors duration-150 hover:bg-paper">
              Try the demo
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-6">
        <p>{business.name} is a made-up company. In the demo, no text is sent and no card is charged.</p>
        <p>
          Built by{" "}
          <a href="https://tekguyz.com" className="inline-flex min-h-11 items-center text-ink underline underline-offset-4">
            TEKGUYZ
          </a>
        </p>
      </footer>
    </>
  );
}
