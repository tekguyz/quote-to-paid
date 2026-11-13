"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { primary, quiet } from "@/components/buttons";
import { demoRoutes } from "@/lib/demo-routes";
import { addQuote } from "@/lib/demo/engine";
import { update, useDemo } from "@/lib/demo/use-demo";

const towns = ["Boca Raton", "Coconut Creek", "Deerfield Beach", "Lighthouse Point", "Margate", "Parkland", "Pompano Beach"];
const field = "field mt-1";

export function NewQuote() {
  const state = useDemo();
  const router = useRouter();
  const [error, setError] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!state) return;
    const form = new FormData(e.currentTarget);
    const customer = String(form.get("customer") ?? "").trim();
    const job = String(form.get("job") ?? "").trim();
    const amount = Math.round(Number(form.get("amount")));
    if (!customer || !job || !(amount > 0)) {
      setError("Fill in the customer, the job and an amount above zero.");
      return;
    }
    const id = `d${state.nextId}`;
    update((s) => addQuote(s, { id, customer: customer.slice(0, 40), town: String(form.get("town")), job: job.slice(0, 60), amount: Math.min(amount, 999999) }));
    router.push(demoRoutes.job(id));
  }

  return (
    <div className="grid max-w-xl gap-6">
      <Link href={demoRoutes.board} className={`${quiet} -ml-2 self-start`}>
        <span aria-hidden="true">←</span> Board
      </Link>
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">New quote</h1>
        <p className="mt-1 text-muted">Send it, and the follow-ups are planned by themselves. It stays in this browser; nothing is sent.</p>
      </div>
      <form onSubmit={submit} className="grid gap-4 rounded-xs border border-line bg-surface p-5" noValidate>
        <label className="font-semibold">
          Customer
          <input name="customer" className={field} placeholder="First name and last initial" autoComplete="off" required maxLength={40} />
        </label>
        <label className="font-semibold">
          Town
          <select name="town" className={field} defaultValue="Pompano Beach">
            {towns.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="font-semibold">
          Job
          <input name="job" className={field} defaultValue="AC system replacement" required maxLength={60} />
        </label>
        <label className="font-semibold">
          Amount
          <span className="relative mt-1 block">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">$</span>
            <input name="amount" type="number" inputMode="numeric" min={1} className={`${field} mt-0 pl-7`} required />
          </span>
        </label>
        <p role="alert" className="min-h-5 text-sm text-clay-ink">
          {error}
        </p>
        <button type="submit" className={`${primary} justify-self-start`}>
          Send quote
        </button>
      </form>
    </div>
  );
}
