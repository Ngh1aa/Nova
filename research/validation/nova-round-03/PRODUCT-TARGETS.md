# Nova Phase 3 — Product targets

## Status
`TARGETS_ONLY / NO_OUTCOME_CLAIM`

These are **round-specific qualitative decision thresholds**, not business KPIs and not population estimates. With ~5 moderated participants, counts such as `4/5` are used only as pragmatic design-decision gates for this study.

Do not rewrite them as conversion, adoption, retention, satisfaction, or statistically representative usability rates.

## Target set

| Metric | Operational definition | Phase 3 target | Guardrail / failure trigger |
|---|---|---:|---|
| Protected Buffer comprehension | Participant independently explains that the €500 buffer remains reserved and is not automatically consumed by the €145 transfer. | `TARGET: >=4/5` | Any confident belief that Nova automatically spends/borrows the buffer is a high-priority misunderstanding. |
| 14-day horizon comprehension | Participant independently identifies the planning period as the next 14 days and can name at least one included commitment category. | `TARGET: >=4/5` | Repeated interpretation as a monthly budget/current balance only keeps F-03 open. |
| Transfer-impact task completion | Participant reaches review, states the post-transfer safe-to-spend value/meaning correctly, and explains the buffer consequence without moderator instruction. | `TARGET: >=4/5 unassisted or self-recovered` | Moderator instruction that reveals the rule does not count as unassisted completion. |
| Recovery accuracy | After failed confirmation/revalidation, participant states that no money moved and balance did not change, then chooses a safe next step. | `TARGET: >=4/5` | `TARGET: 0/5` critical false-belief cases where participant thinks money moved and acts on that belief. |
| Critical error rate | A consequential misunderstanding that could cause duplicate/repeated financial action, incorrect buffer use, or unsafe retry. | `TARGET: <=1/5 per finding` | Any repeated pattern across participants triggers redesign/retest even if the aggregate target is numerically met. |
| Error identification | Participant notices an invalid/unaffordable amount error and can state what is wrong. | `TARGET: >=4/5` | If error is only discovered after moderator prompt, accessibility/content review remains open. |
| Error recovery | Participant corrects invalid amount and proceeds without being told what control/value to use. | `TARGET: >=4/5` | Repeated focus/announcement/correction friction becomes an accessibility remediation item. |
| Review-before-confirm comprehension | Participant recognizes that recipient, amount, fee/impact and edit opportunity can be reviewed before final confirmation. | `TARGET: >=4/5` | If participant believes confirmation is immediate/irreversible before review, financial-action safety remains open. |

## Definitions

### Task completion
Use one of:
- `COMPLETED_UNASSISTED`
- `COMPLETED_WITH_RECOVERY`
- `PARTIAL`
- `BLOCKED`
- `CRITICAL_ERROR`

Do not average these into a misleading score.

### Comprehension
A participant must explain the concept in their own words. Merely reading a label aloud does not count.

### Recovery accuracy
Requires all three:
1. consequence diagnosis is correct;
2. participant knows whether money/balance changed;
3. next action is safe and reasoned.

### Error rate
For this small qualitative round, count observed critical errors per participant/task. Do not extrapolate the count to the wider user population.

## Decision rules after Round 03

- **Meets target + no severe contradiction:** finding may move toward `RETESTED_FOR_ROUND_03_SCOPE`, subject to evidence review.
- **Numerically meets target but one severe financial-risk failure exists:** keep finding open and repair the severe failure.
- **Misses target:** keep finding open; identify root cause and iterate.
- **Mixed/contradictory evidence:** report the contradiction; do not force a pass/fail summary.
- **No direct-user evidence:** remains `TARGETS_ONLY / UNKNOWN`.

## Business/outcome boundary

Nova is a portfolio prototype. Until production analytics or compatible real-world evidence exists, the following remain `UNKNOWN`:
- conversion;
- retention;
- adoption;
- fraud loss reduction;
- support-contact reduction;
- real transfer completion rate;
- business ROI.

The recruiter story should show measurement discipline, not invented impact.