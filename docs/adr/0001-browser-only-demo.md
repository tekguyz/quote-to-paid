# The demo runs in the browser, with no backend

The TEKGUYZ demo standard expects a Supabase anonymous sign-in per Demo Visitor. Quote to Paid uses a browser-only demo instead, like FancyFam (tekguyz/fancyfam ADR 0001): the sample company ships with the app, the demo clock and everything the visitor does live in their own browser. Every visitor is walled off by design, nothing costs money, nothing is sent, and there is no sign-in, visit cap or cleanup job to build. All demo data goes through one store module (`lib/demo/use-demo.ts`) that a real backend can replace.

## Consequences

- The standard's server rules (POST-only sign-in, RLS walls, visit cap, 7-day cleanup) have nothing to guard. Do not "fix" the demo by adding them.
- "Try the demo" is a plain link: opening the demo writes nothing on a server.
- There is no sign-in page, because there is no product to sign in to yet.
- Time in the demo is a counter ("day 0, day 1…") the visitor moves forward, so follow-ups can be seen firing in a minute.
