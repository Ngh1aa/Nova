# NOVA — Research-led Redesign Benchmark

Research date: 2026-09-15  
Skill lock: `Ngh1aa/uiux-ai-workspace@221370ef294408f3f5a0c6a7fb0567c3db840c3e`  
Project mode: `interactive_prototype`  
Evidence policy: `VERIFIED | INFERRED | ASSUMED | UNKNOWN`

## Decision problem

The current NOVA product model and flows are worth preserving, but the rendered product is visually too close to a generic clean-fintech dashboard. The redesign must make the product recognisable without its logo while preserving financial trust, task clarity and the existing hero/recovery flows.

### Preserve

- Product thesis: **safe-to-spend before raw balance**.
- Money Horizon as the primary decision object.
- Home → suspicious transaction → detail → freeze → recovery.
- Transfer review with recipient / amount / fee / ETA / resulting safe-to-spend.
- KYC failure + manual-review recovery.
- Card controls, subscriptions, savings and security states.
- Responsive 390 / 768 / 1024 / 1440 support.
- Simulated-system disclosure and calm risk language.

### Change

- Replace rounded-card/shadow-heavy visual grammar with a more distinctive information system.
- Give materially different screen roles materially different compositions.
- Move from generic glyphs to a coherent line-icon language.
- Make Money Horizon feel like a living planning instrument rather than a segmented progress bar inside a card.
- Make transaction, card, transfer and KYC states feel product-specific instead of sharing the same page-heading + section stack.
- Improve desktop composition so it feels like a consumer money workspace, not an admin dashboard.

## Current visible redesign delta

| Current visible problem | Why it matters | New behavior | Expected visible delta | Verification |
|---|---|---|---|---|
| Large rounded cards + neutral green are the main visual language | Interchangeable with many fintech templates | Ledger/grid surfaces, crisp rules, low-radius grouping, editorial display type | Before/after remains recognisably different in grayscale | Cross-page montage |
| Money Horizon reads as a segmented bar inside a card | Signature is present but not memorable | Horizon becomes a timeline/field with date ticks, next-event marker and explanatory math | Home is recognisable by the financial field alone | 390/1440 screenshots |
| Same shell rhythm repeats across screen roles | Weak role-specific hierarchy | Home, Activity, Detail, Card, Transfer and KYC each get distinct top compositions | Page tops cannot be swapped by changing copy only | Cross-page top montage |
| ASCII-like icon glyphs | Prototype feel | Inline SVG icon system with consistent stroke/weight | Navigation and status feel production-intentional | Visual review |
| Desktop right rail is generic insights | Dashboard feel | Event rail / upcoming timeline / context ledger | Desktop reads as consumer planning workspace | 1024/1440 screenshots |

## Reference pool

Scoring is a design-fit aid, not a claim of objective product quality.

| Reference | Source type | Page/state inspected | Primary job | Fit /100 | Decision |
|---|---|---|---|---:|---|
| Monzo | Production / official help | Trends Balance / Spending / Target, left-to-spend | Safe-to-spend mental model, upcoming payments | 92 | ADOPT mental model; ADAPT composition |
| Wise | Production / official product/help | Account home, Send flow, Card controls | Transfer review clarity, account/transaction hierarchy | 90 | ADOPT progressive review + disclosure |
| bunq V5 | Production / official help/product | Home, Cards, Savings | Job-based top-level separation | 87 | ADOPT role separation; REJECT density |
| Apple Wallet / Apple Card | Production / official | Card overview, spending activity | Transaction/card hierarchy and glanceability | 86 | ADAPT hierarchy; REJECT iOS cloning |
| N26 | Production / official support | Spaces, card-link/settings, Insights | Goals/subaccounts + card linkage | 82 | ADAPT goal/account relationships |
| Revolut | Production / official | Home / analytics / card security | Self-service breadth, fast security actions | 80 | ADOPT directness; REJECT visual/feature density |
| Bank statement / passbook | Real-world banking artifact | Running entries, dates, debit/credit, balance | Structural metaphor for activity/history | 89 | ADAPT at L2 structural fidelity |
| Monthly planner / calendar strip | Real-world planning artifact | Due-date sequence | Upcoming obligations / Money Horizon | 91 | ADAPT at L1–L2 fidelity |
| Receipt / payment slip | Real-world transaction artifact | Merchant, amount, reference, status | Transaction detail hierarchy | 88 | ADAPT at L2; no fake official marks |
| Physical debit card | Real banking artifact | Card anatomy / proportions | Card recognition and controls | 84 | L3 only on Cards; avoid decorative 3D |

