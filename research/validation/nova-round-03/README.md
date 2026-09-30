# Nova Round 03 — Moderated usability validation

**Status:** `PLANNED_VALIDATION / BLOCKED_USER_EVIDENCE`  
**Method:** moderated qualitative usability testing  
**Target:** 5 real participants in the primary audience  
**Priority findings:** `F-02 Protected Buffer`, `F-03 14-day horizon`, `F-04 no-money-moved recovery`  
**Evidence rule:** no participant count, task-success result, quote, percentage, or recruiter claim may be created until a traceable moderated session exists.

## Why this round exists

Round 02 produced five verified asynchronous self-report records. It did **not** observe behavior. Round 03 is intentionally different: the moderator watches what participants do, where they hesitate, whether they recover, and whether they can explain consequential financial states without being taught the interface.

This round follows the `Ngh1aa/uiux-ai-workspace` evidence contract:

`decision → realistic task → observed behavior → atomic evidence → finding → product decision → retest / still open`

The research package is operational, but a completed package is not evidence that sessions happened.

## Research questions

1. **F-02 / Protected Buffer** — Can participants independently explain that the €500 Protected Buffer is excluded from Safe to Spend and is not automatically consumed by a €145 transfer?
2. **F-03 / 14-day horizon** — Can participants identify the forecast window as the next 14 days and explain what is included in that planning view?
3. **F-04 / recovery** — After a failed confirmation/revalidation state, can participants correctly state whether money moved, whether their balance changed, and what the safest next action is?
4. **Input-assistance / financial action safety** — Do error identification, correction guidance, review, confirmation, and recovery remain understandable when the task is performed under realistic pressure?

## Build gate

Do not start recruitment until the exact research build is frozen and QA-verified.

Round 03 must record:
- exact commit SHA;
- exact tested URL;
- desktop/mobile context used;
- whether reviewer-only tooling is hidden;
- QA status for the three critical task paths.

Until then, `status.json` keeps `frozen_build` as `AWAITING_PHASE_3_BUILD`.

## Package

- `RESEARCH-PLAN.md` — decision map, method, logistics, consent and evidence rules.
- `SCREENER.md` — behavior-led participant criteria.
- `MODERATOR-GUIDE.md` — neutral opening, realistic tasks and probes.
- `SESSION-TEMPLATE.md` — observation-first record for each participant.
- `PARTICIPANT-TRACKER.md` — anonymized scheduling/eligibility tracker.
- `PRODUCT-TARGETS.md` — qualitative decision thresholds, explicitly not population estimates.
- `evidence-ledger.jsonl` — intentionally empty until real moderated evidence is reviewed.
- `status.json` — machine-readable research state.

## Session target

Aim for **5 participants** in one reasonably coherent user group. NN/g describes about five participants as a common qualitative-usability-test starting point; that does not make five people a quantitative sample or justify population-level percentages.

Primary profile:
- age 18–30 for continuity with prior rounds;
- uses a digital banking app at least weekly;
- has sent a bank transfer before;
- can reason about upcoming bills/savings in a banking app;
- no real account credentials, balances, transaction IDs, or financial PII are collected.

## Exit gate

Round 03 may move to `SYNTHESIS_READY` only after:
- 5 traceable moderated records exist, or the study owner explicitly closes with fewer and documents why;
- each record identifies tested build, device/context and moderator intervention;
- observation is separated from interpretation;
- evidence ledger entries trace to session records;
- contradictory observations remain visible;
- F-02/F-03/F-04 are updated from evidence rather than score inflation;
- product targets are reported as round-specific decision thresholds, not population claims;
- the targeted WCAG review is updated with manual/AT evidence where applicable.

## Recruiter-card gate

Do **not** update the recruiter-facing card merely because Round 03 files exist.

The recruiter card can be updated only after moderated evidence is synthesized. Safe wording must preserve limits, for example:

`5 moderated sessions · observed task evidence · 3 priority findings retested · N still open`

Only use numbers that are traceable to the Round 03 ledger. Do not claim business impact, conversion, retention, or overall usability improvement without compatible evidence.