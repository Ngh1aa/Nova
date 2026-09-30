# Nova Round 01 — P01 Moderator Runbook

**Operational status:** READY / WAITING FOR A REAL ELIGIBLE PARTICIPANT  
**Evidence state:** PLANNED_VALIDATION  
**Verified sessions:** 0 / 5  
**Pinned implementation commit:** `487c0d768c9c1aa58c45d10f57cab6c6a126b90c`  
**Prototype:** https://ngh1aa.github.io/Nova/app.html?screen=home

> This file is operational preparation only. It is **not** a P01 evidence record and must never be cited as direct-user evidence.

## 0 — Before assigning P01

P01 may be assigned only after one real person:
- is 18–30;
- uses a digital banking app at least weekly;
- manages recurring payments/subscriptions or makes regular transfers;
- can complete a 25–35 minute moderated session using simulated data only;
- was not involved in designing Nova;
- passes the private screener in `SCREENER-AND-CONSENT.md`.

Do not store the participant’s name, email, phone, social handle, employer/student ID, bank, or other PII in GitHub.

## 1 — Pre-session checklist

- [ ] Candidate screened privately.
- [ ] Eligibility confirmed.
- [ ] Session time agreed outside the repository.
- [ ] Prototype opens successfully on the participant’s device.
- [ ] Exact prototype commit recorded as `487c0d768c9c1aa58c45d10f57cab6c6a126b90c` unless a blocking defect forced a documented replacement build.
- [ ] Participant reminded not to reveal real financial data.
- [ ] Moderator has a local copy of `SESSION-TEMPLATE.md` ready.

## 2 — Consent

Read the Vietnamese or English consent script from `SCREENER-AND-CONSENT.md` verbatim.

Proceed only when both are `yes`:
- consent to continue;
- consent to anonymized research-note use.

If consent is not granted, stop. Do not create `sessions/P01.md` as portfolio evidence.

## 3 — Moderator behavior

During every task:
- read the task prompt first without explaining the UI;
- ask neutral probes such as “Bạn đang nhìn vào đâu?” / “Bạn nghĩ điều gì sẽ xảy ra tiếp theo?”;
- do not praise a choice while the task is in progress;
- do not teach the meaning of Money Horizon before Task 1;
- record behavior before interpretation;
- record moderator help as `none / light / direct`;
- preserve mistakes, hesitation and contradictions.

## 4 — Task 1: Safe to spend before Friday

Prompt:

> “Imagine this is your account. Before Friday, how much money would you personally feel safe spending? Show me where you got that answer and explain what changed it.”

Record locally:
- outcome: success / partial / failure;
- critical error: yes / no;
- interpretation accuracy: correct / mixed / incorrect;
- approximate time;
- confidence 1–5;
- assistance;
- observable behavior;
- verbatim quote(s) or explicitly marked paraphrases.

Watch for:
- Money Horizon discoverability;
- upcoming commitments included/excluded;
- protected buffer understanding;
- forecast mistaken for guaranteed/current money.

## 5 — Task 2: Suspicious transaction and protection

Prompt:

> “You notice a transaction you do not recognize. Show me what you would do next.”

Watch for:
- transaction-detail discoverability;
- what evidence is inspected before freeze;
- understanding of freeze consequences;
- ability to find unfreeze/recovery.

## 6 — Task 3: Transfer with impact review

Prompt:

> “Send money to a saved recipient. Before confirming, tell me what you think will happen to your available money.”

Watch for:
- review-state comprehension;
- transfer-impact comprehension;
- confidence before simulated authentication;
- premature confirmation.

## 7 — Task 4: Recover from a failure

Prompt:

> “The transfer cannot complete. Recover in the way that makes the most sense to you.”

Watch for:
- diagnosis of the failure;
- correction/retry behavior;
- whether fallback states are understandable without moderator explanation.

## 8 — Debrief

Ask:
1. What felt clearest?
2. What felt uncertain?
3. In your own words, what did “Money Horizon” mean?
4. What would you need before trusting this feature in a real banking app?

## 9 — Evidence ingestion after the call

Only after the real session is complete:
1. copy `SESSION-TEMPLATE.md` to `sessions/P01.md`;
2. remove all PII and real financial information;
3. record the exact prototype commit tested;
4. preserve raw observations separately from moderator interpretations;
5. append one atomic ledger record per observation to `evidence-ledger.jsonl`;
6. update `PARTICIPANT-TRACKER.md` from `SCHEDULED` → `COMPLETED` → `VERIFIED_RECORD` only when the record passes integrity checks;
7. keep `verified_sessions = 0` until the committed P01 artifact qualifies as `VERIFIED_RECORD`;
8. derive severity/design implications only from traceable observations.

## 10 — Iteration gate

Do **not** redesign Nova merely because the moderator has a preference.

A product change should reference:
- observation/evidence ID;
- affected task;
- severity/risk;
- proposed change;
- expected behavior;
- retest requirement.

Any claimed improvement requires the affected task to be repeated after the change.