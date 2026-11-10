# Quote to Paid: landing page and one-click demo

Proof for TEKGUYZ package D, "Quote to paid" (`tekguyz-one` `brand/solutions.md` § 6): Quote Chaser, Invoice Chaser and automated invoicing. The founder skipped the brainstorm questions on 2026-11-10 ("go ahead and build it") with one rule: the sample business must not be a roofer, because the missed-call demo built the same week uses a made-up roofer.

## Intent

A roofer or HVAC owner opens one link and sees, in a minute, that no quote and no invoice goes quiet any more. The moment that sells it: they press "Skip ahead a day" and watch the follow-ups go out by themselves, a customer answer, and the follow-ups stop.

## Goals

- A landing page that sells the idea by itself, on a phone first.
- A one-click demo with no signup, playing a made-up South Florida HVAC company, **Gumbo Limbo Air** (Broward and Palm Beach). Owner: Renata.
- Time passes on the visitor's command: "Skip ahead a day". Follow-ups fire on their day, scripted customers answer and pay, the board moves.
- The visitor can also play the customer: open the text the customer got, accept the quote, pay the invoice (fake, nothing real).
- Automated invoicing: when a booked job is done, the invoice goes out with no typing.

## Non-goals

- No real product, no sign-in, no backend (ADR 0001). No email, SMS or payment is ever sent.
- No editing of the follow-up rules in the demo ("Not available in the demo").

## Anti-goals

- Nagging. The rules must read as polite and capped.
- Any TEKGUYZ price, any statistic, any phone number, a real business name.

## The rules (my call, shown on the Rules screen)

- **Quotes:** follow-ups 2, 5 and 9 days after the quote went out. Three at most.
- **Invoices:** go out the moment the job is marked done, due in 7 days. Reminders 3 days after sending, on the due day, and 3 days past due. Three at most.
- **Stop rule:** follow-ups stop the moment the customer answers (yes, no or a question) or pays. They never pass three.
- **Quiet on Sundays:** a follow-up due on a Sunday goes out Monday.
- **After the last one:** 3 days later with no answer, the item moves to "Needs you: give them a call". No fourth message.

## Screens

- `/` landing page.
- `/demo` the board: Today bar with "Skip ahead a day", "Needs you" strip, columns Quotes out, Booked, Invoiced, Paid, and three totals.
- `/demo/jobs/[id]` one job: timeline of everything that happened, the next follow-up, owner actions, and "See what the customer sees".
- `/demo/jobs/[id]/customer` the customer's phone: the texts, and Accept quote / Pay invoice.
- `/demo/activity` every message that would have gone out.
- `/demo/rules` the follow-up rules.
- `/demo/new` a new quote (stays in the browser).

## Left to the builder

Look (DESIGN.md), copy, sample jobs and amounts, logo options (`docs/design/logos.html`; the founder picks one).
