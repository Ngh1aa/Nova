# Nova Round 02 — Participant tracker

**Target:** 3–5 verified post-change retest records.  
**Responses received:** 5.  
**Current verified count:** 0.

| ID | Participant type | Recruitment | Eligibility | Consent | Method | Task 2 | Task 3 | Full set | Record | Evidence state |
|---|---|---|---|---|---|---|---|---|---|---|
| R02-P01 | NOT_CAPTURED | RESPONSE_RECEIVED | ELIGIBLE | YES | ASYNC_SELF_REPORT | RESPONSE_RECEIVED | RESPONSE_RECEIVED | RESPONSE_RECEIVED | `sessions/R02-P01.md` | VERIFICATION_PENDING |
| R02-P02 | NOT_CAPTURED | RESPONSE_RECEIVED | ELIGIBLE | YES | ASYNC_SELF_REPORT | RESPONSE_RECEIVED | RESPONSE_RECEIVED | RESPONSE_RECEIVED | `sessions/R02-P02.md` | VERIFICATION_PENDING |
| R02-P03 | NOT_CAPTURED | RESPONSE_RECEIVED | ELIGIBLE | YES | ASYNC_SELF_REPORT | RESPONSE_RECEIVED | RESPONSE_RECEIVED | RESPONSE_RECEIVED | `sessions/R02-P03.md` | VERIFICATION_PENDING |
| R02-P04 | NOT_CAPTURED | RESPONSE_RECEIVED | ELIGIBLE | YES | ASYNC_SELF_REPORT | RESPONSE_RECEIVED | RESPONSE_RECEIVED | RESPONSE_RECEIVED | `sessions/R02-P04.md` | VERIFICATION_PENDING |
| R02-P05 | NOT_CAPTURED | RESPONSE_RECEIVED | ELIGIBLE | YES | ASYNC_SELF_REPORT | RESPONSE_RECEIVED | RESPONSE_RECEIVED | RESPONSE_RECEIVED | `sessions/R02-P05.md` | VERIFICATION_PENDING |

## State rules

- `Participant type`: `NEW` or `RETURNING_FROM_ROUND_01` only after confirmed. The supplied export did not capture this field.
- `Method`: `MODERATED` or `ASYNC_SELF_REPORT`.
- `COMPLETED` requires Task 2 + Task 3 at minimum plus consent/build capture.
- `VERIFIED_RECORD` requires an anonymized session artifact and integrity review.
- The supplied responses contain eligibility, consent and all four tasks, but participant type, test date and participant-side frozen-build confirmation are still missing; therefore they remain `VERIFICATION_PENDING`.
- `verified_records` equals the number of rows in `VERIFIED_RECORD`; never infer it from submitted forms.
- Do not commit names, emails, phone numbers, social handles, account details, screenshots of real banking apps, or any identifying information.
