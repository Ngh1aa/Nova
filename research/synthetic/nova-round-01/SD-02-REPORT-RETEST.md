# SD-02 — Report transaction synthetic retest

**Evidence class:** `SYNTHETIC_USER_WALKTHROUGH / AI_DOGFOOD`  
**Direct-user evidence:** `NO`  
**Counts toward `verified_sessions`:** `NO`  
**Finding under retest:** `SD-02 — Report transaction scope / dead-end ambiguity`  
**Implementation candidate:** PR `#58 — fix: make report transaction boundary explicit`  
**Tested head:** `bc03443e00523471cf4922ba8eabd49128316b11`  
**Nova Visual QA:** run `36682877726` — `SUCCESS`

## Why this retest exists

Synthetic Round 01 found the same P1 risk from three perspectives:

- **SU-P01** expected `Report transaction` to behave like a formal product action and did not know what would happen next;
- **SU-P03** expected a report action to open a case rather than end in a prototype-only message;
- **SU-P05** was likely to choose the more formal-sounding report action quickly and hit the old dead end.

The iteration intentionally does **not** invent a production bank dispute backend. It makes the prototype boundary explicit and provides enough next-step state to test the decision honestly.

## Iteration under test

Transaction detail now exposes:

- `Freeze card` as a reversible protective action;
- `Start report` as the beginning of a separate simulated reporting path;
- visible copy stating that the report flow is simulated and **no bank case is created**.

The reporting path then provides:

1. **Report review**
   - `Nothing has been reported`;
   - transaction identity and amount remain visible;
   - the prototype explicitly says it cannot contact a bank, create a dispute, or request a refund;
   - user can continue to `Preview report handoff` or cancel.
2. **Report handoff preview**
   - `No bank case created`;
   - `Nothing was submitted`;
   - card protection remains unchanged;
   - bank case = `Not created`;
   - refund / provisional credit = `Not requested or promised`;
   - the screen explains what a real bank flow would still need before creating a case/reference.

## Synthetic retest — SU-P01

**Perspective:** cautious first-time budgeting user; wants to understand consequences before committing.

**Retest path:** ByteMart detail → reads the visible report boundary → `Start report` → review → `Preview report handoff`.

**Synthetic observation:** The report action no longer implies that clicking it immediately opens a dispute. The first report state explicitly says nothing has been reported, and the handoff state repeats that no bank case was created.

**Result:** `PASS_FOR_SYNTHETIC_PERSPECTIVE`

**Remaining uncertainty:** A real participant may still interpret `Preview report handoff` differently from the intended prototype boundary. Human P01 must be allowed to explain the state in their own words without moderator teaching.

## Synthetic retest — SU-P03

**Perspective:** risk-averse frequent card user; separates evidence review, card protection and formal reporting.

**Retest path:** ByteMart evidence → compares `Freeze card` with `Start report` → enters report review → reaches handoff preview → checks card-protection state.

**Synthetic observation:** Reporting and freezing are now separate decisions. The report preview does not mutate `nova_card_frozen`, and the UI explicitly states `Card protection — Not changed by this preview`.

**Result:** `PASS_FOR_SYNTHETIC_PERSPECTIVE`

**Preserve:** Keep the existing language that unusual activity is not confirmed fraud and that freezing does not make an already-authorized payment disappear.

## Synthetic retest — SU-P05

**Perspective:** low-attention / interruption-heavy user; tends to scan the strongest action/status text and act quickly.

**Viewport:** `390 × 844`  
**Research mode:** `lab=1`

**Retest path:** transaction detail → `Start report` → report review → handoff preview.

**Browser-backed checks:**

- reviewer State Lab is absent in research mode;
- `Start report` is visible and operable;
- `Nothing has been reported` is visible on the first report state;
- `Preview report handoff` is visible and operable;
- `No bank case created` and `Nothing was submitted` are visible in the handoff state;
- `Not requested or promised` remains visible for refund / provisional credit;
- no horizontal overflow was detected at 390px across the tested report path.

**Synthetic observation:** The strongest status copy now communicates the non-submission boundary even if supporting paragraphs are skimmed.

**Result:** `PASS_FOR_SYNTHETIC_PERSPECTIVE`

## Regression / integrity evidence

`qa/report-boundary.spec.mjs` protects the following product truths:

- report review is reachable from the suspicious transaction;
- no bank-case claim is made;
- no refund/provisional-credit outcome is promised;
- report preview does not freeze the card;
- the path remains operable at 390px with reviewer tooling removed;
- the tested mobile path does not introduce horizontal overflow.

Nova Visual QA run `36682877726` passed the full project suite, including UIUX Factory dogfood, runtime drift protection, accessibility/browser evidence, existing P0/P1 regressions and the report-boundary retest.

## Decision

**SD-02 status:** `RESOLVED_FOR_SYNTHETIC_ROUND / PENDING_HUMAN`

No additional pre-human iteration is justified by this synthetic finding. The next evidence upgrade for SD-02 must come from a real participant, not another AI persona.

## Human evidence boundary

This retest does **not** mean:

- a user understood the report flow;
- a real user successfully completed Task 2;
- the design is user-validated;
- reporting confidence improved;
- a bank dispute workflow was implemented.

Human Round 01 remains independently governed by `research/validation/nova-round-01/` with `verified_sessions = 0` until real anonymized participant records exist.
