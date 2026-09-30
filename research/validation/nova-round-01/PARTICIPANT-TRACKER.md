# Nova Round 01 — Participant Tracker

**Purpose:** track recruitment progress without storing personally identifying information.

Do **not** put names, emails, phone numbers, social handles, banking information, or other PII in this file.

| Slot | Recruitment status | Screener | Scheduled | Session record | Evidence state |
|---|---|---|---|---|---|
| P01 | COMPLETED | ELIGIBLE | — | `raw-intake/P01-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |
| P02 | OPEN | NOT_RUN | — | — | NONE |
| P03 | OPEN | NOT_RUN | — | — | NONE |
| P04 | OPEN | NOT_RUN | — | — | NONE |
| P05 | OPEN | NOT_RUN | — | — | NONE |

## P01 integrity note

P01 is a **real participant form intake**: screener passed, consent was granted and responses were supplied for all four tasks plus debrief questions.

`COMPLETED` here means the participant form/task response was completed. It does **not** mean `VERIFIED_RECORD`.

P01 remains `VERIFICATION_PENDING` because the supplied dataset does not yet include all fields required by `sessions/README.md`, including session date/mode, exact tested prototype commit, per-task moderator assistance and observable behavior separate from self-report. Do not increment `verified_sessions` until those gaps are resolved and `sessions/P01.md` passes integrity review.

## Allowed recruitment statuses

- `OPEN`
- `INVITED`
- `SCREENED`
- `ELIGIBLE`
- `SCHEDULED`
- `COMPLETED`
- `VERIFIED_RECORD`
- `INELIGIBLE`
- `DECLINED`
- `NO_SHOW`
- `WITHDREW`
- `INVALID_SESSION`

## Evidence rule

`COMPLETED` is not enough to update the portfolio.

A slot becomes `VERIFIED_RECORD` only when:
1. an anonymized session file exists under `sessions/P0X.md`;
2. the session integrity checklist is complete;
3. the exact prototype commit/version is recorded;
4. quotes are verbatim or marked as paraphrase;
5. no PII or real financial data is committed.

`verified_sessions` in `status.json` must equal the count of `VERIFIED_RECORD` rows — never the number of invitations, scheduled sessions, completed calls, or completed participant forms.