## Verified benchmark findings

### Monzo

`VERIFIED` — Trends Balance surfaces a running balance and an estimate of money left to spend based on upcoming payments. Trends Target calculates left to spend from balance minus scheduled payments and included spending categories. This supports NOVA’s decision-first Home and validates keeping upcoming obligations close to safe-to-spend.

Sources:
- https://monzo.com/help/budgeting-overdrafts-savings/web-the-differences-between-Summary-and-Trends
- https://monzo.com/help/budgeting-overdrafts-savings/trends-left-to-spend-web
- https://monzo.com/help/monzo-perks/trends-spending-and-balance-web

### Wise

`VERIFIED` — Send flow is Home → recipient → amount/currency → payment method/fees/ETA → review → send. Card controls are explicit by transaction type. Freeze is temporary; pending/offline transactions may still process.

Sources:
- https://wise.com/help/articles/2977959/how-do-i-send-money-with-wise
- https://wise.com/help/articles/2x0JI2KSRqwLHeftJfVjhD/setting-transaction-controls-for-your-wise-card
- https://wise.com/help/articles/2977977/how-do-i-freeze-or-unfreeze-my-wise-card

### bunq V5

`VERIFIED` — V5 separates Home, Cards and Savings around distinct user jobs. Home contains accounts, recent transactions and pay/request actions; Cards owns card management and recent card transactions; Savings owns savings accounts/goals.

Sources:
- https://help.bunq.com/articles/introducing-v5-your-new-bunq-app-experience
- https://help.bunq.com/articles/cards-tab
- https://help.bunq.com/articles/savings-tab

### Apple Wallet / Apple Card

`VERIFIED` — Spending Activity uses explicit time periods and highlights, while Apple Card overview keeps card balance, payment due, activity and latest transactions in a strong scan hierarchy.

Sources:
- https://support.apple.com/en-gb/123096
- https://www.apple.com/newsroom/2024/01/apple-card-is-helping-cardholders-live-healthier-financial-lives/

### N26

`VERIFIED` — Spaces can carry savings goals and account relationships; cards can be linked to Spaces. N26 also exposes card restrictions/controls and informational insights modules.

Sources:
- https://support.n26.com/en-eu/app-and-features/spaces/how-does-spaces-work
- https://support.n26.com/en-eu/app-and-features/spaces/what-are-cards-for-spaces
- https://support.n26.com/en-eu/app-and-features/app/ai-powered-insights-module

### Revolut

`VERIFIED` — Current product/help material continues to emphasize Home-centric analytics, spending/income comparisons and fast card/security actions.

Sources:
- https://help.revolut.com/help/accounts/budget-and-analytics/how-can-i-see-my-spending-and-income-analytics/
- https://www.revolut.com/en-NL/bank-account/

## Layout pattern synthesis

### Home

**Adopt:** one dominant money decision, then actions/exceptions, then upcoming obligations and activity.  
**Reject:** grid of equal KPI cards.  
**NOVA adaptation:** safe-to-spend is the display anchor; Money Horizon immediately answers *why*; suspicious activity appears as a high-salience horizontal ledger entry.

### Activity

**Adopt:** search/filter at top, time grouping, clear amount/status, optional running context.  
**NOVA adaptation:** use a statement-like ledger with date gutters and a monthly cashflow header; detail remains one click away.

### Transaction detail

**Adopt:** merchant + amount + status first; then time/card/location/reference; contextual actions.  
**NOVA adaptation:** “payment dossier” composition inspired by a receipt/payment slip, but semantic HTML remains a normal detail page.

### Cards

**Adopt:** card itself can be a strong object because recognition is useful.  
**NOVA adaptation:** one card object with immediate state/actions; controls live in a structured security ledger rather than many cards.

### Transfer

