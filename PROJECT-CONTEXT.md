# Nova — Project Context

## Project identity

- **Project name:** Nova — Personal Banking & Money Planning
- **Project type:** Responsive interactive UI/UX prototype / portfolio case
- **Repository:** `https://github.com/Ngh1aa/Nova`
- **Source methodology:** `Ngh1aa/uiux-ai-workspace`
- **Current stage:** evidence-informed iteration complete → maintainability / portfolio-truth cleanup
- **Project mode:** `interactive_prototype`
- **Responsive scope:** `1440 / 1024 / 768 / 390`
- **Release authority:** `merge_and_deploy` per the user's standing instruction after successful implementation and reasonable QA
- **Canonical status:** `docs/uiux/Phase-State.md`

## Product goal

Nova demonstrates portfolio-level consumer-finance product thinking through a believable personal banking experience centered on safe-to-spend planning, transaction trust, cards, transfers, savings, recurring payments, KYC and recovery.

Success means a recruiter or Product Design Lead can understand the product thesis quickly, follow realistic journeys, inspect responsive behavior and see a polished interface that feels current rather than themed or template-driven.

## Primary users

18–30, digital-first account owners with recurring payments who want spending control without maintaining spreadsheets.

## Main user problems

1. Balance does not equal money safely available to spend.
2. Upcoming bills and subscriptions are easy to forget.
3. Savings progress is fragmented from day-to-day spending.
4. Suspicious transactions require fast, trustworthy protective actions.
5. Sending money should expose its impact before commitment.

## Product thesis

**Nova helps people decide what money is truly safe to spend by combining current balance, known commitments, planned savings and a protected buffer into one forward-looking Money Horizon.**

Critical journey:
`Home -> unusual transaction -> transaction detail -> freeze/report decision -> truthful simulated result`

Secondary journey:
`Home/Pay -> recipient -> amount -> impact review -> simulated authentication/recovery -> success`

Recovery paths include freeze/unfreeze, biometric fallback, insufficient-funds correction, offline review/revalidation and KYC capture retry/manual review.

## Current evidence state

Nova has direct-user research evidence, but no moderated usability-session evidence and no production/business-impact evidence.

- **Round 01:** 5 eligible real users completed an unmoderated task-based prototype evaluation with consented self-report; 5 verified records; 0 moderated sessions.
- **Round 02:** 5 NEW eligible participants completed a verified asynchronous structured self-report retest on the frozen post-iteration build; 5 verified records; 0 moderated sessions.
- Round 01 → Round 02 differences are cross-sectional self-report signals because the participant sets differ.
- D-01 through D-04 received another evidence-informed implementation pass after Round 02 and are `ITERATED / NOT HUMAN-RETESTED`.
- The planned moderated Round 03 was explicitly skipped and contributes no evidence.

Do not claim observed task-success/time improvement, causality, overall validated usability, conversion, retention, fraud reduction or production impact.

## Active visual direction

### Working direction

**iOS 26 Financial Workspace — native / calm / precise / fluid / premium.**

The previous warm-ledger / editorial direction is historical and no longer controls the implementation.

### Visual signature

1. **Safe-to-spend hero** — dark premium content card with the primary amount and immediate actions.
2. **Money Horizon forecast** — blue 14-day balance forecast with upcoming events and protected-buffer reference.
3. **Floating iOS 26 tab bar** — Home / Activity / Pay / Cards / Save in a restrained Liquid Glass navigation layer.

### Must

- Cool neutral `#F5F5F7` canvas with white content surfaces.
- System typography throughout primary product UI.
- Tabular numerals for money.
- Large-title navigation that collapses on scroll.
- Liquid Glass only for functional chrome such as navigation / bottom tab bar, not as the content layer.
- Generous responsive desktop layouts; no narrow phone-width column on a 1440px viewport.
- Grouped iOS-style lists and controls.
- 51×31 switch proportions.
- ≥44px interaction targets, visible focus, reduced-motion support and non-color state indicators.
- Explicit prototype/simulation disclosure.

### Must not

