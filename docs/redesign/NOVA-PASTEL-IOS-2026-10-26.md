# Nova pastel iOS redesign (2026-10-26)

Request (Ten): redesign the whole Nova UI in a pastel, rounded iOS style using
`Ngh1aa/uiux-ai-workspace`, and preview before merging. Level: **Redesign** (brownfield-redesign skill).

## Product DNA

| Trait | Before | DNA or execution fault | Now |
|---|---|---|---|
| Palette | mint, sky, lavender from the logo | DNA | Kept; each pastel has one role: mint = safe now, sky = committed, lavender = protected buffer. Peach = spending/review, butter = warning |
| Use of colour | pastel on every row and tile | Execution fault | Pastel only where it carries meaning; rows are neutral |
| Material | iOS grouped background, glass navigation | DNA | Kept: `#f2f2f7` background, white cards, glass tab bar and nav bar |
| Font | Apple system font | DNA | Kept, Inter as bundled fallback |
| Radius | 8+ different radii | Execution fault | One scale: card 22, inner 14, icon 12, capsule controls |
| Navigation | 96px icon rail, v6 overlay | Execution fault | iPadOS-style sidebar with labels, floating capsule tab bar on phones, iOS back button |

Signature: the "Nova aurora" (mint → sky → lavender) is used only on the safe-to-spend hero, the card face and onboarding.

## Ownership after the change

| Old owner | Replaced by | Removed |
|---|---|---|
| 21-file CSS cascade bundled into `nova-current.css` (5,388 lines, 4,332 `!important`) | `assets/nova-ui/{tokens,shell,components,screens}.css`, bundled by `scripts/p2-1b-consolidate-runtime.mjs` (1,046 lines, 4 `!important`) | 27 unused legacy CSS files, the P2.1A CSS archive |
| `nova-v6.css` / `nova-v6.js` (post-render DOM patch) | Home markup in `assets/nova-dashboard-v2.js`; simulated-data pill in the P2.1A renderer source | both files |
| `nova-phase3-clarity.css`, `nova-d02-truth-boundary.css` | `components.css`, `screens.css` | both files |
| Styles injected at runtime by `nova-current-state.js` | `components.css`, `screens.css` | `injectStyles()` |
| Card hover lift, fade-in shell motion | `nova-motion.css` edited in place: press-to-scale only, no opacity fade | lift rules |

Kept on purpose: `nova.css`, `accessibility.css`, `ledger.css`, `nova-redesign.css`, `prototype.css`, `nova-evidence-ios.css`,
`decision-tradeoffs.css` still style the evidence pages (design-system, sitemap, prototype, user flows), which were out of scope.
`nova-phase3-clarity.js` and `nova-d02-truth-boundary.js` still adjust copy after render; folding them into the renderer is follow-up work.

## Copy and behaviour

No flow, data, URL or event changed. Copy verified with users is unchanged. Home copy changes: "·" separators replaced, the
non-functional "i" button removed (the split bar now shows the formula), insight banner and duplicate mini-stats dropped.

## Verification

- Playwright suites from `.github/workflows/nova-cloud-qa.yml`: 71/71 pass (main: 70/71, the axe contrast failure on Security was caused by the fade-in motion and is fixed).
- axe-core wcag2a/aa on 24 routes at 1440 and 390: no violations.
- `overlay-check.py --base main`: 0 errors; warnings are the four new source files (they replace the cascade above) and generated files rebuilt by their generators.
- Not verified: real iPhone, screen readers, dark mode (not built).

## Home dashboard pass (2026-11-02)

Request (Ten): use the latest `uiux-ai-workspace` dashboard skill to fix Nova Home. Source owners edited in place:
`assets/nova-dashboard-v2.js` (markup) and `assets/nova-ui/screens.css` (layout), bundle regenerated.

