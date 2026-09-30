# Nova Round 02 — Post-change human retest

**Status:** `5 RESPONSES RECEIVED / VERIFICATION_PENDING`  
**Target:** 3–5 real participants  
**Received method:** asynchronous structured self-report retest  
**Priority tasks:** Task 2 (sensitive-action boundary) and Task 3 (transfer impact)  
**Evidence state:** `RETEST_REQUIRED / VERIFICATION_PENDING`

## Frozen build

Every participant is intended to use the same post-iteration build unless a session record explicitly documents an exception.

- **Commit:** `5c457075510359703a41966aaa3f0a1cecf8ca44`
- **Research URL:** https://ngh1aa.github.io/Nova/app.html?screen=home&lab=1
- **Environment contract:** `lab=1` hides reviewer-only State Lab tooling.
- **Verified before recruitment:** GitHub Pages deployment and Nova Visual QA both passed on the frozen commit.

The supplied response export did not include participant-side build confirmation, so the five records remain verification-pending even though the protocol build is frozen.

## Participant profile

The five received responses meet the captured screener criteria:
- age 18–30;
- digital banking at least weekly;
- can complete a 15–25 minute prototype session;
- simulated data only;
- participation consent and anonymized research-use consent captured.

The export did **not** capture whether each participant is `NEW` or `RETURNING_FROM_ROUND_01`; that must be resolved before verification.

## Evidence method

### Preferred — moderated retest

The moderator reads prompts exactly, does not teach the interface, observes behavior, then asks follow-up questions. Record observation before interpretation.

Evidence class: `DIRECT_USER_MODERATED_RETEST`.

### Received — asynchronous retest

The current five records were supplied as structured participant responses without moderator observation.

Evidence class: `DIRECT_USER_ASYNC_RETEST_SELF_REPORT / VERIFICATION_PENDING`.

Do not pool these records with observed task-success/time metrics.

## Task order

1. **Task 2 — Sensitive action boundary**
2. **Task 3 — Transfer impact**
3. Task 1 — Safe-to-spend horizon
4. Task 4 — Recovery diagnosis

All five supplied responses contain all four task sections.

## Current provisional synthesis

See `PROVISIONAL-SYNTHESIS.md`.

Key verification-pending signals:
- 2/5 understand the intended 14-day Safe-to-spend horizon;
- 2/5 understand the sensitive-action result as demo/preview;
- 2/5 distinguish Freeze from Report;
- 5/5 land around €1,155 after a €145 transfer, but only 1/5 understands that Protected buffer is not automatically consumed;
- 2/5 explicitly understand that no money moved after the failed transfer.

These are self-report signals, not observed task-success metrics.

## Verification gate

Before any record becomes `VERIFIED_RECORD`, capture for each `R02-P0X`:
- participant type: `NEW` or `RETURNING_FROM_ROUND_01`;
- actual test/session date;
- confirmation that the participant used the frozen Round 02 prototype URL/build;
- integrity review with no PII committed.

Names from the source export are intentionally not stored in the repository.

## Improvement-claim gate

Do not claim that Nova improved until verified post-change evidence supports that statement. Preserve unresolved findings, regressions and contradictory results.
