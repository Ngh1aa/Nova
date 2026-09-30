# Nova Round 02 — Decision update

This log records what changed after the verified Round 02 async retest. It extends the Round 01 decisions without rewriting async self-report as observed usability behavior.

## D-01 — Safe-to-spend horizon

- **Round 01 decision:** attach the horizon to the primary Safe-to-spend number.
- **Round 02 evidence:** `E-R02-011`–`E-R02-015`.
- **Result:** `UNRESOLVED`.
- **Why:** only 2/5 identify the intended 14-day horizon; two answer `today`, one is unsure, and two self-discount the displayed amount.
- **Next decision:** promote `NEXT 14 DAYS` into the primary label/explanation and keep that exact horizon language consistent across Home, Money Horizon and transfer review.
- **Severity:** remain `P2`.
- **Implementation status:** `ITERATED / NOT RETESTED` on `fix/nova-round02-clarity-iteration`. Home, Money Horizon and transfer surfaces now use explicit `next 14 days` language.

## D-02 — Sensitive-action truth boundary

- **Round 01 decision:** make demo-only consequences part of Freeze/Report labels and result copy.
- **Round 02 evidence:** `E-R02-001`–`E-R02-005`.
- **Result:** `IMPROVED_SELF_REPORT_SIGNAL / UNRESOLVED`.
- **Why:** 2/5 now understand the state as demo/preview and distinguish Freeze from Report, but 3/5 still report a real-bank consequence, uncertainty or action conflation.
- **Next decision:** place `DEMO ONLY · NO BANK CONTACT` on the primary action/result surface and increase visual/semantic separation between Freeze and Report.
- **Severity:** remain `P1`.
- **Implementation status:** `OPEN`. Not changed in this Phase 3 slice because the user explicitly prioritized skipping the moderated Round 03 path and moving to the next F-02/F-03/F-04 clarity implementation.

## D-03 — Transfer impact + Protected buffer

- **Round 01 decision:** show before → transfer → fee → after arithmetic and state that Protected buffer is not automatically used.
- **Round 02 evidence:** `E-R02-006`–`E-R02-010`.
- **Result:** `PARTIAL_IMPROVEMENT / UNRESOLVED`.
- **Why:** 5/5 land around €1,155 after the €145 transfer, but only 1/5 correctly understands that Protected buffer is not automatically consumed.
- **Next decision:** preserve the arithmetic. Add an explicit decision-point statement: `Protected buffer stays reserved — this transfer does not use it.`
- **Severity:** remain `P1`.
- **Implementation status:** `ITERATED / NOT RETESTED`. The explicit Protected-buffer rule is now present on transfer amount and review decision surfaces.

## D-04 — Failure cause + money-movement certainty

- **Round 01 decision:** pair concrete failure cause with explicit `No money moved` reassurance.
- **Round 02 evidence:** `E-R02-016`–`E-R02-020`.
- **Result:** `REGRESSED_SELF_REPORT_SIGNAL`.
- **Why:** only 2/5 Round 02 participants explicitly understand that no money moved, versus 4/5 in Round 01 self-report; three are unsure. This is a cross-sectional signal across different participants, not causal proof.
- **Next decision:** make `NO MONEY MOVED` the dominant failure-state headline/status; place the authentication cause immediately beside it; keep retry/passcode actions secondary.
- **Severity:** keep `P2` for now, but make D-04 the highest-consequence next implementation priority and re-evaluate severity after the next retest.
- **Implementation status:** `ITERATED / NOT RETESTED`. Biometric, offline and revalidation failures now foreground `No money moved`, show the concrete cause and state that the balance is unchanged.

## Phase 3 execution note

The planned moderated Round 03 was explicitly skipped by the user on `2026-10-01`. It remains `0 moderated sessions` and must not be represented as validation evidence.

The next implementation instead uses existing Round 02 evidence plus UIUX Factory state-feedback, microcopy and accessibility guidance. Runtime QA may verify that the intended copy/state behavior is implemented; it cannot close F-02/F-03/F-04 as human-validated findings.

## Next implementation priority

1. **D-04** — implementation complete, retest still open.
2. **D-02** — remains the next unresolved P1 design decision.
3. **D-03** — implementation complete, retest still open.
4. **D-01** — implementation complete, retest still open.

## Claim boundary

Allowed: Round 02 changed product priorities because it produced verified self-report evidence on the frozen post-iteration build. The following implementation is evidence-informed and can be described as an iteration after Round 02.

Not allowed: claiming observed task-success improvement, causality, F-02/F-03/F-04 as validated fixes, moderated Round 03 evidence, or overall validated usability improvement.
