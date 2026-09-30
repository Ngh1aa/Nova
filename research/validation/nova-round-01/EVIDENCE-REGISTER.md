# Nova Round 01 — Evidence Register

**Current evidence state: PLANNED / RECRUITING**  
**Verified sessions: 0 / 5 minimum**

This register is the only place that promotes participant evidence into portfolio-ready findings. Until verified session files exist and are referenced here, the product thesis remains unvalidated.

## Pending real-participant intake

P01 has submitted a real participant form response and passed the submitted screener/consent questions. The raw intake is stored at:

`raw-intake/P01-PARTICIPANT-FORM.md`

This is currently `REAL_PARTICIPANT_SELF_REPORT / VERIFICATION_PENDING`, not a verified moderated session. Required session-integrity metadata is still missing, so it does not increment `verified_sessions`, does not populate the atomic ledger, and does not create a portfolio-ready finding yet.

## Session ledger

| Session | Date | Completed | Consent for anonymized portfolio evidence | Prototype commit | Notes path |
|---|---|---:|---:|---|---|
| P01 | — | No — form intake only | Yes | — | `raw-intake/P01-PARTICIPANT-FORM.md` |
| P02 | — | No | — | — | — |
| P03 | — | No | — | — | — |
| P04 | — | No | — | — | — |
| P05 | — | No | — | — | — |

## Finding register

Add a finding only when it references raw session IDs.

| Finding ID | Observation | Supporting sessions | Contradicting sessions | Interpretation | Design implication | State |
|---|---|---|---|---|---|---|
| — | No verified participant-session evidence yet | — | — | — | — | PLANNED |

Allowed states:
- `OBSERVED` — raw behavior/quote exists in at least one verified session;
- `PATTERN` — repeated across multiple sessions, contradictions retained;
- `VERIFIED_FOR_ROUND` — synthesis gate passed for this small qualitative round;
- `RETEST_REQUIRED` — design changed and the claim must not be presented as improved until retested.

## Metrics register

Do not write percentages before actual verified session data exists.

| Metric | Numerator | Denominator | Result | Evidence |
|---|---:|---:|---:|---|
| Task 1 success | — | — | NOT MEASURED | — |
| Task 1 critical-error-free | — | — | NOT MEASURED | — |
| Task 2 success | — | — | NOT MEASURED | — |
| Task 3 impact interpretation correct | — | — | NOT MEASURED | — |
| Task 4 recovery success | — | — | NOT MEASURED | — |

## Portfolio promotion gate

The Nova case study may move from **“Benchmark + hypothesis / no measured outcome yet”** to a user-evidence statement only when all are true:

- [ ] Minimum five completed anonymized verified session notes exist.
- [ ] Every published finding cites session IDs.
- [ ] Contradictory evidence is represented.
- [ ] Raw observations are separated from researcher interpretation.
- [ ] The exact prototype commit tested is recorded.
- [ ] Any design change after Round 01 is labeled as an iteration, not an improvement, until retested.
- [ ] Portfolio copy is updated from this register, never from memory or AI-generated synthesis alone.

## AI use rule

AI may cluster anonymized notes or draft synthesis. It may not invent quotes, participants, counts, task results, confidence scores or causal explanations. Human review decides the final evidence state.
