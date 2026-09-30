# Nova — Synthetic Dogfood Round 01

**Evidence class:** `SYNTHETIC_USER_WALKTHROUGH / AI_DOGFOOD`  
**Direct-user evidence:** `NO`  
**Counts toward `verified_sessions`:** `NO`  
**Baseline implementation:** `487c0d768c9c1aa58c45d10f57cab6c6a126b90c`  
**Rendered evidence source:** Nova Visual QA artifact from merged-main run `36677133725`.

## Purpose

Use five intentionally different synthetic user perspectives to find usability/product issues before real participant fieldwork. These records are allowed to drive prototype iteration, but they must never be promoted to `DIRECT_USER`, real-user validation, success-rate evidence, or portfolio impact claims.

The walkthroughs were performed from rendered browser evidence/screens first. Source inspection happened only after an issue had already been identified from the rendered experience, so code knowledge did not define the user observation.

## Persona set

| ID | Synthetic perspective | Primary stress |
|---|---|---|
| SU-P01 | 22, cautious first-time budgeting user | Money Horizon comprehension + uncertainty |
| SU-P02 | 25, speed-focused mobile banking user | fast transfer + mobile obstruction |
| SU-P03 | 29, risk-averse frequent card user | suspicious transaction + protection |
| SU-P04 | 24, financially literate skeptic | trust, formula transparency, edge states |
| SU-P05 | 27, low-attention / interruption-heavy user | recovery, action hierarchy, prototype tooling |

## Cross-session findings

### SD-01 — Recruiter State Lab can interfere with the tested mobile task
- **Severity:** P0 for research/recruiter sessions; P1 for normal prototype use.
- **Evidence:** On the 390px transfer-review render, the fixed State Lab launcher occupies the same lower interaction zone as the primary confirmation controls. The mobile home render also shows the reviewer tool floating above product content.
- **Why it matters:** A usability participant can attend to or accidentally target reviewer tooling that is not part of the product. That contaminates task evidence.
- **Iteration:** research URLs must hide State Lab with `lab=1`; normal mobile prototype should collapse the launcher to a compact icon-only control.
- **Retest:** rerender 390px transfer review and confirm the primary action remains unobstructed.

### SD-02 — “Report transaction” looks like a product action but is only a prototype entry point
- **Severity:** P1 candidate.
- **Evidence:** Transaction detail presents `Freeze card` and `Report transaction` as peer protective actions. The current prototype boundary explains simulated risk, but the report path does not represent a completed dispute/case flow.
- **Why it matters:** A risk-averse user can reasonably choose Report first and expect a case/recovery flow. A prototype-only toast can feel like a dead end during Task 2.
- **Iteration candidate:** label/report boundary should be explicit at the decision point, or provide a small simulated next-step state rather than an apparently production-complete action.
- **Status:** not changed in this pass; requires a deliberate product-scope decision.

### SD-03 — Safe-to-spend is visually strong, but the time horizon is less explicit at the first decision moment
- **Severity:** P2.
- **Evidence:** Home hero makes `€1,300 Safe to spend` dominant and states that bills, saving and €500 buffer are covered. The 14-day horizon appears elsewhere in supporting content rather than directly in the primary label.
- **Why it matters:** A cautious first-time user can understand the number but still wonder whether it is safe “today”, “until payday”, or “for the next 14 days”.
- **Iteration candidate:** test a concise qualifier such as `Safe to spend · next 14 days` without increasing dashboard noise.
- **Status:** hold for real-user evidence unless repeated by additional synthetic/real sessions.

### SD-04 — Transfer impact/recovery is a strong part of the current prototype
- **Severity:** positive evidence, not a defect.
- **Evidence:** amount and review states preserve recipient/context, show projected Safe to spend before confirmation, keep commitments/buffer visible, and biometric failure explicitly states that no transfer has been made.
- **Implication:** preserve this model during future visual cleanup; do not simplify away consequence preview or recovery truth.

### SD-05 — Negative Safe-to-spend edge state is appropriately not clipped to zero
- **Severity:** positive evidence, not a defect.
- **Evidence:** the high-obligation scenario displays `−€8,420`, labels it `Overcommitted — not safe to spend`, exposes contributing obligations and keeps the protected buffer explicit.
- **Implication:** preserve signed negative state and explanation; it is more trustworthy than silently clipping to €0.

## Synthetic severity summary

- **P0:** 1 — reviewer tooling contaminates mobile research task.
- **P1:** 1 candidate — report-transaction scope/dead-end ambiguity.
- **P2:** 1 candidate — first-glance time-horizon ambiguity.
- **Preserve:** transfer consequence/recovery truth; signed negative edge state.

## Truth boundary

This round may be described as:

> “AI-assisted synthetic-user dogfooding was used to identify and prioritize prototype issues before human usability testing.”

It may **not** be described as:
- user validation;
- five user interviews;
- five research participants;
- `5/5 users`;
- measured task success;
- improved confidence;
- direct-user evidence.

Real Round 01 remains independently governed by `research/validation/nova-round-01/` and stays at `0 verified sessions` until real anonymized session records exist.
