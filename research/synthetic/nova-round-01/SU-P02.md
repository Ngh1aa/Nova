# SU-P02 — Speed-focused mobile banking user

**Synthetic persona only — not a real participant.**  
Age perspective: 25  
Device: 390px mobile  
Primary stress: fast transfer, minimum reading, mobile obstruction.

## Task 1 — Decide what is safe to spend

**Observed path:** Home → immediately reads `€1,300 Safe to spend` → uses Send money quick action.

**Synthetic reaction:** “The answer is obvious enough that I don’t need to inspect the chart first.”

- Outcome: success
- Positive: the hero supports fast scanning.

## Task 2 — Suspicious transaction

**Observed path:** mobile home → recent unusual activity → transaction detail.

- Outcome: success in discovery.
- Friction: none specific beyond the Report-action scope noted in SU-P01/P03.

## Task 3 — Transfer with impact review

**Observed path:** recipient → amount → review on 390px viewport.

**Synthetic reaction:** “I’m trying to hit Confirm quickly, but there are two non-product navigation/tooling layers floating in the lower interaction area.”

- Outcome: partial
- Observation: the fixed recruiter `State Lab` launcher occupies the lower-right CTA area while the product bottom navigation occupies the lower-left/bottom region. On the rendered review state, reviewer tooling competes directly with `Confirm with biometrics` / `Edit transfer`.
- Severity: **P0 for usability/research sessions**, P1 for normal prototype review.
- Required iteration: use `lab=1` for research URLs and collapse the launcher to icon-only on small viewports.

## Task 4 — Recover from failure

**Observed path:** biometric failure → recovery options.

**Synthetic reaction:** “The copy is clear, but I want the product controls to be the only interactive things near my thumb.”

- Outcome: success after ignoring reviewer tooling.

## P02 synthesis

The core transfer model works; the failure is environment contamination from a reviewer-only utility. Fix before any human session so research evidence is about Nova rather than State Lab.