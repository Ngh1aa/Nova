# Nova Round 02 — Provisional synthesis

**Evidence state:** `5 ASYNC SELF-REPORT RESPONSES RECEIVED / VERIFICATION_PENDING`  
**Verified records:** `0`  
**Improvement claim:** `NOT ALLOWED`  
**Reason:** participant type, session date and participant-side frozen-build confirmation were not captured in the supplied response export.

This synthesis uses five anonymized structured responses (`R02-P01`…`R02-P05`). It describes **self-report comprehension signals**, not observed task success. Names supplied in the source export are intentionally not committed.

## Current Round 02 signals

| Signal | Result | Interpretation |
|---|---:|---|
| Safe-to-spend answer matches displayed €1,300 | 3/5 | Two participants self-adjusted downward to ~€1,000 |
| Intended 14-day horizon understood | 2/5 | F-03 remains unresolved |
| Sensitive action correctly understood as demo/preview | 2/5 | F-01 remains unresolved |
| Freeze distinguished from Report | 2/5 | F-01 remains unresolved |
| Transfer Safe-to-spend arithmetic lands around €1,155 | 5/5 | Arithmetic is much clearer than the buffer rule |
| Protected buffer correctly understood as not automatically consumed | 1/5 | F-02 remains unresolved despite arithmetic comprehension |
| Explicitly believes money did not move after failure | 2/5 | F-04 shows a candidate regression signal |
| Mean confidence | T1 3.6 · T2 3.6 · T3 3.6 · T4 3.4 | Moderate confidence does not guarantee correct interpretation |
| Overall ease / clarity | 3.6 / 3.0 | Clarity trails ease |

## Finding-by-finding retest read

### F-01 — Sensitive-action demo/real boundary — `P1 / STILL OPEN`

Only 2/5 responses correctly describe the post-action state as demo/preview, and only 2/5 clearly distinguish Freeze from Report. Three responses still report or imply a real-bank consequence, uncertainty, or action conflation.

**Provisional read:** the iteration has not resolved the truth-boundary problem strongly enough. Do not claim improvement.

### F-02 — Transfer-impact explanation — `P1 / STILL OPEN`

All five responses land around the intended €1,155 after a €145 transfer, which is a positive arithmetic-comprehension signal. However only 1/5 correctly states that Protected buffer is not automatically consumed; the others answer `YES` or `UNSURE`. Information sufficiency is `YES` for 2/5 and `PARTIAL` for 3/5.

**Provisional read:** the before/after arithmetic is clearer, but the protected-buffer rule remains the dominant comprehension failure. Overall F-02 is not resolved.

### F-03 — Safe-to-spend horizon — `P2 / STILL OPEN`

Only 2/5 identify the intended 14-day horizon. Two answer `today` and one is unsure. Two participants also self-discount the displayed €1,300 to approximately €1,000.

**Provisional read:** attaching the horizon to the number helped some participants but is not strong enough across the sample.

### F-04 — Failure cause + no-money-moved state — `P2 / REGRESSION CANDIDATE`

Only 2/5 explicitly report that money did not move; three are unsure. Failure-cause understanding is mixed: two understand it, two partially understand it, and one does not.

Round 01 self-report had a stronger no-money-moved signal (4/5 reported that money had not moved). Because Round 02 verification is incomplete, treat this as a **candidate regression**, not a confirmed regression or severity escalation.

## Decision implications before any new product change

1. **Do not change F-01/F-02 severity yet.** Verify Round 02 records first.
2. If verified, F-01 likely needs another iteration that makes `DEMO ONLY / NO BANK CONTACT` part of the primary action/result surface rather than supporting copy.
3. If verified, F-02 should keep the arithmetic but make the Protected buffer consequence explicit at the exact confirm decision point.
4. If verified, F-03 needs a stronger time-anchor treatment than a secondary label alone.
5. If the F-04 regression survives verification, review the failure-state hierarchy and consider a P1 severity re-evaluation because uncertainty about whether money moved is a high-consequence state.

## Verification blockers to clear

For each `R02-P0X`, capture:
- `NEW` vs `RETURNING_FROM_ROUND_01`;
- actual test/session date;
- confirmation that the participant used the Round 02 frozen prototype URL/build.

Only after those fields are resolved should the records move to `VERIFIED_RECORD`, receive atomic evidence IDs, and drive an official before/after conclusion.
