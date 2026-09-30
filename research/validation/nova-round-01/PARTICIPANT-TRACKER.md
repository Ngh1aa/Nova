# Nova Round 01 — Participant Tracker

**Purpose:** track recruitment progress without storing personally identifying information.

Do **not** put names, emails, phone numbers, social handles, banking information, or other PII in this file.

| Slot | Recruitment status | Screener | Scheduled | Session record | Evidence state |
|---|---|---|---|---|---|
| P01 | COMPLETED | ELIGIBLE | — | `raw-intake/P01-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |
| P02 | COMPLETED | ELIGIBLE | — | `raw-intake/P02-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |
| P03 | COMPLETED | ELIGIBLE | — | `raw-intake/P03-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |
| P04 | COMPLETED | ELIGIBLE | — | `raw-intake/P04-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |
| P05 | COMPLETED | ELIGIBLE | — | `raw-intake/P05-PARTICIPANT-FORM.md` | VERIFICATION_PENDING |

## Current intake state

Five **real participant form intakes** have been supplied. Each submitted screener is eligible, consent was granted, and all four task sections plus debrief answers were provided.

`COMPLETED` means the participant form/task response was completed. It does **not** mean `VERIFIED_RECORD`.

All five remain `VERIFICATION_PENDING` because the supplied datasets do not yet include all fields required by `sessions/README.md`, including session date/mode, exact tested prototype commit, per-task moderator assistance, and observable behavior separate from self-report.

A later supplied batch reused labels P01–P04 after study ID P01 already existed. To preserve audit history, those four records were remapped in arrival order to P02–P05. See `REAL-INTAKE-PROVISIONAL-SYNTHESIS.md`.

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
