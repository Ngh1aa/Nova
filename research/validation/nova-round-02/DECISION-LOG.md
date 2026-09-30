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
- **Implementation status:** `ITERATED / NOT RETESTED` on `fix/nova-d02-sensitive-action-boundary`. Transaction Detail now separates Freeze and Report into distinct consequence cards, places `DEMO ONLY · NO BANK CONTACT` beside the decision, makes the Freeze confirmation explicitly demo-only, and carries the same truth boundary into Report preview/handoff result states.

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

The D-01/D-03/D-04 implementation uses existing Round 02 evidence plus UIUX Factory state-feedback, microcopy and accessibility guidance. Runtime QA may verify that the intended copy/state behavior is implemented; it cannot close those findings as human-validated findings.

## D-02 execution note

The D-02 iteration also uses only the verified Round 02 async self-report evidence plus UIUX Factory product-state guidance. Runtime and rendered QA can verify that Freeze and Report are now visibly separated and truthfully labeled; they cannot establish that participant comprehension improved.

## Current implementation priority

1. **D-02** — implementation complete; human comprehension retest remains open.
2. **D-04** — implementation complete; retest remains open.
3. **D-03** — implementation complete; retest remains open.
4. **D-01** — implementation complete; retest remains open.

No new human-validation round is implied by this status. The user explicitly skipped moderated Round 03.

## Claim boundary

Allowed: Round 02 changed product priorities because it produced verified self-report evidence on the frozen post-iteration build. The following implementations are evidence-informed iterations after Round 02.

Not allowed: claiming observed task-success improvement, causality, D-01/D-02/D-03/D-04 as validated fixes, moderated Round 03 evidence, or overall validated usability improvement.
