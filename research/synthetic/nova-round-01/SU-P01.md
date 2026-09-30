# SU-P01 — Cautious first-time budgeting user

**Synthetic persona only — not a real participant.**  
Age perspective: 22  
Device: desktop  
Primary stress: Money Horizon comprehension, suspicious activity, transfer consequence, recovery.

## Task 1 — Decide what is safe to spend before Friday

**Observed path:** Home → reads dominant `€1,300 Safe to spend` → checks total balance `€2,840`, protected buffer `€500`, upcoming bills.

**Synthetic reaction:** “€1,300 looks like the answer, but I still want to know whether that means safe today, until Friday, or for the whole next-two-weeks plan.”

- Outcome: success
- Interpretation: mostly correct
- Friction: time horizon is not attached to the primary `Safe to spend` label.
- Severity: P2

## Task 2 — Suspicious transaction

**Observed path:** Recent transactions → unusual card activity → ByteMart detail → reviews merchant/time/card/location → sees Freeze card and Report transaction.

**Synthetic reaction:** “I’d probably report this first, because reporting sounds like the formal action. I’m not sure what happens after that.”

- Outcome: partial
- Friction: `Report transaction` visually reads like a complete product action although the prototype scope ends at the entry point.
- Severity: P1 candidate

## Task 3 — Transfer with impact review

**Observed path:** Pay → saved recipient → Maya → amount €145 → reads `€1,155 Safe to spend after sending` → review.

**Synthetic reaction:** “This is reassuring because I can see the consequence before confirmation.”

- Outcome: success
- Friction: none material.
- Preserve: projected Safe-to-spend and protected-buffer explanation.

## Task 4 — Recover from failed biometric

**Observed path:** biometric failure → sees `No transfer has been made` → Use passcode / Try biometrics again.

**Synthetic reaction:** “I know the money didn’t move, so retrying feels safe.”

- Outcome: success
- Friction: none material.
- Preserve: explicit no-money-moved recovery truth.

## P01 synthesis

Primary candidate issue: reporting scope ambiguity. Secondary candidate: make Safe-to-spend horizon slightly more explicit. No evidence here counts toward human Round 01.