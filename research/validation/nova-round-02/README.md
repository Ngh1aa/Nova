# Nova Round 02 — Post-change human retest

**Status:** `5 VERIFIED ASYNC RETEST RECORDS · POST-ROUND-02 ITERATION IMPLEMENTED / NOT HUMAN-RETESTED`  
**Target:** 3–5 real participants  
**Executed method:** asynchronous structured self-report retest  
**Priority tasks:** Task 2 (sensitive-action boundary) and Task 3 (transfer impact)  
**Evidence state:** `DIRECT_USER_ASYNC_RETEST_SELF_REPORT / VERIFIED · LATEST ITERATION OPEN`

## Frozen build

All five Round 02 participants used the same post-Round-01 iteration build.

- **Commit:** `5c457075510359703a41966aaa3f0a1cecf8ca44`
- **Research URL:** https://ngh1aa.github.io/Nova/app.html?screen=home&lab=1
- **Environment contract:** `lab=1` hides reviewer-only State Lab tooling.
- **Verified before recruitment:** GitHub Pages deployment and Nova Visual QA both passed on the frozen commit.
- **Execution confirmation:** researcher confirmed all five Round 02 participants used this URL.

## Participant profile

All five records:
- are `NEW` participants, not returning from Round 01;
- were tested on `2026-09-30`;
- are age 18–30;
- use digital banking at least weekly;
- completed the test with simulated data only;
- include participation consent and anonymized research-use consent.

No participant names or other PII are stored in the repository.

## Evidence method

### Preferred — moderated retest

Moderated testing remains the stronger future method when observed behavior, assistance, errors or time-on-task are needed.

### Executed — asynchronous retest

The five Round 02 records are structured participant responses without moderator observation.

Evidence class: `DIRECT_USER_ASYNC_RETEST_SELF_REPORT / VERIFIED_RECORD`.

They may support self-report comprehension comparison, but must not be reported as observed task-success/time metrics.

## Task order

1. **Task 2 — Sensitive action boundary**
2. **Task 3 — Transfer impact**
3. Task 1 — Safe-to-spend horizon
4. Task 4 — Recovery diagnosis

All five verified records contain all four task sections.

## Round 02 synthesis

Use `RETEST-SYNTHESIS.md` and `evidence-ledger.jsonl` as the source of truth for what participants actually reported in Round 02.

Verified Round 02 signals:
- 3/5 report the displayed Safe-to-spend amount of €1,300;
- 2/5 identify the intended 14-day horizon;
- 2/5 understand the sensitive-action state as demo/preview;
- 2/5 distinguish Freeze from Report;
- 5/5 land around €1,155 after a €145 transfer;
- only 1/5 understands that Protected buffer is not automatically consumed;
- 2/5 explicitly understand that no money moved after failed transfer.

## Finding state from Round 02

- `F-01 / P1` — improved self-report signal, still unresolved.
- `F-02 / P1` — arithmetic clearer, Protected-buffer rule unresolved.
- `F-03 / P2` — unresolved.
- `F-04 / P2` — verified cross-sectional regression signal for no-money-moved clarity; do not claim causality.

## What happened after Round 02

A second evidence-informed implementation pass is now complete:

- **D-01:** explicit `next 14 days` language promoted across primary Safe-to-spend / Money Horizon / transfer surfaces.
- **D-02:** Freeze and Report separated more strongly; `DEMO ONLY · NO BANK CONTACT` moved into primary decision/result surfaces.
- **D-03:** explicit Protected-buffer rule added to transfer decision points while preserving the successful arithmetic explanation.
- **D-04:** failure states foreground `NO MONEY MOVED`, concrete cause and unchanged balance.

Implementation status for all four: `ITERATED / NOT HUMAN-RETESTED`.

The planned moderated Round 03 was explicitly skipped by the user and contributes `0` moderated sessions / no evidence.

See `DECISION-LOG.md` for the post-Round-02 implementation record and claim boundary.

## Evidence boundary

Round 01 and Round 02 use different participants. Cross-round differences are therefore **cross-sectional self-report signals**, not within-subject causal effects.

Do not claim:
- five moderated sessions;
- observed task-success improvement;
- that the UI iteration caused any improvement or regression;
- that D-01/D-02/D-03/D-04 are validated fixes;
- overall validated usability improvement;
- conversion, retention, adoption or business impact.

## Next valid transition

If human research resumes, freeze the **latest** implementation build and retest D-01 through D-04. Prefer moderated observation if the portfolio needs observed task-success, assistance, error or time-on-task evidence.

If no additional human round is run, keep the findings open and present the latest changes only as **evidence-informed iterations**, not validated improvements.
