# Quote to Paid: design rules

The rulebook for how the app looks. Tokens live in `app/globals.css`; this file says why.

## The look (decided 2026-11-13, tekguyz/quote-to-paid#5)

| Column | Pick |
| --- | --- |
| Ground | Pure white `#ffffff`; text `#111111`; hairline rules `#d9d9d9` |
| Accent | Black for buttons and links. Mustard `#e8b923` only as a highlighter behind key figures (amounts, due dates) and the active state |
| Display font | Space Mono, for headings, amounts and dates |
| Body font | Instrument Sans |
| Shape | Sharp corners (0px). 1px hairline rules like a ledger. No pill buttons, no card shadows |

Closest shipped row in `claude-config/LOOKS.md`: missed-call-follow-up (also tile-red and cream, so it differs in all five). It differs from every demo in all five columns.

## Feel

A clean ledger for a trade business: white page, black ink, thin rules, and a mustard highlighter pen on the figures that matter. It should read like a tool an AC owner trusts on a phone in a truck, not a startup ad.

## Logo

**Option A, "Text with a check"** (`docs/design/logos.html`): a message bubble with a check, black square, mustard check. Picked by Claude as the default on 2026-11-10; the founder can switch to B or C on that page. Sources: `components/marks.tsx`, `app/icon.svg`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`. Change all four together.

The sample company, Gumbo Limbo Air, has its own mark: a mustard disc with a black leaf (`BusinessMark`). It is made up.

## Color

| Token | Use |
| --- | --- |
| `paper` / `surface` `#ffffff` | page and panels |
| `sunk` `#f2f2f2` / `bubble` `#f0f0f0` | quiet fills, incoming message bubbles |
| `line` `#d9d9d9` | 1px hairline rules |
| `ink` `#111111` / `muted` `#595959` | text (muted is 7:1 on white) |
| `brand` `#111111` | primary buttons, links, outgoing bubbles |
| `sun` `#e8b923` | highlighter behind amounts (`.hl`) and the active tab |
| `sun-soft` `#f9e9a6` | waiting chips |
| `clay-soft` / `clay-ink` | needs the owner: replied, give them a call, past due |
| `sky-soft` / `sky-ink` | job booked (grey) |
| `leaf-soft` / `leaf-ink` | paid |

Status colors only ever appear as chips and dots, never as large fills. Contrast: ink on white 18:1, ink on mustard 10:1, white on black 18:1, `clay-ink` on `clay-soft` 6:1, `leaf-ink` on `leaf-soft` 6:1.

## Type

Space Mono (700) for headings, amounts and dates. Instrument Sans for everything else. Money uses tabular numbers and the `.hl` highlighter.

## Shape

Every radius is 0 (`--radius-*` in `app/globals.css`). Panels are 1px `line` rules, no shadows. Buttons are black rectangles; the secondary button is outlined.

## Layout

Phone first. Every target is at least 44 px. On phones the "Skip ahead a day" button sits in a bar at the bottom, in thumb reach; from 768 px it moves to the header.

## Motion

One gesture: when the visitor skips a day, a hairline draws from the left over the day summary and its lines rise in, 60 ms apart. It shows a change of state, which is the point of the demo. `prefers-reduced-motion: reduce` removes it. Nothing else moves.

## Demo banner

Dark ink strip on top of every demo screen: "Demo: a made-up company. Nothing is really sent or charged.", Reset demo, Leave the demo, Built by TEKGUYZ. It carries `data-demo-banner` so `tools/capture` can hide it.
