# Nova Round 01 — Verified Baseline Build

**Study:** `nova-round-01`  
**Evidence state:** `PLANNED_VALIDATION / RECRUITING`  
**Verified sessions:** `0`  
**Baseline commit:** `487c0d768c9c1aa58c45d10f57cab6c6a126b90c`  
**Baseline branch:** `main`  
**Primary prototype:** https://ngh1aa.github.io/Nova/app.html?screen=home&lab=1  
**Alternate prototype:** https://nova-gamma-eosin.vercel.app/?lab=1

## Why this build is pinned

Round 01 needs one traceable product version so observations from P01–P05 are comparable. The baseline above is the first `main` build after P2.1B foundation-runtime consolidation was merged and re-verified.

The `lab=1` query parameter is part of the research environment contract: it hides the recruiter-only State Lab launcher so participant behavior is not contaminated by reviewer tooling that is not part of the Nova product.

Do not silently switch participants to a newer implementation. If a blocking defect requires a build change during the round, record the new commit in the affected session artifact and describe the change in `DECISION-LOG.md` before comparing results.

## Verification evidence

Implementation:
- PR `#52 — refactor: complete P2.1B foundation runtime consolidation`;
- merged `main` commit `487c0d768c9c1aa58c45d10f57cab6c6a126b90c`.

QA on the PR head:
- Nova Visual QA run `36676946777` — `SUCCESS`;
- deterministic canonical-runtime drift check — `PASS`;
- pinned UIUX Factory Flow OS dogfood — `PASS`;
- generic rendered visual/Axe QA — `PASS`;
- all existing P0/P1 behavior regressions — `PASS`;
- P2.1A runtime regression — `PASS`;
- P2.1B foundation-consolidation regression — `PASS`.

QA on merged `main`:
- Nova Visual QA run `36677133725` — `SUCCESS`;
- GitHub Pages build/deployment run `36677132720` — `SUCCESS`.

Factory version used by Nova QA:
- `Ngh1aa/uiux-ai-workspace@11003bf36909b08c3def617023dc8ecd9c3964fd`.

## Human-research boundary

This build verification is **not usability evidence**. It only proves that the baseline implementation and protected product behavior passed the automated/browser-backed gates used by the project.

Round 01 remains:
- `RECRUITING`;
- `0 verified sessions`;
- no direct-user quotes;
- no observed task-success rate;
- no measured confidence delta;
- no production/business impact claim.

The next valid transition is a real, consented participant session recorded through `SESSION-TEMPLATE.md` and the evidence ledger.