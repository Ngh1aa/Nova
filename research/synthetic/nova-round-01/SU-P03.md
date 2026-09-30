# SU-P03 — Risk-averse frequent card user

**Synthetic persona only — not a real participant.**  
Age perspective: 29  
Device: desktop  
Primary stress: suspicious payment investigation and protective action.

## Task 1 — Safe to spend

Reads €1,300 as the action number and cross-checks total balance/buffer before trusting it.

- Outcome: success
- Friction: low.

## Task 2 — Suspicious transaction

**Observed path:** unusual activity → ByteMart Online → verifies channel/card/location/category → reads `New merchant` and `Higher than your usual online purchase` → considers protective actions.

**Synthetic reaction:** “The explanation is good because Nova says this is unusual, not definitely fraud. But `Report transaction` sounds like it should open a case. If it only shows a prototype message, I’ll feel I hit a dead end.”

- Outcome: partial
- Positive: risk explanation avoids claiming fraud certainty.
- Positive: Freeze card is described as reversible and explicitly does not pretend an already-authorized payment disappears.
- Friction: Report action scope mismatch.
- Severity: P1 candidate.

## Task 3 — Transfer

Checks recipient identity and consequence preview; no material issue.

- Outcome: success.

## Task 4 — Recovery

Biometric-failure state clearly separates authentication failure from money movement.

- Outcome: success.

## P03 synthesis

Preserve the evidence-first suspicious-transaction explanation and reversible freeze model. Product-scope decision needed for the report path before presenting it as a peer action in a user test.