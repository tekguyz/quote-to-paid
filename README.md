# Quote to Paid

No quote or invoice goes quiet. Quote to Paid follows up on every quote and every unpaid invoice by text, politely, until the customer answers or pays. Then it stops.

This repo is the landing page and a one-click demo. The demo plays **Gumbo Limbo Air**, a made-up AC and heating company in South Florida. Press "Skip ahead a day" and watch follow-ups go out, customers answer, jobs get invoiced by themselves, and invoices get paid. Open any job and play the customer.

Nothing in the demo is sent or charged. It runs in the visitor's own browser, with no backend ([ADR 0001](docs/adr/0001-browser-only-demo.md)).

## The rules it shows

- Quotes: follow-ups 2, 5 and 9 days after sending.
- Invoices: sent when the job is marked done, due in 7 days, reminders 3 days after sending, on the due day and 3 days late.
- Stops the moment the customer answers or pays. Never more than three. Nothing on Sundays.
- After the last one, it asks the owner to call.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Tests: `npm run test:unit`. Never `npm test`.

## Built with

Next.js, Tailwind CSS, Vitest. Hosted on Vercel.

Built by [TEKGUYZ](https://tekguyz.com).
