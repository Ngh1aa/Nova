# Nova — Project Context

## Project identity

- **Project name:** Nova — Personal Banking & Money Planning
- **Project type:** Responsive interactive UI/UX prototype / portfolio case
- **Repository:** `https://github.com/Ngh1aa/Nova`
- **Source methodology:** `Ngh1aa/uiux-ai-workspace`
- **Current stage:** Whole-product visual reset -> rendered QA -> release
- **Project mode:** `interactive_prototype`
- **Responsive scope:** `1440 / 1024 / 768 / 390`
- **Release authority:** `merge_and_deploy` per the user's standing instruction after successful implementation and reasonable QA

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
`Home -> unusual transaction -> transaction detail -> freeze card -> confirmation`

Secondary journey:
`Home/Pay -> recipient -> amount -> review -> simulated authentication -> success`

Recovery paths include freeze/unfreeze, biometric fallback, insufficient-funds correction, offline review and KYC capture retry/manual review.

## Active visual direction

### Working direction

**iOS 26 Financial Workspace — native / calm / precise / fluid / premium.**

The previous warm-ledger / editorial direction is historical and no longer controls the implementation. The user explicitly rejected the beige, narrow, old-looking result and requested a full iOS-style redesign.

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

## Technology

- **Frontend:** static HTML/CSS/JavaScript, GitHub Pages-compatible.
- **Entry points:** `index.html`, `app.html`, `prototype.html`.
- **Base behavior:** `assets/nova.js`.
- **Financial forecast enhancement:** `assets/nova-financial-intelligence.js`.
- **Active 2026 iOS visual layer:** `assets/nova-ios26.css` + `assets/nova-ios26.js`.
- **Backend/database:** N/A; banking operations are simulated.

## System reality

| Capability | Reality | Rule |
|---|---|---|
| Account balances | STATIC/SIMULATED | Prototype data only |
| Money Horizon | SIMULATED computation | Formula remains transparent |
| Transaction risk flag | SIMULATED | “Needs review”; no confirmed-fraud claim |
| Freeze/unfreeze | SIMULATED | Explain consequences accurately |
| Transfers | SIMULATED | Never claim real money moved |
| KYC | SIMULATED | No real identity verification |
| Biometrics | SIMULATED | Interaction/state demo only |
| Notifications | SIMULATED | Prototype events |

## Source of truth

1. User's latest request and standing merge instruction.
2. `.uiux-profile.json`.
3. `docs/uiux/Nova-iOS26-Design-Contract-2026.md`.
4. Current implementation and QA tests.
5. `docs/uiux/IA-and-Flows.md` and `docs/uiux/Component-State-Contract.md` for product behavior.
6. `Ngh1aa/uiux-ai-workspace` operating contract / UIUX Factory / `skills_UIUX`.
7. Current Apple Human Interface Guidelines for iOS visual behavior.

Older Ledger / Financial Field Guide design documents remain historical evidence only and must not override this active direction.

## Definition of Done

1. The product UI visibly reflects the active iOS 26 contract.
2. Existing hero/secondary/exception/recovery/security flows remain interactive.
3. Home, Activity, Transaction Detail, Cards, Transfer Review, Savings and KYC render at 1440 / 1024 / 768 / 390 without document overflow.
4. Core protection and transfer flows pass.
5. Automated accessibility/browser checks pass at the configured baseline.
6. Rendered screenshots are opened and visually critiqued after the latest material visual change.
7. P0/P1 visual issues are repaired and QA re-run.
8. When gates are acceptable, merge to `main` and verify the main-branch run / deployment rather than waiting for another explicit merge request.
