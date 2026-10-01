# NOVA — Canonical Phase State

> **Current-status source of truth.** Dated audit/evidence documents remain historical snapshots. When a historical file uses words such as “current”, “next”, “pending” or “recruiting”, interpret them in the context of that file’s date unless this ledger explicitly carries the same state forward.

```yaml
status_as_of: 2026-10-01
project_mode: interactive_prototype
responsive_scope: 1440 / 1024 / 768 / 390
target_repository: Ngh1aa/Nova
factory_repository: Ngh1aa/uiux-ai-workspace
factory_pin: 11003bf36909b08c3def617023dc8ecd9c3964fd
canonical_branch: main
current_workstream: P2.3_phase_ledger_refresh
result: IMPLEMENTED_AWAITING_VERIFICATION
p0: DONE_VERIFIED
p1: DONE_VERIFIED
p2_1_runtime_consolidation: DONE_VERIFIED
p2_2_identity_source: DONE_VERIFIED
p2_3_phase_ledger_refresh: IMPLEMENTED_AWAITING_VERIFICATION
p2_4_decision_tradeoff_evidence: NEXT_PLANNED
production_banking_connected: false
business_impact_measured: false
moderated_sessions_round_01: 0
moderated_sessions_round_02: 0
verified_direct_user_records_round_01: 5
verified_async_retest_records_round_02: 5
post_round_02_iteration_human_retested: false
```

## Current product state

Nova is a responsive interactive consumer-finance prototype with product-owned happy, exception, recovery and lifecycle states. The verified implementation includes Safe-to-spend / Money Horizon planning, Activity search and filters, card controls and freeze hierarchy, transfer impact and recovery, Savings preview, recipient continuity, KYC, accessibility browser evidence and direct product Empty / Loading / Error / Edge states.

The live runtime has one canonical generated renderer, one canonical interaction/state owner and one canonical stylesheet. Motion and reviewer tooling remain separate cross-cutting concerns by design.

## Delivery state

### P0 — product-integrity blockers

`DONE_VERIFIED`

Transfer integrity, recovery truth boundaries and measurement-framework honesty are complete for the prototype scope.

### P1 — interaction, state and accessibility gaps

`DONE_VERIFIED`

P1.1 through P1.8 are implemented and regression-protected. See the dated evidence documents for each verified slice.

### P2.1 — runtime consolidation

`DONE_VERIFIED`

- P2.1A consolidated current renderer/state ownership.
- P2.1B collapsed the historical foundation/stylesheet runtime dependencies into canonical generated assets.
- Source: `docs/uiux/RUNTIME-ARCHITECTURE-2026-09-30.md`.

### P2.2 — canonical Nova identity source

`DONE_VERIFIED`

Canonical generated runtime is Nova-native; legacy Ledger identity remains historical provenance only and is not repaired after render.

- Source: `docs/uiux/IDENTITY-SOURCE-2026-10-01.md`.

### P2.3 — stale phase-ledger refresh

`IMPLEMENTED_AWAITING_VERIFICATION`

This workstream makes current-status documents agree on the same evidence state without rewriting historical research records. It updates the README/project context, phase and requirement ledgers, QA/runtime status, research rollups and reviewer handoff language, then protects those states with regression checks.

### P2.4 — design decisions / rejected alternatives

`NEXT_PLANNED`

Recruiter-visible trade-off evidence remains the next P2 portfolio-clarity task after P2.3 is verified.

## Human-research state

Nova now has **direct-user evidence**, but not moderated usability evidence:

- **Round 01:** 5 eligible real users; unmoderated task-based prototype evaluation with consented self-report; 0 moderated sessions.
- **Round 02:** 5 NEW eligible participants; verified asynchronous structured self-report retest on the frozen post-iteration build; 0 moderated sessions.
- **After Round 02:** D-01 through D-04 received another evidence-informed implementation pass. Those changes are `ITERATED / NOT HUMAN-RETESTED`.
- The planned moderated Round 03 was explicitly skipped and contributes no validation evidence.

Allowed language is method-specific: verified direct-user/self-report records and cross-sectional signals. Do not convert these records into observed task-success, time-on-task, causal improvement, overall validated-usability, conversion, retention or business-impact claims.

## QA / deployment state

The canonical Nova Visual QA workflow runs the pinned UIUX Factory Flow OS plus generated-runtime drift checks, rendered/browser QA, accessibility checks and Nova regression suites. The P2.2 merged-main run `#313` passed before P2.3 began; P2.3 must pass its own PR and merged-main gates before this ledger is promoted to `DONE_VERIFIED`.

GitHub Pages and Vercel are deployment surfaces for the prototype; they do not change the simulated-banking or research-method boundaries.

## Historical-document rule

Do **not** rewrite dated evidence to make history look cleaner. Preserve the state that was true when evidence was captured. Current-state consumers should start here, then follow links to dated evidence for provenance.

Examples of historical snapshots include:

- `docs/uiux/PRODUCT-DESIGN-AUDIT-2026-09-29.md`;
- `docs/uiux/EXPERT-WALKTHROUGH-2026-09-29.md`;
- `docs/uiux/ACCESSIBILITY-EVIDENCE-2026-09-30.md`;
- `docs/uiux/NATIVE-STATE-EVIDENCE-2026-09-30.md`;
- Round 01 / Round 02 raw participant and atomic evidence records.
