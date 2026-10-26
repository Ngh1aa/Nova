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
