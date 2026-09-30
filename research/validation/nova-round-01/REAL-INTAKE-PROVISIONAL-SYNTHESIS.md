# Nova Round 01 — Provisional synthesis of five real participant intakes

**Evidence class:** `REAL_PARTICIPANT_SELF_REPORT / VERIFICATION_PENDING`  
**Real intake count:** 5  
**Verified sessions:** 0  
**Official finding state:** not promoted

> This synthesis clusters supplied real-participant form responses only. It is not a substitute for moderated-session observation and must not be copied into `FINDINGS.md` as a verified usability pattern until session integrity is complete.

## ID mapping

The first real participant intake was already assigned `P01`. A later supplied batch reused labels P01–P04, so those four were remapped in arrival order to preserve the existing study IDs:

- P01 — earlier real participant intake, age band 22–25
- P02 — supplied batch label P01, student, age band 18–21
- P03 — supplied batch label P02, office worker, age band 26–30
- P04 — supplied batch label P03, freelancer, age band 22–25
- P05 — supplied batch label P04, sales employee, age band 26–30

No identity mapping beyond these anonymous study IDs belongs in the repository.

## Candidate pattern A — sensitive-action truth boundary

**Repeated self-report signal:** all 5/5 intakes contain uncertainty, a mistaken expectation, or an explicit request for clearer distinction between preview/demo and a real banking action.

Examples of the supplied signal:
- P01 asks for clearer distinction between preview/demo and real action.
- P02 says report flow is the most confusing area and wants demo/preview labeled.
- P03 reports that a bank report/case had been created after the preview flow, which conflicts with the intended prototype boundary.
- P04 is unsure whether report is actually sent and whether Freeze/Report are separate in effect.
- P05 says trust depends on knowing which actions are demo versus real.

**Candidate severity:** P1  
**Decision affected:** D-02  
**Do not claim yet:** task failure rate, validated pattern, improvement.

## Candidate pattern B — transfer-impact explanation is not sufficient for everyone

Participant self-report on whether enough information was available before confirmation:
- P01: `Một phần`
- P02: `Một phần`
- P03: `Một phần`
- P04: `Không`
- P05: `Có`

So 4/5 real intakes report less than full information sufficiency. This is a self-report count, not an observed task-success metric.

Common uncertainty includes:
- fee effect;
- protected-buffer interaction;
- whether the displayed projected Safe to spend fully explains the consequence.

**Candidate severity:** P1  
**Decision affected:** D-03

## Candidate pattern C — Safe-to-spend meaning is fairly consistent; time horizon is not

Across all five intakes, the concept is generally described as money that can be spent after protecting obligations/buffer. However, the selected time horizon varies:
- P01: Nova forecast window
- P02: end of week
- P03: next payday
- P04: end of week
- P05: next payday

That is three distinct horizon interpretations across five respondents. Without exact tested build/currency metadata, the numeric amount answers must not be scored against the current baseline.

**Candidate severity:** P2, potentially P1 if moderator observation later shows decisions are materially affected  
**Decision affected:** D-01

## Candidate pattern D — recovery preserves money-movement safety better than failure diagnosis

Understanding of why the transfer failed:
- P01: partial
- P02: partial
- P03: yes
- P04: no
- P05: yes

Belief that money had already moved:
- P01: no
- P02: no
- P03: no
- P04: unsure
- P05: no

The supplied self-report therefore suggests the current recovery state more consistently communicates **no money movement** than it communicates **why authentication/transfer failed**.

**Candidate severity:** P2 for cause clarity; preserve explicit no-money-moved messaging  
**Decision affected:** D-04

## Verification blockers shared across the intake set

Before any participant can become `VERIFIED_RECORD`, resolve or explicitly mark unavailable:
- session date;
- remote / in-person mode;
- exact prototype commit actually tested;
- moderator assistance per task;
- observable behavior separate from self-report;
- approximate time per task if captured;
- whether supplied response text is verbatim or paraphrased.

Until then:
- `verified_sessions = 0`;
- `evidence-ledger.jsonl` remains unpromoted;
- `FINDINGS.md` remains unchanged;
- prototype changes may be described as responses to provisional real-intake signals, but not as human-validated improvements.
