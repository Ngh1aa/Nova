# P01 — Provisional Triage (Real Participant Intake)

**Source:** `P01-PARTICIPANT-FORM.md`  
**Evidence class:** `REAL_PARTICIPANT_SELF_REPORT / VERIFICATION_PENDING`  
**Official finding state:** `NOT_PROMOTED`  
**Verified sessions:** unchanged (`0`)  

> This triage is intentionally provisional. It may guide what the moderator verifies next, but it must not be cited as a validated finding or used to claim improvement until P01 passes session-integrity review.

## Integrity blocker before severity can become official

### V-01 — Exact tested build / currency presentation is unknown

- **Type:** verification blocker, not product severity yet.
- **Evidence:** participant answered Safe to spend as `1.850.000đ`, while the currently pinned study baseline is tracked separately and the form response does not state the exact prototype commit/currency presentation actually used.
- **Risk:** assigning task success/failure or a critical error without confirming the tested build could create false evidence.
- **Required next action:** record exact URL/commit/build and confirm whether the amount was read directly, converted, or paraphrased.

## Candidate product risks from self-report

### C-01 — Sensitive action boundary remains uncertain

- **Decision:** D-02
- **Provisional severity:** P1 candidate
- **Evidence:** participant correctly states that the report flow is a preview and no real action was submitted, but later says they are still unsure whether `Start report` sends a real report and whether `Freeze card` actually locks the card or is only a demo.
- **Interpretation:** the participant can decode the explicit preview state after reading it, but the product/prototype boundary is not consistently clear at the action-selection level.
- **Do not change yet:** verify observed path, assistance, and exact tested build first.

### C-02 — Transfer impact is understood only partially

- **Decision:** D-03
- **Provisional severity:** P1 candidate
- **Evidence:** participant expects Safe to spend to decrease after transfer, but reports only `Một phần` information sufficiency and confidence `3/5`; they are uncertain about fees and how the protected buffer affects the calculation.
- **Interpretation:** consequence preview is directionally understood, but the calculation model may not be sufficiently transparent for confirmation confidence.
- **Potential future iteration if verified:** clarify whether fees exist in the simulated flow and explicitly state that the protected buffer is preserved / not consumed by the transfer when that is the model.

### C-03 — Safe-to-spend horizon needs an explicit time anchor

- **Decision:** D-01
- **Provisional severity:** P2 candidate
- **Evidence:** participant conceptually defines Safe to spend correctly and selects the forecast period, but explicitly asks for a visible label such as `đến cuối tuần` or `đến kỳ lương`.
- **Interpretation:** concept comprehension may be good while first-glance temporal scope remains weaker than desired.
- **Potential future iteration if repeated/verified:** test a concise visible horizon qualifier without adding dashboard noise.

### C-04 — Recovery outcome is clear; failure diagnosis is less clear

- **Decision:** D-04
- **Provisional severity:** P2 candidate
- **Evidence:** participant says money has not moved, chooses biometric retry and confidence is `4/5`, but says they understand the reason for failure only `Một phần`.
- **Interpretation:** recovery safety message works better than failure-cause explanation.
- **Potential future iteration if repeated/verified:** improve cause/recovery distinction while preserving `No transfer has been made`.

## Preserve candidates

- Safe to spend + Upcoming bills are reported as the clearest parts.
- Money Horizon mental model is directionally aligned with the intended near-term timeline concept.
- The explicit `no money moved` recovery message appears reassuring.
- Participant distinguishes `Freeze card` and `Start report` as separate actions.

## Promotion rule

Do not move any candidate above into `FINDINGS.md`, `DECISION-LOG.md`, the atomic ledger, Figma `DIRECT_USER`, or portfolio evidence until the missing P01 integrity fields are supplied and `sessions/P01.md` qualifies as a verified record.
