# Nova Round 02 — Post-change human retest

**Status:** `5 VERIFIED ASYNC RETEST RECORDS`  
**Target:** 3–5 real participants  
**Executed method:** asynchronous structured self-report retest  
**Priority tasks:** Task 2 (sensitive-action boundary) and Task 3 (transfer impact)  
**Evidence state:** `DIRECT_USER_ASYNC_RETEST_SELF_REPORT / SYNTHESIZED`

## Frozen build

All five participants used the same post-iteration build.

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

Moderated testing remains the stronger future method when observed behavior/time-on-task is needed.

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

## Current synthesis

Use `RETEST-SYNTHESIS.md` and `evidence-ledger.jsonl` as the current source of truth.

Round 02 signals:
- 3/5 report the displayed Safe-to-spend amount of €1,300;
- 2/5 identify the intended 14-day horizon;
- 2/5 understand the sensitive-action state as demo/preview;
- 2/5 distinguish Freeze from Report;
- 5/5 land around €1,155 after a €145 transfer;
- only 1/5 understands that Protected buffer is not automatically consumed;
- 2/5 explicitly understand that no money moved after failed transfer.

## Finding status

- `F-01 / P1` — improved self-report signal, still unresolved.
- `F-02 / P1` — arithmetic clearer, Protected-buffer rule unresolved.
- `F-03 / P2` — unresolved.
- `F-04 / P2` — verified cross-sectional regression signal for no-money-moved clarity; do not claim causality.

## Evidence boundary

Round 01 and Round 02 use different participants. Cross-round differences are therefore **cross-sectional self-report signals**, not within-subject causal effects.

Do not claim:
- five moderated sessions;
- observed task-success improvement;
- that the UI iteration caused any improvement or regression;
- overall validated usability improvement.

The next valid step is a second evidence-driven product iteration followed by another retest of the affected tasks.
