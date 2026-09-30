# Nova Phase 3 — Evidence-informed clarity iteration

Status: `IMPLEMENTED / PENDING_RENDERED_QA`

## Why this iteration exists

The user chose to skip the planned moderated Round 03 execution. This implementation therefore uses the already verified Round 02 async self-report evidence as its research source and keeps the evidence boundary explicit.

It is **not** a claim of moderated validation or observed task-success improvement.

## Evidence source

`research/validation/nova-round-02/RETEST-SYNTHESIS.md`

Priority findings implemented here:

- `F-02 / D-03` — Protected buffer semantics remained poorly understood even when transfer arithmetic was clearer.
- `F-03 / D-01` — the intended `next 14 days` horizon remained weak.
- `F-04 / D-04` — no-money-moved clarity showed a negative Round 02 cross-sectional self-report signal.

## Changes

### F-04 — failure-state money certainty

- `NO MONEY MOVED` becomes the dominant recovery status for biometric, offline and balance-revalidation failure states.
- Concrete failure cause is kept adjacent to the safety state.
- Current balance is explicitly described as unchanged.
- Existing recovery actions remain available but visually secondary to the safety message.
- The dominant recovery status is programmatically focusable and receives focus on the failure route.

### F-02 — Protected buffer rule

At transfer amount/review decision surfaces Nova now states:

`Protected buffer stays reserved — this transfer does not use it.`

This is intentionally placed at the decision point rather than only in explanatory copy elsewhere.

### F-03 — 14-day horizon

- Home Safe-to-spend language explicitly includes `next 14 days`.
- Money Horizon range labels standardize on `Next 14 days`.
- Transfer impact/review headings repeat the same horizon language.

### Accessibility input-assistance repair

`#amount-error` is upgraded to an assertive atomic alert region while preserving `aria-invalid` and the existing field association.

This is a targeted implementation improvement, not a WCAG conformance claim.

## Implementation ownership

The existing generated foundation bundle is left untouched. Phase 3 clarity behavior lives in:

- `assets/nova-phase3-clarity.js`
- `assets/nova-phase3-clarity.css`

They load after `nova-current-state.js`, so this layer owns only the evidence-driven copy/hierarchy repair and does not fork core balance/state logic.

## QA gate

`qa/phase3-clarity.spec.mjs` verifies:

- primary 14-day language;
- Protected-buffer decision-point message;
- dominant no-money-moved status and concrete cause;
- generic revalidation recovery;
- programmatic amount-error announcement;
- explicit runtime evidence boundary (`round02-informed-not-moderated`).

The shared Nova Visual QA workflow also captures the offline state and runs the Phase 3 regression spec.

## Claim boundary

Allowed after rendered QA passes:

> Round 02 evidence changed Nova's next design iteration: failure states now foreground money-movement certainty, transfer review states the Protected-buffer rule at the decision point, and Safe-to-spend uses consistent 14-day language.

Not allowed without new compatible evidence:

- usability improved;
- F-02/F-03/F-04 are validated as fixed;
- observed task completion improved;
- moderated Round 03 occurred;
- WCAG conformance;
- business impact improved.
