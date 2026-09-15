# Ledger — Project Context

## Project identity

- **Project name:** Ledger — Personal Banking & Money Planning
- **Project type:** Mobile-first interactive UI/UX prototype / portfolio case
- **Repository / workspace:** `https://github.com/Ngh1aa/Nova`; the repository name is retained while the visible product is redesigned as Ledger.
- **Source methodology:** `Ngh1aa/uiux-ai-workspace@221370ef294408f3f5a0c6a7fb0567c3db840c3e`
- **Current stage:** Implementation / rendered QA
- **Project mode:** `interactive_prototype`
- **Responsive scope:** `responsive_all` (1440 / 1024 / 768 / 390)
- **Release authority:** `create_pr_only`

## Project goal

Ledger demonstrates portfolio-level consumer-finance product thinking through a believable personal banking experience centered on safe-to-spend planning, transaction trust, KYC, cards, transfers, savings and exception recovery.

Success means a recruiter or Product Design Lead can follow realistic journeys, understand the decision logic, inspect system states and responsive behavior, and see implementation/QA evidence without the work feeling like a generic fintech template.

### Primary users

18–30, digital-first account owners with recurring payments who want spending control without maintaining spreadsheets.

### Main user problems

1. Balance does not equal money safely available to spend.
2. Spending breakdowns are often retrospective instead of decision-oriented.
3. Upcoming bills and subscriptions are easy to forget.
4. Savings progress is fragmented from day-to-day spending.
5. Suspicious transactions require fast, trustworthy protective actions.

## Product problem frame

- **Highest-value task:** Decide what money is truly safe to spend while preserving upcoming obligations and goals.
- **Observed friction:** `INFERRED` from benchmark synthesis: leading products expose balance, upcoming payments, savings, transfers and card controls, but those concerns are frequently separated. Ledger composes them into one readable planning register.
- **Primary behavior:** Check money position -> identify issue/opportunity -> act -> understand consequence/recovery.
- **Critical journey:** Home -> Money Horizon -> unusual transaction -> detail -> freeze -> confirmation -> report/review or unfreeze.
- **Secondary journey:** Home/Pay -> recipient -> amount -> review -> authentication -> simulated receipt.
- **Recovery paths:** freeze/unfreeze, biometric fallback, insufficient funds correction, offline review, KYC capture retry/manual review.
- **Unknown evidence:** real regulation, bank policy, production analytics, real fraud signals and primary user-study evidence remain `UNKNOWN`.

## Visual direction

### Working direction

**Modern Daybook — accountable / editorial / tactile / measured / readable.**

### Visual signature

**Ruled Money Ledger:** warm paper, hairline rules, bounded serif financial figures, date gutters, right-aligned values and a dated Money Horizon. The system borrows the structure of ledgers/statements/planners at low metaphor fidelity without fake paper texture, handwriting or vintage decoration.

### Must

- Warm paper canvas and strong ink hierarchy.
- Serif for financial figures and major editorial totals; system sans for controls/body.
- Square corners across UI.
- No decorative box shadows.
- Sections and totals separated primarily by rules and spacing.
- Distinct compositions for Home, Activity, Transaction Detail, Cards, Transfer, Savings and KYC.
- Money Horizon remains a functional planning object.
- Reduced motion, visible focus, ≥44px interaction targets and non-color state indicators.
- Explicit prototype/simulation disclosure.

### Must not

- Rounded-card/pill-first fintech template grammar.
- Purple/blue gradients, glass, glow or soft floating dashboard cards.
- Giant figures that collide with adjacent controls.
- Donut-chart-first dashboard.
- Faux paper texture, stamps, handwriting, perforations or nostalgia styling.
- Odometer/slot-machine money animation or confetti.
- Fake testimonials/business metrics.
- “Fraud detected” without evidence.
- Imply freeze reverses authorized payments or merchant blocking cancels a subscription.

## Product success and validation

No production metrics exist. Do not claim conversion, fraud reduction, retention or improved financial outcomes.

Planned/implemented verification signals:

- Hero flow completes without confusing freeze with reversal.
- Safe-to-spend remains visibly distinct from total balance.
- Upcoming commitments and protected buffer remain understandable.
- Transfer review exposes recipient, amount and resulting safe-to-spend.
- Biometric/offline/insufficient-funds/KYC recovery paths remain usable.
- Shared visual contract has automated regression coverage for overflow, Home amount/action collision, square-corner action styling and serif financial figures.
- Cloud implementation checks cover route integrity, interactions, browser rendering, automated accessibility and Lighthouse budgets.

## Source of truth

1. User brief for Ledger.
2. `.uiux-profile.json`.
3. `docs/uiux/Ledger-Research-2026.md`.
4. `docs/uiux/Ledger-Design-Contract-2026.md`.
5. `docs/uiux/IA-and-Flows.md`.
6. `docs/uiux/Component-State-Contract.md`.
7. `Ngh1aa/uiux-ai-workspace` operating contract / UIUX Factory / `skills_UIUX`.

## Technology

- **Frontend:** static HTML/CSS/JavaScript, GitHub Pages-compatible.
- **Architecture:** existing `assets/nova.css` + `assets/nova.js` interaction model is preserved; `assets/ledger.css` owns the Ledger visual layer; product states route through `app.html?screen=...`; evidence pages are standalone HTML.
- **Backend/database:** N/A; banking operations are simulated.
- **Release:** feature branch -> cloud QA/rendered critique -> PR. Merge/deploy are outside current `create_pr_only` authority.

## System reality

| Capability | Reality | Rule |
|---|---|---|
| Account balances | STATIC/SIMULATED | Prototype data only |
| Money Horizon | SIMULATED computation | Formula is transparent in UI |
| Transaction risk flag | SIMULATED | “Needs review”; no confirmed-fraud claim |
| Freeze/unfreeze | SIMULATED | Explain consequences accurately |
| Transfers | SIMULATED | Never claim real money moved |
| KYC | SIMULATED | No real identity verification |
| Biometrics | SIMULATED | Interaction/state demo only |
| Notifications | SIMULATED | Prototype events |

## Definition of Done

1. Ledger research and Design Contract are canonical. ✅
2. Visible product/evidence identity and visual system are implemented on an isolated feature branch.
3. Existing hero/secondary/exception/recovery/security flows remain interactive.
4. Responsive behavior is verified at 1440 / 1024 / 768 / 390.
5. UIUX Factory cloud QA runs on the exact target implementation using Playwright/axe/Lighthouse and screenshots.
6. Rendered screenshots are manually opened and critiqued; P0/P1 issues are repaired and re-run.
7. Lighthouse thresholds are not weakened.
8. A PR is created only after due-now gates pass; merge/deploy require later explicit authorization.
