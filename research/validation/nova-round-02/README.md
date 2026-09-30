# Nova Round 02 — Post-change human retest

**Status:** `RECRUITING / 0 COMPLETED`  
**Target:** 3–5 real participants  
**Preferred method:** moderated remote/in-person usability retest  
**Priority tasks:** Task 2 (sensitive-action boundary) and Task 3 (transfer impact)  
**Evidence state before sessions:** `RETEST_REQUIRED`

## Frozen build

Every participant must use the same post-iteration build unless a session record explicitly documents an exception.

- **Commit:** `5c457075510359703a41966aaa3f0a1cecf8ca44`
- **Research URL:** https://ngh1aa.github.io/Nova/app.html?screen=home&lab=1
- **Environment contract:** `lab=1` hides reviewer-only State Lab tooling.
- **Verified before recruitment:** GitHub Pages deployment and Nova Visual QA both passed on the frozen commit.

Do not silently move participants to a newer build. If the product changes, start a new retest build/version and record it separately.

## Participant profile

Recruit 3–5 people who:
- are 18–30 years old;
- use at least one digital banking app weekly;
- can complete a 15–25 minute prototype session;
- understand that all balances/actions are simulated and no real financial data is needed.

Record whether each person is **NEW** or **RETURNING_FROM_ROUND_01**. Returning participants may have learning bias, so keep that distinction visible.

## Evidence method

### Preferred — moderated retest

The moderator reads the prompts exactly, does not teach the interface, observes behavior, then asks the follow-up questions. Record observation before interpretation.

Evidence class: `DIRECT_USER_MODERATED_RETEST`.

### Fallback — asynchronous retest

If a participant cannot join a moderated session, they may complete the same tasks independently and submit structured self-report. Mark it `DIRECT_USER_ASYNC_RETEST_SELF_REPORT` and **do not pool it with observed task-success/time metrics**.

## Task order

Run the two highest-priority tasks first to reduce fatigue effects:

1. **Task 2 — Sensitive action boundary**
2. **Task 3 — Transfer impact**
3. Task 1 — Safe-to-spend horizon
4. Task 4 — Recovery diagnosis

Use `SESSION-TEMPLATE.md` for exact prompts and fields.

## Completion gate

A participant counts as a completed Round 02 record only when:
- eligibility and consent are recorded;
- participant ID is anonymized (`R02-P01` … `R02-P05`);
- exact build SHA + URL are recorded;
- Task 2 and Task 3 are completed at minimum;
- observation and interpretation are separated for moderated sessions;
- no PII or real banking data is committed;
- the session record is internally consistent and traceable.

## Improvement-claim gate

Round 02 exists to test the iteration, not prove it in advance. Do not claim that Nova improved until the post-change evidence supports that statement. Preserve regressions and contradictory results.
