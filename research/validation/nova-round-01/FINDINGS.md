# Nova Round 01 — Findings

**Evidence state:** `DIRECT_USER_SELF_REPORT / RETEST_REQUIRED`  
**Verified direct-user records:** `5`  
**Verified moderated sessions:** `0`  
**Atomic evidence:** `evidence-ledger.jsonl`

These findings are grounded in five consented real-user form records. They describe **participant self-report patterns**, not observed task-success metrics. Any claim that a design change improved usability requires a post-change retest.

## Severity scale used here

- **P0** — blocks a critical task or creates an immediate high-consequence safety/compliance risk in the tested prototype evidence.
- **P1** — materially affects trust, comprehension or decision quality across a core flow and repeats across participants.
- **P2** — meaningful clarity/friction issue with lower immediate risk or a narrower consequence.

No P0 pattern is supported by the current five self-report records.

## F-01 — Sensitive-action boundary is not clear enough

- **Severity:** `P1`
- **State:** `DIRECT_USER_PATTERN / RETEST_REQUIRED`
- **Decision affected:** `D-02`
- **Supporting evidence IDs:** `E-DU-001`, `E-DU-002`, `E-DU-003`, `E-DU-004`, `E-DU-005`
- **Contradicting evidence IDs:** none in the supplied self-report set
- **Observation:** all five records contain uncertainty, a mistaken expectation, or an explicit request for clearer distinction between preview/demo and a real banking action. One participant explicitly reported that a bank report/case had been created after viewing the preview flow.
- **Interpretation:** the current prototype boundary is visible in copy but not dominant enough at the moment users choose or interpret a sensitive action.
- **Design implication:** make the simulated nature part of the action label and immediate consequence copy, not only supporting text.
- **Limitation:** self-report only; no observed click path or moderator probe exists.

## F-02 — Transfer-impact explanation is insufficient for most respondents

- **Severity:** `P1`
- **State:** `DIRECT_USER_PATTERN / RETEST_REQUIRED`
- **Decision affected:** `D-03`
- **Supporting evidence IDs:** `E-DU-006`, `E-DU-007`, `E-DU-008`, `E-DU-009`
- **Contradicting evidence IDs:** `E-DU-010`
- **Observation:** four of five participants reported that the information available before confirmation was only partially sufficient or not sufficient. Confidence was lowest for the participant who reported no information sufficiency.
- **Interpretation:** showing the projected number alone does not explain the transition strongly enough; users want the relationship among before amount, transfer amount, fee, protected buffer and after amount.
- **Design implication:** add a compact before → transfer/fee → after calculation and explicitly state that the protected buffer is not pulled automatically.
- **Limitation:** this is a self-reported sufficiency count, not an observed task-success rate.

## F-03 — Safe-to-spend meaning is fairly consistent, but its horizon is ambiguous

- **Severity:** `P2`
- **State:** `DIRECT_USER_PATTERN / RETEST_REQUIRED`
- **Decision affected:** `D-01`
- **Supporting evidence IDs:** `E-DU-011`, `E-DU-012`, `E-DU-013`, `E-DU-014`, `E-DU-015`
- **Contradicting evidence IDs:** none; the contradiction is between different horizon interpretations
- **Observation:** participants generally describe Safe to spend as money remaining after obligations/buffer, but the selected horizon splits across Nova's forecast window, end of week and next payday.
- **Interpretation:** the concept is understandable while the time boundary is not attached strongly enough to the primary decision number.
- **Design implication:** attach the horizon directly to the primary Safe-to-spend label and repeat the end point in transfer impact context.
- **Limitation:** exact tested build/currency context was not captured, so numeric amount answers are not scored.

## F-04 — Recovery communicates “no money moved” better than it explains the failure cause

- **Severity:** `P2`
- **State:** `DIRECT_USER_PATTERN / RETEST_REQUIRED`
- **Decision affected:** `D-04`
- **Supporting evidence IDs:** `E-DU-016`, `E-DU-017`, `E-DU-019`
- **Contradicting / positive evidence IDs:** `E-DU-018`, `E-DU-020`
- **Observation:** three participants reported only partial or no understanding of why the transfer failed, while four of five reported that money had not moved; one participant remained unsure whether money moved.
- **Interpretation:** the safety consequence is stronger than the diagnosis. The explicit no-money-moved language should be preserved while the failure reason becomes more specific.
- **Design implication:** pair the failure cause with the safety consequence in the same callout and keep recovery choices visible.
- **Limitation:** no observed recovery path or assistance data exists.

## Decision map

- `D-01` — Whether Money Horizon communicates safe-to-spend context without implying certainty.
- `D-02` — Whether suspicious-transaction protection/reporting consequences are understandable.
- `D-03` — Whether transfer review communicates financial impact before confirmation.
- `D-04` — Whether failure recovery supports diagnosis and retry while preserving safety clarity.

## Retest rule

Every finding above becomes an **iteration input**, not an improvement claim. After the design changes, the affected task must be repeated with a captured build. Portfolio copy may say the iteration was informed by five direct-user self-report records, but must not say usability improved until retest evidence exists.
