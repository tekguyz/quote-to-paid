@AGENTS.md

# Quote to Paid

A show-off app for TEKGUYZ package D, "Quote to paid": follows up on every quote and unpaid invoice until it is answered or paid. A landing page plus a one-click demo with a made-up AC company, Gumbo Limbo Air. Rules for every demo: `C:/Projects/claude-config/DEMO-STANDARD.md`.

## Hard rules

- **No backend** (`docs/adr/0001-browser-only-demo.md`). The demo lives in the visitor's browser. Do not add sign-in, a database, or a visit cap.
- **Nothing is ever sent or charged.** No email, SMS or payment code, not even behind a flag.
- **Made-up names only.** The company, customers, towns-as-addresses and amounts are invented. Never a real business. No phone numbers anywhere.
- **No TEKGUYZ prices and no statistics** on any screen.
- TEKGUYZ appears only as the small "Built by TEKGUYZ" credit.

## Where things are

| Path | Holds |
| --- | --- |
| `lib/demo/engine.ts` | The follow-up rules and every action. Pure functions, fully tested |
| `lib/demo/sample.ts` | The sample company. The engine plays its past 16 days |
| `lib/demo/messages.ts` | The text of every message a customer would get |
| `lib/demo/use-demo.ts` | The browser store. The only code that touches storage |
| `lib/brand.ts` | The sample company's name, owner and area |
| `components/demo/` | The demo screens |
| `app/page.tsx` | The landing page |
| `docs/design/logos.html` | Logo options |
| `DESIGN.md` | The look |

## Commands

- `npm run dev` · `npm run typecheck` · `npm run test:unit` · `npm run build`
- **Never `npm test`.** It prints an error on purpose.
- Showcase pictures: `node C:/Projects/claude-config/tools/capture/capture.mjs quote-to-paid --out C:/Projects/quote-to-paid/showcase`
