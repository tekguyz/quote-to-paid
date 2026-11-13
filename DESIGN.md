# Quote to Paid: design rules

The rulebook for how the app looks. Tokens live in `app/globals.css`; this file says why.

## Feel

A tidy office board for a trade business: calm paper, dark ink, one strong teal, and a warm "sun" for things that are waiting. It should look like a tool an AC owner trusts on a phone in a truck, not a startup ad.

## Logo

**Option A, "Text with a check"** (`docs/design/logos.html`): a message bubble with a check, teal square, sun-colored check. Picked by Claude as the default on 2026-11-10; the founder can switch to B or C on that page. Sources: `components/marks.tsx`, `app/icon.svg`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`. Change all four together.

The sample company, Gumbo Limbo Air, has its own mark: a sun disc with a teal leaf (`BusinessMark`). It is made up.

## Color

| Token | Use |
| --- | --- |
| `paper` `#f5f3ee` | page background |
| `surface` `#ffffff` | cards |
| `ink` `#15201e` / `muted` `#59635f` | text |
| `brand` `#0e5c57` | primary buttons, links, the product |
| `sun` / `sun-soft` | waiting: a follow-up is planned |
| `clay-soft` / `clay-ink` | needs the owner: replied, give them a call, past due |
| `sky-soft` / `sky-ink` | job booked |
| `leaf-soft` / `leaf-ink` | paid |

Status colors only ever appear as chips and dots, never as large fills.

## Type

Bricolage Grotesque (600) for headings and money. Public Sans for everything else. Money uses tabular numbers.

## Shape

A ledger (decided 2026-11-13, tekguyz/quote-to-paid#9). Square 2px corners (`rounded-xs`) on buttons, chips, fields and cards. Lists of jobs sit on one white sheet split by 1px hairline rules (`sheet` in `components/demo/board.tsx`), not as separate boxes. The board totals are one strip with hairline dividers. "Needs you" is marked by a 2px clay rule under its heading, not a box. No shadows anywhere. No pill buttons, no `rounded-xl` or `rounded-2xl` cards. Only small dots and the drawn phone's own parts (device corners, island, home bar, message bubbles) are round.

Form controls never show the browser's look: `.field` for text, number and select (own chevron, no number spinners), `.check` for checkboxes, both in `app/globals.css`. Text selection, caret, scrollbars and focus rings use the palette.

## Phone frame

The customer's phone (`components/phone.tsx`, used by the customer screen and the landing hero) follows `claude-config/LOOKS.md`, "Phone and browser frames". Ink body at 9:19.5 with device corners and side buttons, an island, a status bar with 9:41 and signal, wifi and battery, a Messages header with the company mark, the thread, and a home bar. The thread scrolls inside the phone and opens at the newest text. On the customer screen the quote or invoice sits in a fixed white sheet under the thread. Sizing is `.phone` in `app/globals.css`: up to 360px wide on phones; from 768px its height follows the window (560 to 760px) so it never runs off the bottom at 1440 x 900.

## Layout

Phone first. Every target is at least 44 px. On phones the "Skip ahead a day" button sits in a bar at the bottom, in thumb reach; from 768 px it moves to the header.

## Motion

One gesture: when the visitor skips a day, a hairline draws from the left over the day summary and its lines rise in, 60 ms apart. It shows a change of state, which is the point of the demo. `prefers-reduced-motion: reduce` removes it. Nothing else moves.

## Demo banner

Dark ink strip on top of every demo screen: "Demo: a made-up company. Nothing is really sent or charged.", Reset demo, Leave the demo, Built by TEKGUYZ. It carries `data-demo-banner` so `tools/capture` can hide it.
