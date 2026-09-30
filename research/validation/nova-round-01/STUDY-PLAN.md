# Nova — Validation Round 01

**Evidence state:** PLANNED / RECRUITING  
**Study type:** Moderated usability test  
**Target:** 5 participants  
**Prototype:** https://ngh1aa.github.io/Nova/app.html?screen=home  
**Pinned baseline commit:** `487c0d768c9c1aa58c45d10f57cab6c6a126b90c`  
**Baseline evidence:** `BASELINE-BUILD.md`

## Research question

Can people correctly interpret **Money Horizon** and decide what is safe to spend without confusing forecasted or committed money with immediately spendable funds?

## Participant profile

Recruit people who:
- are 18–30;
- use at least one digital banking app weekly;
- manage recurring payments, subscriptions or regular transfers;
- can complete a 25–35 minute remote or in-person session.

Do **not** ask participants to reveal real balances, account numbers, credentials, transaction history or other sensitive financial data. Nova uses simulated data only.

## Baseline discipline

Use the pinned baseline commit above for P01–P05 unless a prototype defect makes a task impossible. Every session record must repeat the exact prototype commit actually tested.

If a blocking implementation change is unavoidable during the round:
- record the replacement commit in the affected session;
- document the reason in `DECISION-LOG.md`;
- do not pool old/new-build observations as though all participants saw the same product state;
- retest an affected design change on the same task before claiming improvement.

## Tasks

### Task 1 — Safe to spend before Friday
Prompt: “Imagine this is your account. Before Friday, how much money would you personally feel safe spending? Show me where you got that answer and explain what changed it.”

Observe:
- whether Money Horizon is noticed;
- whether upcoming commitments are included in the answer;
- whether the protected buffer is understood;
- whether forecast values are mistaken for guaranteed balance.

### Task 2 — Suspicious transaction and protection
Prompt: “You notice a transaction you do not recognize. Show me what you would do next.”

Observe:
- whether the participant finds the transaction detail;
- what evidence they inspect before freezing;
- whether the consequence of freeze is understood;
- whether recovery/unfreeze is discoverable.

### Task 3 — Transfer with impact review
Prompt: “Send money to a saved recipient. Before confirming, tell me what you think will happen to your available money.”

Observe:
- review-state comprehension;
- transfer-impact comprehension;
- confidence before simulated authentication;
- any premature confirmation behavior.

### Task 4 — Recover from a failure
Prompt: “The transfer cannot complete. Recover in the way that makes the most sense to you.”

Observe:
- diagnosis of the failure;
- correction/retry behavior;
- whether fallback states are understandable without moderator explanation.

## Measures

For each task record:
- **task outcome:** success / partial / failure;
- **critical error:** yes / no;
- **interpretation accuracy:** correct / mixed / incorrect;
- **time on task:** approximate seconds;
- **confidence:** 1–5 after task;
- **moderator assistance:** none / light / direct;
- **observable evidence:** quote or behavior, not inferred motive.

A critical error is an action or interpretation that could cause a materially wrong financial decision in a real product, such as treating committed money as freely spendable or confirming a transfer while misunderstanding its impact.

## Moderator rules

- Use the exact task prompt before probing.
- Ask “What are you looking at?” or “What do you expect to happen?” instead of explaining the UI.
- Do not praise an answer during the task.
- Do not rescue the participant until the defined stop condition is reached.
- Record what happened before interpreting why.
- AI may help transcribe/summarize anonymized notes, but the raw observation remains the source evidence and the human researcher approves synthesis.

## Stop conditions

End or skip a task if the participant:
- is uncomfortable;
- starts sharing real financial credentials/data;
- cannot continue because of a prototype defect unrelated to the tested decision;
- explicitly asks to stop.

## Synthesis threshold

Do not promote the study to `VERIFIED` until:
1. at least 5 completed anonymized session records exist;
2. every finding references one or more session IDs;
3. contradictory observations are retained;
4. findings distinguish observation → interpretation → design implication;
5. no usability percentage is reported from fewer than 5 sessions without showing the raw numerator/denominator;
6. iteration claims are only made after a changed prototype is retested on the same task definition.

## Claim boundary

Before sessions are complete, the only valid portfolio statement is: **“Usability validation is planned/recruiting.”**
