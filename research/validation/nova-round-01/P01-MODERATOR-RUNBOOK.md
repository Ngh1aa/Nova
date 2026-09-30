# Nova Round 01 — Human P01 Moderator Runbook

**Operational status:** READY / WAITING FOR A REAL ELIGIBLE PARTICIPANT  
**Evidence state:** PLANNED_VALIDATION  
**Verified sessions:** 0 / 5  
**Pinned implementation commit:** `1bf3a6f786052ab37c74523ef9828a02d4f11f85`  
**Prototype:** https://ngh1aa.github.io/Nova/app.html?screen=home&lab=1

> This file is operational preparation only. It is **not** a P01 evidence record and must never be cited as DIRECT_USER evidence.

## 0 — Before assigning P01

Assign P01 only after one real person:
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
- [ ] URL includes `lab=1` so reviewer State Lab tooling is hidden.
- [ ] Exact tested commit recorded as `1bf3a6f786052ab37c74523ef9828a02d4f11f85` unless a blocking defect forced a separately documented replacement build.
- [ ] Participant reminded not to reveal real financial data.
- [ ] Moderator has a local copy of `SESSION-TEMPLATE.md` ready.

## 2 — Consent

Read the Vietnamese or English consent script from `SCREENER-AND-CONSENT.md` verbatim.

Proceed only when both are `yes`:
- consent to continue;
- consent to anonymized research-note use.

If either required consent is not granted, stop. Do not create `sessions/P01.md` as portfolio evidence.

## 3 — Moderator behavior

During every task:
- read the task prompt first without explaining the UI;
- ask neutral probes such as “Bạn đang nhìn vào đâu?” / “Bạn nghĩ điều gì sẽ xảy ra tiếp theo?”;
- do not praise a choice while the task is in progress;
- do not teach the meaning of Money Horizon before Task 1;
- do not reveal synthetic-dogfood findings before or during an affected task;
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
- forecast mistaken for guaranteed/current money;
- what time period the participant believes “Safe to spend” covers.

Do not mention the synthetic SD-03 time-horizon candidate during the task.

## 5 — Task 2: Suspicious transaction and protection

Prompt:

> “You notice a transaction you do not recognize. Show me what you would do next.”

Watch for:
- transaction-detail discoverability;
- evidence inspected before action;
- whether the participant chooses `Freeze card`, `Start report`, or another path without prompting;
- the participant’s expectation before clicking their chosen action;
- whether freeze is understood as reversible protection rather than reversal of an already-authorized payment;
- if `Start report` is chosen, whether they think merely entering the preview has submitted anything;
- whether `Nothing has been reported`, `No bank case created`, and the refund boundary are understood without moderator explanation;
- whether card protection and reporting are understood as separate decisions;
- unfreeze/recovery discoverability when relevant.

**Neutral probes only:**
- “What do you expect this action to do?”
- “What do you think has happened at this point?”
- “Has anything been submitted yet, in your view?”

Do not tell the participant that AI/synthetic dogfood previously found ambiguity in this path.

## 6 — Task 3: Transfer with impact review

Prompt:

> “Send money to a saved recipient. Before confirming, tell me what you think will happen to your available money.”

Watch for:
- review-state comprehension;
- transfer-impact comprehension;
- whether the projected Safe to spend is interpreted correctly;
- confidence before simulated authentication;
- premature confirmation.

## 7 — Task 4: Recover from a failure

Prompt:

> “The transfer cannot complete. Recover in the way that makes the most sense to you.”

Watch for:
- diagnosis of the failure;
- correction/retry behavior;
- whether `No transfer has been made` is noticed and understood;
- whether fallback states are understandable without moderator explanation.

## 8 — Debrief

Ask:
1. What felt clearest?
2. What felt uncertain?
3. In your own words, what did “Money Horizon” mean?
4. What would you need before trusting this feature in a real banking app?
5. If you used the suspicious-transaction flow: what did you think Nova had actually done versus only previewed?

## 9 — Evidence ingestion after the call

Only after the real session is complete:
1. copy `SESSION-TEMPLATE.md` to `sessions/P01.md`;
2. remove all PII and real financial information;
3. record the exact prototype commit tested;
4. preserve raw observations separately from moderator interpretations;
5. append one atomic ledger record per observation to `evidence-ledger.jsonl`;
6. update `PARTICIPANT-TRACKER.md` from `SCHEDULED` → `COMPLETED` → `VERIFIED_RECORD` only when the record passes integrity checks;
7. keep `verified_sessions = 0` until the committed P01 artifact qualifies as `VERIFIED_RECORD`;
8. derive severity/design implications only from traceable real observations;
9. compare real P01 against synthetic candidates only after the real observations have been written independently.

## 10 — Iteration gate

Do **not** redesign Nova merely because the moderator has a preference or because synthetic users previously preferred something.

A post-P01 product change should reference:
- real observation/evidence ID;
- affected task;
- severity/risk;
- proposed change;
- expected behavior;
- retest requirement.

If P01 contradicts a synthetic finding, preserve the contradiction. Do not rewrite the human observation to fit the synthetic narrative.

Any claimed improvement requires the affected task to be repeated after the change.
