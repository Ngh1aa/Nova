# Nova Round 01 — Evidence Register

**Current evidence state: DIRECT_USER_SELF_REPORT / RETEST_REQUIRED**  
**Verified direct-user records: 5 / 5**  
**Verified moderated sessions: 0 / 5**

The executed evidence is a five-person **unmoderated task-based prototype evaluation with participant self-report**. The original moderated study protocol remains useful as a future retest method, but these five records are not retroactively labeled as moderated sessions.

See `DIRECT-USER-VERIFICATION.md` for the verification contract and `evidence-ledger.jsonl` for atomic evidence.

## Direct-user record register

| ID | Eligibility | Consent | Source | Record state |
|---|---|---|---|---|
| P01 | ELIGIBLE | Yes | `raw-intake/P01-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |
| P02 | ELIGIBLE | Yes | `raw-intake/P02-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |
| P03 | ELIGIBLE | Yes | `raw-intake/P03-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |
| P04 | ELIGIBLE | Yes | `raw-intake/P04-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |
| P05 | ELIGIBLE | Yes | `raw-intake/P05-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |

## Finding register

| Finding ID | Severity | Pattern | Supporting records | Contradiction | State |
|---|---|---|---|---|---|
| F-01 | P1 | Sensitive-action demo/real boundary is unclear | P01–P05 | none in supplied self-report set | DIRECT_USER_PATTERN / RETEST_REQUIRED |
| F-02 | P1 | Transfer-impact explanation is insufficient for most respondents | P01–P04 | P05 reports enough information | DIRECT_USER_PATTERN / RETEST_REQUIRED |
| F-03 | P2 | Safe-to-spend meaning is understood more consistently than its time horizon | P01–P05 | horizon interpretations differ | DIRECT_USER_PATTERN / RETEST_REQUIRED |
| F-04 | P2 | Recovery explains no-money-moved better than the failure cause | P01–P05 | P03/P05 report clear cause | DIRECT_USER_PATTERN / RETEST_REQUIRED |

Detailed evidence IDs and limitations live in `FINDINGS.md`.

## What is measured vs not measured

### Measured / directly submitted
- 5 eligible real-user records with consent;
- participant-selected confidence ratings;
- participant-selected information-sufficiency answers;
- participant-written descriptions, expectations and requested changes.

### Not measured
- observed task success;
- observed critical-error rate;
- time-on-task;
- moderator assistance;
- exact build-specific numeric-answer accuracy;
- post-iteration improvement.

## Direct-user self-report counts

These counts describe submitted responses only.

| Signal | Count | Denominator | Meaning |
|---|---:|---:|---|
| Sensitive-action boundary uncertainty / mistaken expectation / explicit clarity request | 5 | 5 | self-report pattern |
| Transfer review answered `Một phần` or `Không` for information sufficiency | 4 | 5 | self-report sufficiency |
| Distinct Safe-to-spend horizon interpretations | 3 interpretations | 5 participants | concept-boundary ambiguity |
| Correctly reports that money did not move after recovery | 4 | 5 | self-reported state understanding |

## Portfolio use now allowed

Portfolio copy may truthfully say:
- Nova was evaluated with five eligible real users using an unmoderated task-based prototype form;
- the round produced direct-user self-report patterns that informed a design iteration;
- the strongest patterns concerned sensitive-action truth boundaries and transfer-impact explanation;
- post-iteration usability improvement remains unverified until retest.

Portfolio copy must **not** say:
- five moderated sessions were run;
- task success improved;
- the redesign is validated;
- a percentage is an observed usability success rate;
- the iteration improved confidence or comprehension without a post-change retest.

## Promotion / retest gate

After the evidence-driven iteration, repeat the affected tasks on the exact new build. A later round may use the prepared moderated protocol or another explicitly documented method. Only post-change evidence can support an improvement claim.
