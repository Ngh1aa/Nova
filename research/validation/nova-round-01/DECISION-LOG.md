# Nova Round 01 — Decision Log

This log records product/design decisions changed by traceable direct-user evidence. Round 01 executed as an **unmoderated task-based prototype evaluation with participant self-report**. Five direct-user records are verified as research records; no moderated sessions or post-change improvement evidence exist yet.

## D-01 — Attach the Safe-to-spend horizon to the primary decision number

- **Previous decision:** Keep Money Horizon visible near the primary balance, with upcoming commitments and protected buffer in the same decision context.
- **Evidence state:** `DIRECT_USER_SELF_REPORT / RETEST_REQUIRED`
- **Evidence:** `E-DU-011`–`E-DU-015` / `F-03`
- **What changed:** Participants broadly describe Safe to spend correctly, but interpret the applicable horizon as forecast window, end of week or next payday.
- **Decision:** Keep Money Horizon, but add the time horizon directly to the primary Safe-to-spend label and repeat the boundary where transfer impact is shown.
- **Severity:** P2.
- **Retest requirement:** Task 1 on the exact iteration build; ask users what period the amount applies to without teaching the answer.

## D-02 — Make simulated sensitive-action consequences part of the action itself

- **Previous decision:** Keep suspicious-transaction detail, freeze consequence and reporting as recoverable protection/reporting models with supporting prototype-boundary copy.
- **Evidence state:** `DIRECT_USER_SELF_REPORT / RETEST_REQUIRED`
- **Evidence:** `E-DU-001`–`E-DU-005` / `F-01`
- **What changed:** All five self-report records contain uncertainty, mistaken expectation or an explicit request about real-versus-demo action boundaries. One participant reported that a report and bank case had already been created after viewing the preview.
- **Decision:** Move the simulated boundary into CTA labels and immediate consequence copy. Freeze may change only Nova's local prototype state; reporting must explicitly remain a preview until a real bank submission exists.
- **Severity:** P1.
- **Retest requirement:** Task 2; before and after the action ask what the participant believes has actually happened.

## D-03 — Explain transfer impact as a calculation, not only a projected result

- **Previous decision:** Show amount/recipient/impact review before final confirmation/authentication.
- **Evidence state:** `DIRECT_USER_SELF_REPORT / RETEST_REQUIRED`
- **Evidence:** `E-DU-006`–`E-DU-010` / `F-02`
- **What changed:** Four of five participants report only partial or insufficient information before confirmation; one participant reports enough information.
- **Decision:** Keep the review step, but add a compact before → transfer → fee → after calculation and explicitly state that protected buffer is not pulled automatically.
- **Severity:** P1.
- **Retest requirement:** Task 3; ask the participant to predict the impact before confirmation and explain which values changed.

## D-04 — Pair failure cause and safety consequence in the same recovery message

- **Previous decision:** Failure states explain what can be corrected/retried and preserve context where safe.
- **Evidence state:** `DIRECT_USER_SELF_REPORT / RETEST_REQUIRED`
- **Evidence:** `E-DU-016`–`E-DU-020` / `F-04`
- **What changed:** More participants understand that money did not move than understand why the failure occurred.
- **Decision:** Preserve explicit `No money moved` language, but place the concrete authentication/revalidation cause beside it and keep passcode/retry choices visible.
- **Severity:** P2.
- **Retest requirement:** Task 4; ask the user what failed, whether money moved and what they would do next.

## Current priority order

1. **P1 — D-02 sensitive-action truth boundary**
2. **P1 — D-03 transfer-impact explanation**
3. **P2 — D-01 Safe-to-spend horizon**
4. **P2 — D-04 failure diagnosis**

No P0 is supported by the current five direct-user self-report records.

## Update contract

1. every decision must cite atomic evidence IDs;
2. self-report must not be rewritten as observed behavior;
3. design changes are **iterations**, not improvements, until retested;
4. contradictory evidence remains visible;
5. portfolio/Figma copy must state the executed method accurately.
