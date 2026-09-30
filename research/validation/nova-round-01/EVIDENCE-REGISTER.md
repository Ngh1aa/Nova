# Nova Round 01 — Evidence Register

**Current evidence state: INTAKE TARGET RECEIVED / VERIFICATION PENDING**  
**Real participant intakes: 5 / 5**  
**Verified sessions: 0 / 5 minimum**

This register is the only place that promotes participant evidence into portfolio-ready findings. Five real participant form intakes now exist, but none is a `VERIFIED_RECORD` yet.

## Pending real-participant intakes

| ID | Eligibility | Consent | Raw intake | Evidence state |
|---|---|---|---|---|
| P01 | ELIGIBLE | Yes | `raw-intake/P01-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |
| P02 | ELIGIBLE | Yes | `raw-intake/P02-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |
| P03 | ELIGIBLE | Yes | `raw-intake/P03-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |
| P04 | ELIGIBLE | Yes | `raw-intake/P04-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |
| P05 | ELIGIBLE | Yes | `raw-intake/P05-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |

The provisional clustering of these self-reports lives in `REAL-INTAKE-PROVISIONAL-SYNTHESIS.md`. It is not the official finding register.

A later supplied batch reused labels P01–P04 after P01 had already been assigned. To preserve audit history, those four records were remapped in arrival order to P02–P05.

## Session ledger

| Session | Date | Completed verified session | Consent for anonymized portfolio evidence | Prototype commit | Notes path |
|---|---|---:|---:|---|---|
| P01 | — | No — form intake only | Yes | — | `raw-intake/P01-PARTICIPANT-FORM.md` |
| P02 | — | No — form intake only | Yes | — | `raw-intake/P02-PARTICIPANT-FORM.md` |
| P03 | — | No — form intake only | Yes | — | `raw-intake/P03-PARTICIPANT-FORM.md` |
| P04 | — | No — form intake only | Yes | — | `raw-intake/P04-PARTICIPANT-FORM.md` |
| P05 | — | No — form intake only | Yes | — | `raw-intake/P05-PARTICIPANT-FORM.md` |

## Finding register

Add a finding only when it references verified real session evidence IDs from `evidence-ledger.jsonl`.

| Finding ID | Observation | Supporting sessions | Contradicting sessions | Interpretation | Design implication | State |
|---|---|---|---|---|---|---|
| — | No verified participant-session evidence yet | — | — | — | — | PLANNED |

Allowed states:
- `OBSERVED` — raw behavior/quote exists in at least one verified session;
- `PATTERN` — repeated across multiple verified sessions, contradictions retained;
- `VERIFIED_FOR_ROUND` — synthesis gate passed for this small qualitative round;
- `RETEST_REQUIRED` — design changed and the claim must not be presented as improved until retested.

## Metrics register

Do not write usability percentages before actual verified session data exists.

| Metric | Numerator | Denominator | Result | Evidence |
|---|---:|---:|---:|---|
| Task 1 success | — | — | NOT MEASURED | — |
| Task 1 critical-error-free | — | — | NOT MEASURED | — |
| Task 2 success | — | — | NOT MEASURED | — |
| Task 3 impact interpretation correct | — | — | NOT MEASURED | — |
| Task 4 recovery success | — | — | NOT MEASURED | — |

Counts inside the provisional synthesis describe **form self-report responses**, not moderated task-success metrics.

## Portfolio promotion gate

The Nova case study may move from **“Benchmark + hypothesis / no measured outcome yet”** to a user-evidence statement only when all are true:

- [ ] Minimum five completed anonymized verified session notes exist.
- [ ] Every published finding cites session/evidence IDs.
- [ ] Contradictory evidence is represented.
- [ ] Raw observations are separated from researcher interpretation.
- [ ] The exact prototype commit tested is recorded.
- [ ] Any design change after Round 01 is labeled as an iteration, not an improvement, until retested.
- [ ] Portfolio copy is updated from this register, never from memory or AI-generated synthesis alone.

## AI use rule

AI may cluster anonymized notes or draft synthesis. It may not invent quotes, participants, counts, task results, confidence scores or causal explanations. Human review decides the final evidence state.