| Before | After |
|---|---|
| Unusual card activity sat in the third row | "Needs your attention" panel next to the safe-to-spend hero (below it on phones); the same link and `aria-label` |
| 6-slice donut and a 64% ring | Sorted category bars with amount and share; two savings goals as number + bar |
| Money in and out: "This month" chip over Jan–Jun, legend, expenses pink = review colour | "Apr–Sep" chip, "In/Out, September" tiles with a named comparison, current month emphasised, no legend, neutral expense bars |
| Caption under "Balance forecast" | Removed; "€500 buffer" labelled on the dashed line, low point marked |
| Only whole-page states | `?panel=forecast-error` fails one panel with Try again; the rest of Home keeps its numbers |
| Stretched empty panels at 1440, lone panel at 1024, ten panels on phones | Area grid (1 column < 768, 2 columns to 1399, 3 from 1400); phones show four full panels and six summary rows |

Copy verified with users is unchanged (including the buffer note). Tab bar labels and the greeting moved from 10.5/11 px to 12 px.

Verification: `qa/home-dashboard.spec.mjs` (new), all existing Playwright suites, axe/browser evidence on Home routes,
`taste-check --layout strict` dashboard rules at 390/1024/1280/1440 (CI step), `overlay-check`: 0 errors.
Not verified: real devices, screen readers, users.

## Black sidebar and pastel colour blocks (2026-11-02)

Request (Ten): redesign the whole Nova UI with `uiux-ai-workspace`: pastel tone, a fixed black sidebar on the left,
content arranged inside one rectangle, modern minimal cards. Flow: size L, track "Redesign sản phẩm có code"
(`brownfield-redesign`) with the direction gate. Three directions were built on Home
(`docs/redesign/directions-2026-11-02/`); the product owner chose **B, colour blocks**
([approval](directions-2026-11-02/direction-approval.md)).

### DNA decisions

| Trait | Decision |
|---|---|
| Pastel roles (mint safe, sky committed, lavender protected, peach review, butter warning) | Kept, now used as card fills on Home panels |
| Light iPadOS sidebar | Changed by the owner to a black fixed sidebar (from 1024px) and a black floating phone tab bar |
| Aurora on the safe-to-spend hero | Moved off the hero (now black, the one bold block); aurora stays on the card face and onboarding |
| System font, tabular money, rounded shapes | Kept; card radius 20, frame radius 28 |

### Owners changed (all at source, bundle regenerated)

| Owner | Change |
|---|---|
| `assets/nova-ui/tokens.css` | `--page`, `--bg` (frame), `--card`, `--side*`, `--primary*`, `--r-frame` |
| `assets/nova-ui/shell.css` | Black sidebar from 1024px; content frame (`.app-stage`) as one white rectangle; top tabs only 768–1023; black phone tab bar with the active tab as a white pill (icon + label), others icon only; compact top bar 1024–1359 |
| `assets/nova-ui/components.css` | Cards are flat grey fills with white pills and icon tiles inside; primary buttons black |
| `assets/nova-ui/screens.css` | Home hero black and panels tinted by role; multi-column screen layouts start at 1200/1360 so nothing cramps beside the sidebar; security score is a tile, not a gauge ring; cash-flow tiles stack on phones; pay actions become rows in a narrow card |
| `assets/nova-system-v4.js`, `assets/legacy/p2-1a-canonical/nova-current-renderer.p2-1a.js` | Rail markup built from 1024px instead of 1200px |
| `assets/nova-ios26.js` | Page captions under large titles removed |
| `assets/nova-phase3-clarity.js`, `assets/nova.js` | "Safe to spend · next 14 days" → "Safe to spend, next 14 days" (test regex unchanged) |

### Tests changed

`qa/nova-flow.spec.mjs` locked the old look (white sidebar from 1200px, `#f2f2f7` body, top tabs to 1199px, 900px
main at 1024). It now checks the new contract: black sidebar and no top tabs from 1024px, white content frame on a
grey page, main wider than 640px at 1024 and 900px at 1440. Behaviour assertions are unchanged.

### Verification

All 18 Playwright suites (62 tests), axe and browser evidence on the 31 CI routes: pass. `taste-check --layout strict`
on 26 routes at 390/768/1024/1280/1440: 3 remaining errors, all the D-02 "DEMO ONLY" banner, which stays dark as the
user-tested truth boundary. `overlay-check`: 0 errors, `!important` net +0. Not verified: real devices, screen
readers, users.
