# Nova — Project Context

## Project identity

- **Project name:** Nova — Personal Banking & Money Planning
- **Project type:** Responsive interactive UI/UX prototype / portfolio case
- **Repository:** `https://github.com/Ngh1aa/Nova`
- **Source methodology:** `Ngh1aa/uiux-ai-workspace`
- **Current stage:** Senior system consolidation → rendered QA → owner review
- **Project mode:** `interactive_prototype`
- **Responsive scope:** `1440 / 1024 / 768 / 390`
- **Release authority:** review branch / PR only; **never merge `main` automatically** in Portfolio Ops.

## Problem frame

Nova is not a balance viewer. It is a decision-support banking prototype for young digital-first account owners who need to understand what money is genuinely safe to use after bills, savings commitments and a protected buffer. The portfolio risk is not lack of screens; it is that successive redesign layers can obscure the underlying product thesis and make the implementation look like surface styling rather than a coherent system.

## Completion criteria — senior pass

1. Home makes **safe to spend** and the reason behind it understandable before secondary metrics.
2. Money Horizon exposes upcoming commitments and protected buffer without implying predictive certainty.
3. Critical recovery journey remains intact: `Home → unusual transaction → detail → freeze card → confirmation`.
4. Transfer journey shows financial impact before commitment and clearly labels simulated behavior.
5. One active visual system owns production styling; historical redesign layers do not compete in the runtime cascade.
6. Primary controls preserve visible focus, ≥44px targets and reduced-motion behavior.
7. Required product routes render without overflow at 1440 / 1024 / 768 / 390 and without console/runtime errors.
8. No copied third-party component code is introduced; visual references are inspiration only.

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

## Direction — AUTO_WITH_REVIEW

**STATUS: AGENT-SELECTED — Financial Decision OS — 2026-09-22**

Three adjectives: **calm / precise / protective**.

Three-second feeling: a premium banking workspace where the first question answered is “what can I safely do next?”, not a colorful analytics dashboard.

Hero moment: **Safe to spend + Money Horizon** form one decision pair. The amount is prominent; commitments and protected buffer explain it immediately.

Color logic: cool neutral canvas, white surfaces, one functional blue accent, semantic mint/yellow/red only when meaning requires them. Pastel surfaces may support categorization but must not become decoration.

Typography logic: system sans, tabular numerals for money, restrained scale, strong amount hierarchy.

Signature detail: compact dark desktop rail + forward-looking Money Horizon. On smaller breakpoints navigation transforms rather than merely shrinking.

Anti-AI-look rule: no decorative glow/gradient/card-stack motion; no arbitrary rainbow cards; no generic SaaS sidebar; no “insight for you” filler.

### Alternatives considered

1. **Editorial Money Ledger** — expressive and differentiated, but previously rejected and weakens native-banking credibility.
2. **Colorful Bento Banking** — high visual energy, but risks turning financial decisions into a generic component gallery.
3. **Financial Decision OS** — selected because it preserves iOS-native calm while giving Nova a product-specific safe-to-spend signature.

## Design decision ledger

| Decision | Alternative | Trade-off | Success signal |
|---|---|---|---|
| Safe-to-spend is the primary amount | Lead with account balance | Requires explaining the formula | User can tell spendable money without mental subtraction |
| Money Horizon stays adjacent to the primary decision | Put forecast on a separate analytics page | More information on Home | Upcoming commitments are visible before spending decisions |
| Compact rail on wide desktop | Generic SaaS sidebar or full-width bottom nav | Less room for labels | Navigation remains legible without dominating finance content |
| One blue accent + semantic color | Pastel rainbow surfaces | Less decorative variety | CTA/state hierarchy survives squint test |
| System v4/v5 own runtime cascade | Keep every historical redesign stylesheet loaded | Requires consolidation QA | Fewer override conflicts and clearer component ownership |
| Motion is state/attention support only | Card stacks, glow, parallax | Less spectacle | Reduced-motion fallback is straightforward and finance stays calm |

## Visual research — ADOPT / ADAPT / REJECT

- **21st.dev dashboard/stats research:** ADAPT information-density and metric hierarchy; REJECT wholesale dashboard templates and dependency-heavy component copying.
- **Flux UI card-stack research:** ADOPT its explicit reduced-motion / token discipline as a quality cue; REJECT springy stacked-card behavior for money decisions.
- **Animata fund/card research:** ADAPT compact financial-widget clarity; REJECT swipe/throw/glow interactions that could reduce trust or compete with critical banking states.

No source code from these references is copied in this pass. License risk for the implementation is therefore N/A for inspiration-only use.

## Active visual system

Runtime ownership is intentionally narrow:

- `assets/nova.css` — structural/product foundation.
- `assets/accessibility.css` + `assets/nova-a11y.css` — accessibility foundation.
- `assets/nova-system-v4.css/js` — active composition, navigation and Pay system.
- `assets/nova-system-v5.css/js` — final geometry and nested-state refinement.
- `assets/nova-motion.css/js` — restrained motion layer.
- `assets/nova-financial-intelligence.js` — Money Horizon enhancement.

Historical Ledger, iOS26, pastel and dashboard generations remain in the repository as design history but are no longer loaded by `app.html`. This is a structural ownership change, not a cosmetic v6 override.

## Responsive composition

### 1440 / 1024
- Main content uses the available workspace rather than a phone-width column.
- Home prioritizes planning content and upcoming impact.
- Cards uses card object + quick controls side by side where space permits.
- Transaction detail separates evidence from protective actions.
- Navigation stays compact and does not mimic a generic admin sidebar.

### 768
- Major layouts collapse to one column.
- Navigation transforms to the existing constrained mobile pattern.

### 390
- Single-column layout with compact side inset.
- No document-level horizontal overflow.
- Primary actions remain ≥44px and reachable.

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

## Verification status for this pass

- Code ownership consolidation: **VERIFIED** in branch source.
- Third-party code copied: **VERIFIED — none introduced by this pass**.
- Build/lint/typecheck: **UNKNOWN until branch CI/runtime executes**.
- Rendered 1440 / 1024 / 768 / 390 QA: **UNKNOWN until browser evidence is produced**.
- Keyboard/focus/contrast/console/reduced-motion hard gates: **UNKNOWN until rendered QA**.
- Preview URL: **UNKNOWN**.

A Portfolio Ops PR must remain **ĐANG THI CÔNG / NEEDS WORK** while any rendered hard gate is UNKNOWN.
