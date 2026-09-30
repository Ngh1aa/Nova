# Nova Round 02 — Verified post-change retest synthesis

**Evidence class:** `DIRECT_USER_ASYNC_RETEST_SELF_REPORT`  
**Verified records:** `5 / 5`  
**Participant type:** `all NEW`  
**Test date:** `2026-09-30`  
**Frozen build:** `5c457075510359703a41966aaa3f0a1cecf8ca44`  
**Test URL:** `https://ngh1aa.github.io/Nova/app.html?screen=home&lab=1`  
**Atomic evidence:** `evidence-ledger.jsonl`

This synthesis compares Round 02 with the compatible self-report evidence available from Round 01. It does **not** convert async responses into observed task-success metrics. Because Round 02 uses five new participants, cross-round differences are cross-sectional signals, not causal within-subject effects.

## Round 02 results

| Signal | Round 02 |
|---|---:|
| Safe-to-spend answer matches displayed €1,300 | 3/5 |
| Intended 14-day horizon understood | 2/5 |
| Sensitive action understood as demo/preview | 2/5 |
| Freeze distinguished from Report | 2/5 |
| Transfer arithmetic lands around €1,155 | 5/5 |
| Protected buffer correctly understood as not auto-consumed | 1/5 |
| Explicitly understands that no money moved after failure | 2/5 |
| Mean confidence | T1 3.6 · T2 3.6 · T3 3.6 · T4 3.4 |
| Overall ease / clarity | 3.6 / 3.0 |

## F-01 — Sensitive-action demo/real boundary

**Severity:** `P1`  
**Round 02 state:** `IMPROVED_SELF_REPORT_SIGNAL / UNRESOLVED`  
**Evidence:** `E-R02-001`–`E-R02-005`

Round 01 contained a sensitive-action truth-boundary signal in all five records. In Round 02, two of five new participants correctly describe the state as demo/preview and distinguish Freeze from Report, while three still report a real-bank consequence, remain unsure, or conflate the actions.

**Conclusion:** there is a better self-report signal than Round 01, but the problem is not resolved. Do not describe this as observed usability improvement.

**Next design decision:** make `DEMO ONLY / NO BANK CONTACT` part of the primary CTA/result state, not supporting copy. Separate Freeze and Report visually and semantically at the decision point.

## F-02 — Transfer-impact explanation

**Severity:** `P1`  
**Round 02 state:** `PARTIAL_IMPROVEMENT / UNRESOLVED`  
**Evidence:** `E-R02-006`–`E-R02-010`

All five Round 02 participants land around the intended €1,155 result after a €145 transfer. Two report sufficient information; three report only partial information. Only one of five correctly states that the Protected buffer is not automatically consumed.

**Conclusion:** the arithmetic/result relationship is substantially clearer in the Round 02 self-report set, but the Protected-buffer rule remains the dominant failure. F-02 stays open.

**Next design decision:** keep the current before → transfer → fee → after arithmetic. Add an explicit `Protected buffer stays reserved — this transfer does not use it` line at the exact confirm decision surface.

## F-03 — Safe-to-spend horizon

**Severity:** `P2`  
**Round 02 state:** `UNRESOLVED`  
**Evidence:** `E-R02-011`–`E-R02-015`

Only two of five participants identify the intended `next 14 days` horizon. Two interpret the number as applying today and one is unsure. Two also self-discount the displayed €1,300 to about €1,000.

**Conclusion:** attaching the horizon to the number is not strong enough across the sample. Because Round 01 did not capture the same frozen-build/horizon target, do not publish a numeric improvement delta here.

**Next design decision:** promote the horizon into the primary label and explanation, and keep the same horizon language across Home, Money Horizon and transfer review.

## F-04 — Failure cause + no-money-moved state

**Previous severity:** `P2`  
**Round 02 state:** `REGRESSED_SELF_REPORT_SIGNAL`  
**Evidence:** `E-R02-016`–`E-R02-020`

Two of five Round 02 participants explicitly understand that no money moved; three remain unsure. Failure-cause understanding is two `YES`, two `PARTIAL`, one `NO`. Round 01 self-report had four of five participants report that no money moved.

**Conclusion:** the compatible self-report signal for money-movement clarity is worse in Round 02 (`2/5` vs `4/5`). This is a verified cross-sectional regression signal, not evidence that the UI iteration caused the regression.

**Priority decision:** treat this as the highest-consequence next fix. The result screen should make `NO MONEY MOVED` the dominant status, place the concrete authentication failure beside it, and keep retry/passcode actions secondary to the safety state. Re-evaluate severity after the next implementation/retest rather than automatically escalating solely from this small async sample.

## Round-level conclusion

The first iteration did **not** resolve Nova's core comprehension risks. One sub-part clearly moved in the intended direction — transfer arithmetic — while the sensitive-action boundary and horizon remain weak, Protected-buffer behavior remains poorly understood, and recovery money-state clarity shows a negative Round 02 signal.

The defensible portfolio statement is:

> Five new users completed a verified async post-change retest. Transfer arithmetic was understood more consistently, while sensitive-action boundaries, Protected-buffer behavior and the 14-day horizon remained unresolved; recovery money-state clarity produced a regression signal that triggered another iteration.

Do not replace this with a broad claim that “usability improved.”
