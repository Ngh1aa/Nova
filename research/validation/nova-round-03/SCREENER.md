# Nova Round 03 — Participant screener

## Study status
`PLANNED_VALIDATION`

Use this screener to recruit likely Nova users without revealing the expected answers.

## Intro

We are testing a portfolio prototype for a personal-banking and money-planning experience. The study uses simulated data only. Participants will complete a few tasks while a moderator observes how the prototype communicates upcoming money, transfers and recovery states.

Approximate session: 25–35 minutes.

## Questions

### S1 — Age range
Which range are you in?
- Under 18 → exclude
- 18–24 → eligible
- 25–30 → eligible
- 31+ → exclude for this round only, to preserve continuity with prior Nova research

### S2 — Digital banking frequency
How often do you use a mobile or web banking app?
- Daily / several times a week → eligible
- About weekly → eligible
- Less than weekly → exclude
- Never → exclude

### S3 — Transfer experience
In the last 6 months, have you sent money to another person or bank account using a banking app?
- Yes → eligible
- No → exclude

### S4 — Money-planning behavior
Which of these do you normally do in a banking app? Select all that apply.
- Check current/available balance
- Check upcoming bills or scheduled payments
- Move money to savings
- Review recent transactions
- Send money / transfer
- None of these

Eligible: at least two of the first five, including either checking upcoming payments/savings or sending money.

### S5 — Prototype comfort
Are you comfortable completing tasks using entirely simulated balances, recipients and transactions, without sharing any real banking information?
- Yes → eligible
- No → exclude

### S6 — Project conflict
Have you directly designed, coded, reviewed or tested the Nova prototype or `Ngh1aa/uiux-ai-workspace` project?
- Yes → exclude
- No → eligible

### S7 — Accessibility/support setup
Is there anything you normally use or need when interacting with digital products that would help us set up the session? Examples: keyboard-only navigation, screen reader, zoom, larger text, captions, extra reading time.

Open response. This does not affect eligibility unless the requested setup cannot be provided safely; if blocked, record the limitation rather than silently excluding the participant.

### S8 — Recording consent pre-check
The moderator may need to record the screen and/or audio for research notes. Are you willing to review a consent statement before the session and choose whether to participate under the stated recording setup?
- Yes → eligible to schedule
- No → discuss a non-recorded note-taking alternative; do not pressure participation

## Recruitment mix

Aim for five participants with some variation in:
- banking confidence;
- transfer frequency;
- device familiarity;
- planning habits.

Do not quota on demographic attributes that do not affect the research decision.

## Data handling

Public repo stores only anonymized participant IDs and research observations. Do not commit:
- names;
- email/phone;
- real bank/provider identity unless analytically necessary and anonymized;
- real balances;
- account/card numbers;
- private transaction details;
- payment/incentive information.