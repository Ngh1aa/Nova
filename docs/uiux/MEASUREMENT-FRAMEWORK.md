# Nova — Measurement Framework

## Evidence status

This is a **measurement plan**, not a results report.

Unless explicitly backed by committed evidence, every product metric below is `NOT_MEASURED`.

Nova is an interactive portfolio prototype. It has no production banking backend, real customer cohort, live transaction telemetry or verified business impact.

## Product outcome hypothesis

Nova's central hypothesis is:

> If people can see a clear Safe-to-spend amount that already accounts for known commitments, planned savings and a protected buffer, they may make day-to-day money decisions with less ambiguity and fewer avoidable mistakes.

Evidence state: `HYPOTHESIS`

## Primary outcome metrics

| Metric | What it would tell us | Current state |
|---|---|---|
| Safe-to-spend comprehension rate | Whether users correctly understand what the number includes/excludes | NOT_MEASURED |
| Money Horizon task success | Whether users can answer “what can I safely spend?” from the interface | NOT_MEASURED |
| Transfer consequence comprehension | Whether users understand the impact of a transfer before confirmation | NOT_MEASURED |
| Suspicious-transaction protection success | Whether users can review, freeze and recover without misinterpreting transaction status | NOT_MEASURED |
| Recovery completion rate | Whether biometric/offline/insufficient-balance failures can be resolved without accidental completion | NOT_MEASURED |

## Prototype usability measures for Round 01

These may be measured in moderated sessions without pretending to be production KPIs.

### Task 1 — Interpret Money Horizon

Record:

- task success: pass / partial / fail;
- whether participant can explain Safe to spend in their own words;
- whether they incorrectly treat total balance as safely spendable;
- time to first correct interpretation;
- confidence rating after task, clearly labeled subjective.

### Task 2 — Review suspicious activity

Record:

- whether participant identifies that “unusual” does not mean confirmed fraud;
- whether they inspect transaction evidence before acting;
- whether they understand freeze consequences;
- whether they can find the recovery/unfreeze path.

### Task 3 — Send money

Record:

- whether recipient/amount/reference are checked before confirmation;
- whether the participant notices Safe-to-spend impact;
- whether above-safe warnings are understood;
- whether biometric failure/passcode fallback is recoverable;
- whether participant ever believes money moved before a confirmed success state.

## Guardrail metrics

These matter because optimizing speed alone would be dangerous in a finance flow.

| Guardrail | Why it matters | Current state |
|---|---|---|
| False-completion belief | User must not believe money moved after failure/cancel/offline | NOT_MEASURED |
| False-fraud belief | “Needs review” must not be interpreted as confirmed fraud | NOT_MEASURED |
| Protected-buffer misunderstanding | User must know when a transfer would consume money currently allocated to commitments/buffer | NOT_MEASURED |
| Recovery dead-end rate | High-risk actions need a clear route back to safety | NOT_MEASURED |
| Accessibility blocker count | Critical task should remain possible without pointer-only interaction | NOT_MEASURED_MANUALLY |

## Product telemetry proposal — hypothetical production system

The following event taxonomy is a design/handoff proposal only.

### Money Horizon

- `money_horizon_viewed`
  - `safe_to_spend_band`: positive / tight / overcommitted
  - `data_freshness`: fresh / stale / unavailable
- `money_horizon_details_opened`
- `commitment_opened_from_horizon`

### Transfer

- `transfer_started`
- `transfer_amount_entered`
  - `amount_band`: within_safe / above_safe / above_balance
- `transfer_above_safe_warning_shown`
- `transfer_above_safe_warning_acknowledged`
- `transfer_review_viewed`
- `transfer_confirmation_started`
- `transfer_auth_failed`
- `transfer_passcode_fallback_started`
- `transfer_completed`
- `transfer_cancelled`

### Protection

- `unusual_activity_opened`
- `card_freeze_explainer_viewed`
- `card_freeze_confirmed`
- `card_unfreeze_started`
- `card_unfreeze_completed`
- `transaction_report_started`

## Funnel examples

### Transfer safety funnel

`transfer_started -> amount_entered -> review_viewed -> confirmation_started -> completed`

Segment separately:

- within Safe to spend;
- above Safe to spend;
- insufficient total balance;
- biometric failure;
- offline interruption.

Never combine these into one success rate without segment context.

### Suspicious activity funnel

`unusual_activity_opened -> evidence_reviewed -> freeze_explainer_viewed -> freeze_confirmed -> recovery_or_report`

A high freeze rate is **not automatically good**. It may indicate fear, unclear language or poor anomaly precision.

## Business metric hypotheses

These are only meaningful if Nova became a real product and had production data.

Possible outcomes to investigate:

- lower support contacts for “how much can I safely spend?” type questions;
- fewer failed transfers caused by insufficient available balance;
- higher completion of protective card actions after suspicious-activity alerts;
- lower abandonment after biometric failure because fallback is clear;
- increased use of savings planning without missed known commitments.

Current state for all: `NOT_MEASURED / HYPOTHETICAL`

## Anti-metric rules

Do not claim:

- “confidence improved by X%” without a real pre/post protocol;
- “conversion increased” without a real product funnel;
- “retention improved” without longitudinal production data;
- “fraud reduced” from a prototype;
- “users prefer Nova” from internal critique or recruiter QA;
- Lighthouse/axe scores as proof that users understand the product.

## Decision linkage

Every future metric must map back to a product decision.

Example:

`Decision:` Surface Safe to spend before total balance in the primary decision field.  
`Expected user effect:` fewer users use total balance as their spending limit.  
`Measure:` comprehension task + production interaction data if/when available.  
`Evidence now:` hypothesis only.

This keeps Nova's portfolio story focused on evidence and learning rather than manufactured impact.
