# Nova Round 03 — Research plan

## Study state
`PLANNED_VALIDATION / BLOCKED_USER_EVIDENCE`

## Product decision map

| Decision / finding | Current uncertainty | What would change the decision |
|---|---|---|
| F-02 — Protected Buffer behavior | Round 02 arithmetic was clear, but only 1/5 self-reported the rule that the protected buffer is not automatically consumed. | Observed participants independently explain the rule while completing a transfer-impact task; repeated misunderstanding triggers content/IA/state repair. |
| F-03 — 14-day Money Horizon | Only 2/5 Round 02 respondents identified the intended 14-day horizon. | Observed participants locate and explain the horizon without a moderator cue; repeated confusion triggers hierarchy/labeling repair. |
| F-04 — failed-transfer recovery | Round 02 showed a cross-sectional regression signal: only 2/5 explicitly understood that no money moved after failure. | Observed participants correctly diagnose the failure, state money/balance consequence, and choose a safe recovery path without being taught. |
| A11Y-ERR — input assistance on consequential financial actions | Source inspection shows text errors/review/recovery, but no formal AT/manual conformance evaluation has been completed for the full flow. | Manual keyboard + screen-reader verification and observed moderated evidence expose whether errors/review/recovery are perceivable and actionable. |

## Method

Moderated qualitative usability test with think-aloud and neutral probes.

The purpose is issue discovery and behavioral evidence. Five sessions are **not** a quantitative benchmark sample and must not be used to estimate population conversion/task-success rates.

## Participants

Target: **5 real participants** in one primary user group.

Required behavioral profile:
- 18–30 years old for continuity with prior Nova rounds;
- uses mobile/digital banking at least weekly;
- has completed at least one person-to-person or bank transfer in the last 6 months;
- normally checks balance/upcoming payments or savings in a banking app;
- comfortable testing with simulated financial data.

Exclude:
- anyone asked to disclose real credentials, account numbers, card numbers, or private transaction history;
- people who worked directly on Nova/UIUX Factory;
- participants who cannot consent to the study or recording mode being used.

Accessibility/support needs are welcome and should be recorded only at the level needed to configure the session.

## Recruitment

Suggested channels:
- personal network outside the project team;
- university/young-professional communities;
- finance/product communities where recruitment rules permit;
- prior participants only if clearly marked returning; prefer new participants for this round.

Do not recruit by revealing the expected answers (for example, do not say the study is testing whether users understand a €500 protected buffer).

## Compensation

If compensation is offered, keep it flat per completed session and independent of performance. Record the amount privately in recruitment operations; no payment data belongs in the public repo.

## Consent and data handling

Before starting:
- explain that Nova is a portfolio prototype and no real banking occurs;
- explain session purpose, approximate duration and recording method;
- obtain consent for participation and any audio/video/screen recording;
- allow withdrawal without penalty;
- avoid collecting unnecessary personal data.

Repository records use participant IDs only (`P01`…`P05`). Names/contact details remain outside the repository.

## Test environment

Preferred session length: **25–35 minutes**.

Record per session:
- tested commit SHA and URL;
- device/viewport;
- browser;
- input method;
- accessibility/support configuration when relevant;
- moderator interventions with timestamp/task context.

Reviewer State Lab or other researcher tooling must be hidden from participants unless the task explicitly requires it.

## Critical tasks

### T-01 — Plan around upcoming money
Maps to: `F-03`

Scenario: "You have bills and savings coming up over the next couple of weeks. Before spending more today, use Nova to work out what period the planning view is covering and what money it has already accounted for."

Observe:
- first location inspected;
- whether the participant finds the time window without prompting;
- interpretation of known commitments vs protected money;
- incorrect assumptions about future/unknown spending.

### T-02 — Send €145 without using protected money
Maps to: `F-02`

Scenario: "You need to send Maya €145 for utilities. Before confirming, tell me what Nova says will remain safe to spend and what happens to the protected money."

Observe:
- path to transfer;
- arithmetic/result used;
- whether the participant believes the buffer is spent, borrowed, moved or untouched;
- hesitation at impact preview/review;
- moderator intervention.

### T-03 — Recover after confirmation fails
Maps to: `F-04`

Scenario: "Imagine the identity check or final balance check fails just before the transfer completes. Work out what happened to the money and what you would do next."

Use the appropriate failed-confirmation/revalidation state from the frozen build.

Observe:
- whether the participant states that no money moved;
- whether they believe balance changed;
- whether they repeat an irreversible action blindly;
- chosen recovery path;
- what evidence they use to decide.

### T-04 — Error correction safety check
Maps to: `A11Y-ERR`, supports WCAG 3.3.1/3.3.3/3.3.4 review

Scenario: ask the participant to enter an invalid or unaffordable amount, then recover and proceed to review.

Observe:
- whether the error is noticed;
- whether the cause is understood;
- whether correction guidance is sufficient;
- keyboard/focus behavior where applicable;
- review/edit opportunity before the consequential confirmation.

## Success definitions

For each task, classify only from observed behavior:
- `COMPLETED_UNASSISTED`
- `COMPLETED_WITH_RECOVERY`
- `PARTIAL`
- `BLOCKED`
- `CRITICAL_ERROR`

A moderator explanation after failure does not convert the task to unassisted success.

## Evidence capture

After each session:
1. Save an anonymized `sessions/P0X.md` record from `SESSION-TEMPLATE.md`.
2. Separate observations from interpretations.
3. Add atomic evidence only after record integrity review.
4. Map every evidence item to F-02/F-03/F-04/A11Y-ERR.
5. Preserve contradictory evidence.

## Synthesis rule

Do not summarize with a single average score. Synthesis should show:
- repeated observed patterns;
- isolated but high-consequence failures;
- contradictions;
- intervention frequency;
- which finding/decision changes as a result;
- what remains unknown.

## Sources / method baseline

- Nielsen Norman Group — qualitative usability testing and the common ~5-participant starting point: https://www.nngroup.com/articles/how-many-test-users/
- W3C WCAG 2.2 Input Assistance: https://www.w3.org/WAI/WCAG22/Understanding/input-assistance.html
- W3C SC 3.3.4 Error Prevention (Legal, Financial, Data): https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html
- UIUX Factory skills: `user-research-planning-and-recruitment`, `moderated-usability-testing`, `research-evidence-pipeline`, `ux-benchmarking-and-metrics`, `accessibility-conformance-evaluation`.