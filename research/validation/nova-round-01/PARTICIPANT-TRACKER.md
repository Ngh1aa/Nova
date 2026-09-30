# Nova Round 01 — Participant Tracker

**Purpose:** track anonymous research records without storing personally identifying information.

Do **not** put names, emails, phone numbers, social handles, banking information, or other PII in this file.

| Slot | Recruitment status | Screener | Source record | Evidence state |
|---|---|---|---|---|
| P01 | COMPLETED | ELIGIBLE | `raw-intake/P01-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |
| P02 | COMPLETED | ELIGIBLE | `raw-intake/P02-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |
| P03 | COMPLETED | ELIGIBLE | `raw-intake/P03-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |
| P04 | COMPLETED | ELIGIBLE | `raw-intake/P04-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |
| P05 | COMPLETED | ELIGIBLE | `raw-intake/P05-PARTICIPANT-FORM.md` | VERIFIED_DIRECT_USER_SELF_REPORT |

## Executed method

Five real participant form records were supplied. Each passed the submitted screener, granted consent and completed all four task sections plus debrief questions.

The executed method is classified as **unmoderated task-based prototype evaluation with participant self-report**. The original moderated protocol was prepared but the supplied records do not contain moderator observations, assistance, time-on-task, session mode/date or a reliably captured tested build.

Therefore all five records are verified as `VERIFIED_DIRECT_USER_SELF_REPORT`, **not** as `VERIFIED_RECORD` moderated sessions.

See `DIRECT-USER-VERIFICATION.md` for the verification contract.

## Evidence-count rule

- `verified_direct_user_records` counts complete consented self-report records that pass `DIRECT-USER-VERIFICATION.md`.
- `verified_sessions` counts moderated session records that satisfy `sessions/README.md`.
- A direct-user self-report record must never be relabeled as a moderated session to inflate evidence quality.

Current counts:
- verified direct-user self-report records: **5 / 5**;
- verified moderated sessions: **0 / 5**.

A later supplied batch reused labels P01–P04 after study ID P01 already existed. Those four records were remapped in arrival order to P02–P05 to preserve audit history.