- Beige / cream / paper-first UI.
- Red ledger margin rules or accounting-book decoration.
- Serif typography in the primary product UI.
- Full-width desktop bottom navigation.
- Generic SaaS sidebars.
- Nested glass surfaces everywhere.
- Huge empty desktop margins caused by a 760px content cap.
- Fake testimonials, business metrics or production claims.
- “Fraud detected” language without evidence.

## Responsive composition

### 1440 / 1024
- Main content max width about 1180px.
- Home uses a two-column financial overview: primary planning content + compact upcoming-impact context.
- Cards uses card object + quick controls side by side.
- Transaction detail uses primary evidence + explanatory context.
- Bottom tab bar stays compact and centered.

### 768
- Major layouts collapse to one column.
- Navigation remains floating and width-constrained.

### 390
- Single-column layout with approximately 12px side inset.
- No document-level horizontal overflow.
- Bottom tab bar fits within the viewport and respects safe-area inset.

## Technology / runtime ownership

- **Frontend:** static HTML/CSS/JavaScript, GitHub Pages-compatible.
- **Entry points:** `index.html`, `app.html`, `prototype.html`.
- **Canonical renderer:** `assets/nova-current-renderer.js`, generated by `scripts/p2-1b-consolidate-runtime.mjs`.
- **Canonical state/interaction owner:** `assets/nova-current-state.js`.
- **Canonical stylesheet:** `assets/nova-current.css`.
- **Separate motion concern:** `assets/nova-motion.js` + `assets/nova-motion.css`.
- **Reviewer tooling:** `assets/state-lab-launcher.js` remains separate from product-state ownership.
- **Backend/database:** N/A; banking operations are simulated.

Historical renderer/style modules remain provenance or generator inputs where documented; they must not be treated as independent live owners. P2.2 also makes canonical generated identity Nova-native rather than relying on post-render Ledger → Nova repair.

## System reality

| Capability | Reality | Rule |
|---|---|---|
| Account balances | STATIC/SIMULATED | Prototype data only |
| Money Horizon | SIMULATED computation | Formula remains transparent |
| Transaction risk flag | SIMULATED | “Needs review”; no confirmed-fraud claim |
| Freeze/unfreeze | SIMULATED | Explain consequences accurately |
| Report preview | SIMULATED | No real bank contact or report submission |
| Transfers | SIMULATED | Never claim real money moved |
| KYC | SIMULATED | No real identity verification |
| Biometrics | SIMULATED | Interaction/state demo only |
| Notifications | SIMULATED | Prototype events |

## Source of truth

1. User's latest request and standing merge instruction.
2. `docs/uiux/Phase-State.md` for current status/evidence state.
3. `.uiux-profile.json`.
4. `docs/uiux/Nova-iOS26-Design-Contract-2026.md` for active visual direction.
5. Current implementation, generated-runtime manifest and QA tests.
6. `docs/uiux/IA-and-Flows.md` and `docs/uiux/Component-State-Contract.md` for product behavior.
7. `research/validation/nova-round-01/status.json` and `research/validation/nova-round-02/status.json` for current research rollups; atomic/raw records remain immutable evidence.
8. `Ngh1aa/uiux-ai-workspace` operating contract / UIUX Factory / `skills_UIUX`.

Older Ledger / Financial Field Guide design documents and dated audit/evidence records remain historical evidence only and must not override current status.

## Definition of Done

1. The product UI visibly reflects the active iOS 26 contract.
2. Existing hero/secondary/exception/recovery/security flows remain interactive.
3. Home, Activity, Transaction Detail, Cards, Transfer Review, Savings and KYC render at 1440 / 1024 / 768 / 390 without document overflow.
4. Core protection and transfer flows pass.
5. Automated accessibility/browser checks pass at the configured baseline.
6. Rendered screenshots are inspected after material visual changes; documentation-only changes do not invent new visual claims.
7. Current-status documents agree on delivery/research state and dated historical evidence is clearly scoped as historical.
8. When gates are acceptable, merge to `main` and verify the main-branch QA/deployment result.
