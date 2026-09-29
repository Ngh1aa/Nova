# Nova Round 01 — Decision Log

This log records product/design decisions that may change after real usability evidence. It is intentionally conservative while `verified_sessions = 0`.

## D-01 — Money Horizon as the safe-to-spend decision surface

- **Current decision:** Keep Money Horizon visible near the primary balance, with upcoming commitments and protected buffer in the same decision context.
- **Evidence state:** `HYPOTHESIS + DESK_EVIDENCE`
- **Why it exists:** A current balance alone does not represent known near-term obligations.
- **What could change it:** Participants misread projected/committed money as guaranteed or freely spendable, or fail to notice the protected buffer.
- **Next evidence:** Task 1 in `STUDY-PLAN.md`.
- **Current action:** Do not change before baseline unless a blocking prototype defect appears.

## D-02 — Freeze must have a visible recovery path

- **Current decision:** Keep suspicious-transaction detail, freeze consequence and recovery/unfreeze as one recoverable protection model.
- **Evidence state:** `HYPOTHESIS + WORKING_PROTOTYPE`
- **What could change it:** Participants freeze without understanding the consequence, cannot locate recovery, or interpret recovery as unsafe.
- **Next evidence:** Task 2.

## D-03 — Transfer review before simulated authentication

- **Current decision:** Show amount/recipient/impact review before the final confirmation/authentication step.
- **Evidence state:** `HYPOTHESIS + WORKING_PROTOTYPE`
- **What could change it:** Participants confirm while misunderstanding the impact on available money or treat the review as redundant noise.
- **Next evidence:** Task 3.

## D-04 — Recovery before blame

- **Current decision:** Failure states should explain what can be corrected or retried and preserve entered context where safe.
- **Evidence state:** `HYPOTHESIS + WORKING_PROTOTYPE`
- **What could change it:** Participants cannot diagnose the failure or choose a sensible recovery without moderator help.
- **Next evidence:** Task 4.

## Update contract

After each completed session:
1. append atomic observations to `evidence-ledger.jsonl`;
2. reference the anonymized session artifact;
3. update `FINDINGS.md` only when evidence IDs exist;
4. update a decision here only when the cited evidence materially changes confidence or direction;
5. label a changed design as **iteration**, not **improvement**, until retested.