**Adopt:** progressive recipient → amount → review → auth → receipt.  
**NOVA adaptation:** each step gets a focused working area; review includes a mini Money Horizon impact strip.

### Savings

**Adopt:** clear goal progress and automation context.  
**NOVA adaptation:** savings is a goal ledger with planned contributions and protected-money logic, not a gallery of generic pots/cards.

### KYC / Security

**Adopt:** explicit why/what-next, clear capture quality and recovery.  
**NOVA adaptation:** checklist/document-sheet composition with a visible progress spine and recovery rail.

## Design DNA synthesis

### 1. Dominant grammar — Financial Field Guide

A modern money journal combining three familiar structures at low fidelity:

- **statement / ledger** → rows, date gutters, debit/credit alignment, running context;
- **planner / calendar** → upcoming due dates and horizon markers;
- **receipt / payment slip** → transaction-detail anatomy and reference hierarchy.

No fake paper texture, stamped seals, perforation, faux handwriting or legal-document mimicry.

### 2. Typography

- UI/body: Inter or system sans for speed, labels and form legibility.
- Display/decision amounts: Source Serif 4 for an ownable editorial finance voice.
- Tabular numerals preserved for monetary values.
- Serif is a hierarchy tool, not a luxury-brand costume.

### 3. Surface language

- Warm mineral/off-white canvas, white/ivory task surfaces.
- Deep pine/ink for primary text and high-trust actions.
- Safe = pine/mint; committed = ochre; buffer = cool slate; risk = brick/coral.
- Mostly hairline rules and section bands; shadows are exceptional.
- Radius is low/medium; pills reserved for filters/statuses.

### 4. Motion

- Horizon zones and event marker move when financial inputs change.
- Context panels slide only when they preserve orientation.
- State changes use 160–240ms feedback; horizon recomposition 600–800ms.
- No scroll theatre, parallax, number rolling or confetti.

### 5. Information density

- Mobile: one decision per viewport; show risk before decorative insight.
- Desktop: information-rich but columnar; no 12-card dashboard.
- Secondary explanations collapse/expand rather than always consuming vertical space.

## Reference-role matrix

| Screen role | User question | Reference role | Extracted principle | Do not copy | NOVA adaptation |
|---|---|---|---|---|---|
| Home | What can I safely do with my money now? | Monzo + bunq | decision-first + job-based access | exact cards/tabs | Decision header + living Horizon + upcoming rail |
| Activity | What changed, and where did money go? | Apple Wallet + statement | scan hierarchy + period comparison | iOS chrome | Ledger rows + month summary + search/filter |
| Detail | Is this transaction mine / what happened? | Wise + receipt | explicit status/context | receipt skeuomorphism | Payment dossier with risk evidence/action |
| Cards | Is my card safe and what can it do? | Wise + bunq + physical card | immediate state + granular controls | glossy 3D cards | One direct-form card + security ledger |
| Transfer | Am I sending the right amount to the right person? | Wise | progressive disclosure + final review | brand-specific send UI | Step canvas + impact preview |
| Savings | Am I on track without hurting cashflow? | N26 + bunq | goal/account relationship | pot-card grid | Goal ledger tied to Horizon |
| KYC | What do you need and how do I recover? | Wise/N26 documented verification | explain requirement + recovery | identity vendor visuals | Checklist + capture stage + manual-review fallback |

## Rejected patterns

- Purple/blue fintech gradients.
- Floating debit card hero.
- Rounded card matrix as default composition.
- “AI financial coach” chat bubble.
- Donut-first analytics.
- Glassmorphism / glow.
- Decorative serif everywhere.
- Beige luxury-bank styling with low-contrast copy.
- Copying Monzo/Revolut/Wise brand colors or iOS component chrome.

## Research limits

- No production analytics or user interviews exist for NOVA.
- Public help/product pages document capability but do not prove usability quality.
- Country/tier differences exist across benchmark products.
- All NOVA banking/KYC/biometric behavior remains simulated.

## Research gate

`PASSED_FOR_DESIGN_CONTRACT`

- Production/category references: covered.
- Page/state roles: covered.
- Reference jobs + do-not-copy boundaries: covered.
- Real-world domain artifacts: covered.
- Mobile / accessibility / implementation constraints: covered.
- No superiority or conversion claims are made.
