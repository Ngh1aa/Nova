# NOVA — Project Context

## Project identity

- **Project name:** NOVA — Personal Banking & Money Health
- **Project type:** Mobile-first interactive UI/UX prototype / portfolio case
- **Repository / workspace:** `https://github.com/Ngh1aa/Nova`; source methodology is `Ngh1aa/uiux-ai-workspace`
- **Current stage:** Implementation / QA
- **Project mode:** `interactive_prototype`
- **Responsive scope:** `responsive_all` (1440 / 1024 / 768 / 390)

## Project goal

- **Primary goal:** Demonstrate portfolio-level consumer fintech product thinking through a believable personal banking experience centered on money health, transaction trust, KYC, cards, transfers, savings, and exception recovery.
- **Success looks like:** A recruiter or Product Design Lead can follow realistic banking journeys, understand the decision logic behind them, inspect system states and responsive behavior, and see implementation/QA evidence without the work feeling like a generic fintech template.
- **Primary users:** 18–30, digital-first, many recurring payments, want spending control without maintaining spreadsheets.
- **Main user problems:**
  1. Balance does not equal money safely available to spend.
  2. Spending breakdowns are often retrospective instead of decision-oriented.
  3. Upcoming bills and subscriptions are easy to forget.
  4. Savings progress is fragmented from day-to-day spending.
  5. Suspicious transactions require fast, trustworthy protective actions.

## UX / product problem frame

- **Priority user / role:** Personal banking customer.
- **Highest-value task:** Decide what money is truly safe to spend while preserving upcoming obligations and goals.
- **Observed friction / unmet need:** `INFERRED` from benchmark synthesis: leading apps expose balance, spending, upcoming payments, savings and card controls, but these are commonly split into separate views/features. NOVA will compose them into one decision layer.
- **Owner objective:** Demonstrate trust, engagement, self-service card security, and confident transaction/payment completion without misleading users.
- **Primary behavior:** Check money health -> identify issue/opportunity -> act (review transaction, transfer, adjust savings, manage bill/card).
- **User value:** Reduced mental math and clearer next action.
- **Owner value:** More self-service, clearer high-risk actions, stronger trust signals in a simulated portfolio product.
- **Critical journey:** Home -> Money Horizon -> suspicious transaction -> detail -> freeze -> confirmation -> review/report or unfreeze.
- **Important recovery paths:** freeze/unfreeze, transaction dispute entry, biometric fallback, insufficient funds correction, offline retry, KYC capture retry/manual review.
- **Evidence that could change the design:** Real target-market regulation, bank policy, actual account/card capabilities, real fraud signals, user study evidence, production analytics. All are `UNKNOWN`.

## Product success and measurement

No production metrics exist. Do not claim conversion, fraud reduction, retention, or improved financial outcomes.

### Planned validation signals

- Hero flow task completion without misinterpreting “freeze” as “reverse transaction”.
- User can explain “safe to spend” vs total balance after a 5-second exposure.
- User can identify the next bill and whether a savings goal is on track.
- User can recover from biometric failure and offline/insufficient-balance states.
- Automated implementation checks: route integrity, interactions, keyboard, a11y, runtime, screenshot coverage, Lighthouse budgets.

## Research and validation access

- **Existing user research:** UNKNOWN
- **Existing usability evidence:** UNKNOWN
- **Available production analytics:** UNKNOWN
- **Current feasible validation:** benchmark research, heuristic review, prototype task testing (planned), accessibility/browser automation after implementation.
- **High-risk hypotheses to test:**
  - H1: “Safe to spend” is understood as a computed planning figure, not an account balance guarantee.
  - H2: Money Horizon communicates committed vs available money faster than a conventional budget chart.
  - H3: Users understand freeze-card consequences and do not expect it to cancel already-authorized transactions.
  - H4: A suspicious-transaction alert can be urgent without being alarmist or falsely declaring fraud.

## Source of truth

- User project brief for NOVA.
- `Ngh1aa/uiux-ai-workspace` operating contract, UIUX Factory, skills_UIUX and cloud QA policy.
- Phase-1 artifacts in `docs/uiux/`.
- Official benchmark/help documentation listed in `Research-Synthesis.md`.

## Technology

- **Target frontend:** static HTML/CSS/JavaScript, implemented as a GitHub Pages-friendly interactive prototype.
- **Architecture:** shared `assets/nova.css` + `assets/nova.js`; product states routed through `app.html?screen=...`; evidence pages are standalone HTML.
- **Backend/database:** N/A for prototype; banking operations are simulated.
- **Deployment:** planned GitHub Pages.

## Constraints

### Must
- Calm / clear / human.
- Mobile-first consumer banking realism.
- Money Horizon as visual signature.
- KYC, transaction, card controls, transfer, savings/subscriptions/security flows.
- Important states actually exercised in prototype.
- Reduced motion; keyboard/focus; ≥44px touch targets; non-color state indicators.
- Explicitly mark prototype data and simulated capabilities.

### Must not
- Purple fintech gradient template.
- Gambling/casino-like money animation or number rolling.
- Donut-chart-first dashboard.
- Card-grid overload.
- Fake testimonials or business metrics.
- “Fraud” declaration without evidence; use review/risk language.
- Hide the difference between blocking future payments and cancelling a merchant subscription.

## System reality

| Capability | Reality | Rule |
|---|---|---|
| Account balances | STATIC/SIMULATED | Prototype data only |
| Money Horizon | SIMULATED computation | Formula is transparent in UI |
| Transaction risk flag | SIMULATED | “Needs review”; no real fraud claim |
| Freeze/unfreeze | SIMULATED state | Explain consequences accurately |
| Transfers | SIMULATED | Never claim money moved |
| KYC | SIMULATED | No real identity verification |
| Biometrics | SIMULATED | Interaction/state demo only |
| Notifications | SIMULATED | Prototype events |

## Definition of Done for the full project

1. Target repo and feature branch exist. ✅
2. Required product screens and portfolio evidence screens are implemented.
3. Hero + secondary + exception/recovery/security flows are interactive.
4. Responsive behavior verified at 1440/1024/768/390.
5. Cloud QA runs on target implementation with Playwright/axe/Lighthouse and screenshots.
6. Rendered screenshots are manually inspected; critique/repair loop closes P0/P1 issues.
7. PR is created; merge happens only after applicable gates pass and authorization is clear.
