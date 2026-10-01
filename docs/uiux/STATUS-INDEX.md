# Nova — Status / Evidence Source Index

Use this index to avoid treating a dated snapshot as the current project state.

## Canonical current status

Read in this order:

1. `docs/uiux/Phase-State.md` — canonical delivery/research/status ledger.
2. `PROJECT-CONTEXT.md` — current product, runtime and source-of-truth contract.
3. `.uiux-profile.json` — machine-readable UIUX profile and evidence summary.
4. `research/validation/nova-round-01/status.json` — current Round 01 rollup.
5. `research/validation/nova-round-02/status.json` — current Round 02/post-Round-02 rollup.
6. `docs/uiux/Requirement-Coverage-Ledger.md` — current requirement completion state.
7. `docs/uiux/QA-Plan.md` — continuing QA contract and current evidence baseline.

If these sources conflict, `Phase-State.md` wins for current status while raw/atomic research evidence remains authoritative for what actually happened in a research round.

## Current recruiter / decision evidence

- `design-decisions.html` — lean public recruiter surface with **3 decision stories**.
- `docs/uiux/DESIGN-DECISIONS-TRADEOFFS-2026-10-01.md` — **7-decision internal record** for optional interview depth and provenance.
- P2.4 state: `DONE_VERIFIED`.
- Public claim contract: problem/constraint → decision → rejected alternative → trade-off → evidence → remaining uncertainty.
- QA/CI is prototype/technical evidence; it is not user validation.

## Current architecture evidence

- `docs/uiux/RUNTIME-ARCHITECTURE-2026-09-30.md` — P2.1 + P2.2 architecture status, with a 2026-10-01 current-state addendum.
- `docs/uiux/IDENTITY-SOURCE-2026-10-01.md` — P2.2 canonical Nova identity source.
- `docs/uiux/runtime-manifest.p2-1b.json` — generated runtime ownership manifest, not the overall project-phase ledger.

## Current research interpretation

- `research/validation/nova-round-02/RETEST-SYNTHESIS.md` — what Round 02 participants reported.
- `research/validation/nova-round-02/DECISION-LOG.md` — how Round 02 evidence changed priorities and the latest implementation state.
- `docs/uiux/NOVA-PHASE3-CLARITY-ITERATION.md` — QA-verified D-01/D-03/D-04 implementation record; not human-retested.
- `docs/FIGMA-HANDOFF-SPEC.md` — reviewer-facing method/iteration boundary.

## Historical snapshots — preserve, do not silently rewrite

These files remain valuable evidence of what was true at a specific point in the project. Their words such as `current`, `next`, `pending`, `recruiting` or `not user validated` are scoped to their capture date unless a current rollup carries them forward.

Examples:

- `docs/uiux/PRODUCT-DESIGN-AUDIT-2026-09-29.md`
- `docs/uiux/EXPERT-WALKTHROUGH-2026-09-29.md`
- `docs/uiux/ACCESSIBILITY-EVIDENCE-2026-09-30.md`
- `docs/uiux/NATIVE-STATE-EVIDENCE-2026-09-30.md`
- `docs/uiux/SYNTHETIC-USABILITY-ROUND-01.md`
- `research/validation/nova-round-01/BASELINE-BUILD.md`
- `research/validation/nova-round-01/STUDY-PLAN.md`
- `research/validation/nova-round-01/ROUND-02-RETEST-PLAN.md`
- participant forms, session templates, atomic ledgers and raw evidence records.

Do not update raw participant responses or atomic evidence to make them match later conclusions.

## Evidence boundaries that remain current

- Round 01: 5 verified direct-user self-report records; 0 moderated sessions.
- Round 02: 5 NEW verified async self-report retest records; 0 moderated sessions.
- Cross-round deltas are cross-sectional self-report signals, not causal within-subject effects.
- Latest D-01 through D-04 changes are implemented / QA-verified / not human-retested.
- No production banking, conversion, retention, fraud-reduction or business-impact evidence exists.
- Browser accessibility evidence is not a WCAG conformance certification.
- The next meaningful evidence upgrade is a new observed human session when a real participant is available; it is not a prerequisite for the current portfolio handoff.
