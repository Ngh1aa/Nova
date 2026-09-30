# Nova Round 01 — Verified Baseline Build

**Study:** `nova-round-01`  
**Evidence state:** `PLANNED_VALIDATION / RECRUITING`  
**Verified sessions:** `0`  
**Current baseline commit:** `1bf3a6f786052ab37c74523ef9828a02d4f11f85`  
**Baseline branch:** `main`  
**Primary prototype:** https://ngh1aa.github.io/Nova/app.html?screen=home&lab=1  
**Alternate prototype:** https://nova-gamma-eosin.vercel.app/?lab=1

## Why this build is pinned

Round 01 needs one traceable product version so observations from P01–P05 are comparable. The current baseline is the QA-verified `main` build after the pre-human synthetic dogfood pass and the SD-02 report-transaction iteration.

The `lab=1` query parameter is part of the research-environment contract. It hides recruiter-only State Lab tooling so participant behavior is not contaminated by controls that are not part of Nova.

## Baseline history

### Retired before human fieldwork

Previous baseline:

`487c0d768c9c1aa58c45d10f57cab6c6a126b90c`

That build was pinned after P2.1B runtime consolidation, but it was **retired before the first real participant session**. No human session artifact exists for it and `verified_sessions` remained `0` when the baseline changed.

Why it was retired:
- synthetic dogfood exposed reviewer-tool interference in mobile research sessions (SD-01);
- synthetic dogfood exposed ambiguity/dead-end expectations around `Report transaction` (SD-02);
- both issues were iterated and regression-tested before Human P01 started.

Because no direct-user session had begun, repinning at this point does not mix human evidence across product versions.

## Current baseline verification

Implementation:
- PR `#58 — fix: make report transaction boundary explicit`;
- merged `main` commit `1bf3a6f786052ab37c74523ef9828a02d4f11f85`.

Synthetic pre-human retest:
- `research/synthetic/nova-round-01/SD-02-REPORT-RETEST.md`;
- evidence class: `SYNTHETIC_USER_WALKTHROUGH / AI_DOGFOOD`;
- result: `RESOLVED_FOR_SYNTHETIC_ROUND / PENDING_HUMAN`.

QA before merge:
- Nova Visual QA run `36683227801` — `SUCCESS`;
- report boundary desktop/mobile regression — `PASS`;
- 390px research-mode path (`lab=1`) — `PASS`;
- runtime drift protection — `PASS`;
- pinned UIUX Factory Flow OS dogfood — `PASS`;
- accessibility/browser evidence and existing product regressions — `PASS`.

QA after merge:
- merged-main Nova Visual QA run `36683478002` — `SUCCESS`;
- GitHub Pages build/deployment run `36683477068` — `SUCCESS`.

Factory version used by Nova QA:
- `Ngh1aa/uiux-ai-workspace@11003bf36909b08c3def617023dc8ecd9c3964fd`.

## Baseline discipline during Human Round 01

Use commit `1bf3a6f786052ab37c74523ef9828a02d4f11f85` for P01–P05 unless a blocking defect makes a defined task impossible.

Every real session record must include the exact commit actually tested. If the build must change after Human P01 begins:
1. record the replacement commit in each affected session;
2. document the reason in `DECISION-LOG.md`;
3. do not pool observations from different builds as though they are identical;
4. retest an affected task before claiming improvement.

## Human-research boundary

Automated QA and synthetic dogfood are **not direct-user evidence**. They prove implementation integrity and support pre-human iteration only.

Human Round 01 remains:
- `RECRUITING`;
- `0 verified sessions`;
- no real participant quotes;
- no observed human task-success rate;
- no measured human confidence delta;
- no production/business impact claim.

The next valid transition is a real, eligible and consented P01 session recorded through `SESSION-TEMPLATE.md` and the direct-user evidence ledger.