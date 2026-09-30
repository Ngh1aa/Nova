# Nova — Validation Round 01

**Evidence state:** PLANNED / RECRUITING  
**Study type:** Moderated usability test  
**Target:** 5 participants  
**Verified sessions:** 0  
**Prototype:** https://ngh1aa.github.io/Nova/app.html?screen=home&lab=1  
**Pinned baseline commit:** `1bf3a6f786052ab37c74523ef9828a02d4f11f85`  
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

The previous pre-human baseline `487c0d768c9c1aa58c45d10f57cab6c6a126b90c` was retired before any real session existed. The study was repinned after synthetic SD-01/SD-02 iterations while `verified_sessions = 0`, so no direct-user observations are mixed across those builds.

The research URL includes `lab=1`. This intentionally hides the recruiter-only State Lab launcher so a participant never sees or interacts with reviewer tooling during a product task. Removing reviewer tooling does not change the tested banking state or product logic.

Synthetic-user dogfooding lives separately under `research/synthetic/nova-round-01/`. It may trigger prototype fixes before human sessions, but it never increments `verified_sessions` and is never entered into the direct-user evidence ledger.

If a blocking implementation change is unavoidable after Human P01 begins:
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
- whether forecast values are mistaken for guaranteed balance;
- whether the time horizon attached to “safe to spend” is clear without prompting.

### Task 2 — Suspicious transaction and protection
Prompt: “You notice a transaction you do not recognize. Show me what you would do next.”

Observe without teaching the synthetic finding:
- whether the participant finds the transaction detail;
- what evidence they inspect before taking action;
- whether they choose card protection, reporting, or another path and why;
- whether `Freeze card` is understood as a reversible protective action;
- whether `Start report` is interpreted as beginning a process rather than a completed bank submission;
- after entering the report preview, whether they believe a bank case has been created or money/refund handling has started;
- whether recovery/unfreeze remains discoverable if the card is frozen.

Do **not** tell the participant that synthetic dogfood previously found report-scope ambiguity. Let their interpretation emerge naturally.

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

A critical error is an action or interpretation that could cause a materially wrong financial decision in a real product, such as treating committed money as freely spendable, believing a simulated report created a real bank case, or confirming a transfer while misunderstanding its impact.

## Moderator rules

- Use the exact task prompt before probing.
- Ask “What are you looking at?” or “What do you expect to happen?” instead of explaining the UI.
- Do not praise an answer during the task.
- Do not rescue the participant until the defined stop condition is reached.
- Record what happened before interpreting why.
- Do not disclose synthetic findings before or during the affected task.
- AI may help transcribe/summarize anonymized notes, but the raw observation remains the source evidence and the human researcher approves synthesis.

## Stop conditions

End or skip a task if the participant:
- is uncomfortable;
- starts sharing real financial credentials/data;
- cannot continue because of a prototype defect unrelated to the tested decision;
- explicitly asks to stop.

## Synthesis threshold

Do not promote the study to `VERIFIED` until:
1. at least 5 completed anonymized real session records exist;
2. every finding references one or more real session IDs;
3. contradictory observations are retained;
4. findings distinguish observation → interpretation → design implication;
5. no usability percentage is reported from fewer than 5 sessions without showing the raw numerator/denominator;
6. iteration claims are only made after a changed prototype is retested on the same task definition.

## Claim boundary

Before real sessions are complete, the valid portfolio state remains: **“Usability validation is planned/recruiting; AI-assisted synthetic dogfooding informed pre-human prototype iteration.”**
