# Nova Round 01 — Direct-user record verification

**Executed method:** unmoderated task-based prototype evaluation with participant self-report  
**Original planned method:** moderated usability test  
**Verified direct-user records:** 5 / 5  
**Verified moderated sessions:** 0 / 5  
**Evidence class:** `DIRECT_USER_SELF_REPORT`

## Why the method is reclassified

The five submitted participant records contain eligible screener answers, consent, responses to all four task prompts and debrief answers. However, the supplied data does not contain moderator observation, per-task assistance, time-on-task, session mode/date or a reliably captured tested build.

Therefore these records are verified only as **complete consented direct-user self-report records**. They are not retroactively described as moderated sessions and they cannot support observed task-success, observed error-rate or measured improvement claims.

## Verification rule

A record qualifies as `VERIFIED_DIRECT_USER_SELF_REPORT` when all are true:
1. screener answers meet the Round 01 participant criteria;
2. consent to participate is `yes`;
3. consent to anonymized research-note / case-study use is `yes`;
4. answers exist for all four task sections and the debrief;
5. no PII or real financial credentials/data are stored in the repository;
6. the source is retained verbatim as supplied to the researcher, or any editing is explicitly marked;
7. missing moderator/build metadata is preserved as missing rather than invented.

This state verifies the **research record**, not the participant's identity, not the tested build, and not the accuracy of every participant interpretation.

## Verified records

| ID | Eligibility | Consent | Four tasks complete | Debrief complete | PII check | Record state |
|---|---|---|---|---|---|---|
| P01 | PASS | YES | YES | YES | PASS | VERIFIED_DIRECT_USER_SELF_REPORT |
| P02 | PASS | YES | YES | YES | PASS | VERIFIED_DIRECT_USER_SELF_REPORT |
| P03 | PASS | YES | YES | YES | PASS | VERIFIED_DIRECT_USER_SELF_REPORT |
| P04 | PASS | YES | YES | YES | PASS | VERIFIED_DIRECT_USER_SELF_REPORT |
| P05 | PASS | YES | YES | YES | PASS | VERIFIED_DIRECT_USER_SELF_REPORT |

## Limitations retained

- exact prototype commit actually used by each participant: not captured;
- task timing: not captured;
- moderator assistance: not applicable / not captured because the executed method was unmoderated;
- observable behavior separate from self-report: not captured;
- numeric Safe-to-spend answers cannot be scored against the current Euro baseline because build/currency context was not captured;
- no claim of observed task success or human-validated improvement is allowed from these records alone.

## What these records can support

They can support direct-user self-report patterns such as:
- what participants believed an action would do;
- whether participants said information felt sufficient;
- confidence ratings supplied by participants;
- how participants described Money Horizon / Safe to spend;
- explicit requests for clarification or changes.

They can drive an **evidence-informed design iteration**. Any claim that the iteration improved usability requires a new post-change retest using a captured build and a method appropriate to the claim.
