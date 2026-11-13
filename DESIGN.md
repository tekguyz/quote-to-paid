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

## Layout

Phone first. Every target is at least 44 px. On phones the "Skip ahead a day" button sits in a bar at the bottom, in thumb reach; from 768 px it moves to the header.

## Motion

One gesture: when the visitor skips a day, a hairline draws from the left over the day summary and its lines rise in, 60 ms apart. It shows a change of state, which is the point of the demo. `prefers-reduced-motion: reduce` removes it. Nothing else moves.

## Demo banner

Dark ink strip on top of every demo screen: "Demo: a made-up company. Nothing is really sent or charged.", Reset demo, Leave the demo, Built by TEKGUYZ. It carries `data-demo-banner` so `tools/capture` can hide it.
