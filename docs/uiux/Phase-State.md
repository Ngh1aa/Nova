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
current_workstream: portfolio_handoff
result: DONE_VERIFIED
p0: DONE_VERIFIED
p1: DONE_VERIFIED
p2_1_runtime_consolidation: DONE_VERIFIED
p2_2_identity_source: DONE_VERIFIED
p2_3_phase_ledger_refresh: DONE_VERIFIED
p2_3_main_release_confirmation: DONE_VERIFIED
p2_4_decision_tradeoff_evidence: DONE_VERIFIED
next_workstream: observed_human_evidence_when_available
production_banking_connected: false
business_impact_measured: false
moderated_sessions_round_01: 0
moderated_sessions_round_02: 0
verified_direct_user_records_round_01: 5
verified_async_retest_records_round_02: 5
post_round_02_iteration_human_retested: false
```

## Current product state

Nova is a responsive interactive consumer-finance prototype with product-owned happy, exception, recovery and lifecycle states. The verified implementation includes Safe-to-spend / Money Horizon planning, Activity search and filters, card controls and freeze hierarchy, transfer impact and recovery, Savings preview, recipient continuity, KYC, browser-assisted accessibility evidence and direct Empty / Loading / Error / Edge states.

The live runtime has one canonical generated renderer, one canonical interaction/state owner and one canonical stylesheet. Motion and reviewer tooling remain separate cross-cutting concerns by design.

## Delivery state

### P0 — product-integrity blockers

`DONE_VERIFIED`

Transfer integrity, recovery truth boundaries and measurement-framework honesty are complete for the prototype scope.

### P1 — interaction, state and accessibility gaps

`DONE_VERIFIED`

P1.1 through P1.8 are implemented and regression-protected.

### P2.1 — runtime consolidation

`DONE_VERIFIED`

Canonical current renderer/state ownership and generated foundation/style ownership are consolidated. See `docs/uiux/RUNTIME-ARCHITECTURE-2026-09-30.md`.

### P2.2 — canonical Nova identity source

`DONE_VERIFIED`

Canonical generated runtime is Nova-native; legacy Ledger identity remains historical provenance only. See `docs/uiux/IDENTITY-SOURCE-2026-10-01.md`.

### P2.3 — stale phase-ledger refresh

`DONE_VERIFIED`

Current-status documents and machine-readable research rollups agree on delivery/research state. P2.3 is branch-verified and release-confirmed on canonical `main`; its historical release evidence remains in `docs/uiux/PHASE-LEDGER-REFRESH-2026-10-01.md`.

### P2.4 — lean design decisions / rejected alternatives

`DONE_VERIFIED`

P2.4 turns Nova reasoning into recruiter-readable product judgment without exposing the whole internal audit trail:

- `design-decisions.html` shows **3 public decision stories**: Protected money / Safe to spend, Freeze vs Report, and failure recovery;
- `docs/uiux/DESIGN-DECISIONS-TRADEOFFS-2026-10-01.md` keeps **7 internal decision records** for optional interview depth;
- each public story shows problem/constraint → decision → rejected alternative → trade-off → evidence → remaining uncertainty;
- public evidence labels stay method-specific; QA/CI remains prototype/technical evidence, never user validation;
- responsive rendered evidence is captured at 1440 / 768 / 390 and the six-link evidence navigation remains one row on mobile/tablet.

Branch verification before canonical merge:

- PR `#73 — Nova P2.4: make design decisions and trade-offs recruiter-visible`;
- Nova Visual QA / Actions run `36840448193`: `SUCCESS`;
- generated canonical-runtime sync: `SUCCESS`;
- pinned UIUX Factory Flow OS dogfood: `SUCCESS`;
- rendered/browser/accessibility/product regression suite: `SUCCESS`.

The repository has no additional planned P2 documentation phase. Further Nova portfolio value should come from **new external human evidence**, not more internal ceremony.

## Human-research state

Nova has **direct-user evidence**, but not moderated usability evidence:

- **Round 01:** 5 eligible real users; unmoderated task-based prototype evaluation with consented self-report; 0 moderated sessions.
- **Round 02:** 5 NEW eligible participants; verified asynchronous structured self-report retest on the frozen post-iteration build; 0 moderated sessions.
- **After Round 02:** D-01 through D-04 received another evidence-informed implementation pass. Those changes are `ITERATED / NOT HUMAN-RETESTED`.
- The previously planned moderated Round 03 was explicitly skipped and contributes no evidence.

Allowed language is method-specific: verified direct-user/self-report records and cross-sectional signals. Do not convert these records into observed task-success, time-on-task, causal improvement, overall validated-usability, conversion, retention or business-impact claims.

The next meaningful evidence upgrade, when a real participant is available, is a fresh **observed task-based session** on the current build. It is not a release blocker and must not be backfilled or simulated as human research.

## QA / deployment state

The canonical Nova Visual QA workflow runs the pinned UIUX Factory Flow OS plus generated-runtime drift checks, rendered/browser QA, accessibility checks and Nova regression suites. P2.4 passed the complete PR-head gate before ledger promotion. Canonical-main release confirmation is performed after PR merge.

Deployment success only proves the prototype was deployed; it does not change the simulated-banking, research-method or business-impact boundaries.

## Historical-document rule

Do **not** rewrite dated evidence to make history look cleaner. Preserve the state that was true when evidence was captured. Current-state consumers should start here, then follow links to dated evidence for provenance.

Examples of historical snapshots include:

- `docs/uiux/PRODUCT-DESIGN-AUDIT-2026-09-29.md`;
- `docs/uiux/EXPERT-WALKTHROUGH-2026-09-29.md`;
- `docs/uiux/ACCESSIBILITY-EVIDENCE-2026-09-30.md`;
- `docs/uiux/NATIVE-STATE-EVIDENCE-2026-09-30.md`;
- Round 01 / Round 02 raw participant and atomic evidence records.
