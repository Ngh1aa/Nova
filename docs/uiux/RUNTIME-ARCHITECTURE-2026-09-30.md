# Nova — Runtime Architecture Evidence — 2026-09-30

> Historical architecture evidence with a **current-status addendum updated 2026-10-01**. `docs/uiux/Phase-State.md` is the canonical current project ledger.

## Current status

- **P2.1A — current/versioned renderer + P0/P1 state ownership: `DONE_VERIFIED`**
- **P2.1B — older foundation dependency cleanup: `DONE_VERIFIED`**
- **P2.2 — canonical Nova identity source: `DONE_VERIFIED`**

Nova has explicit canonical runtime ownership for the implemented prototype without claiming production banking connectivity or production/business impact.

## Verification summary

### P2.1A

Implementation PR: `#50 — refactor: consolidate Nova current renderer and product state runtime`

Verified merged commit:

`52419150cacbffbcc72d6ab2f80f0c01760586f7`

P2.1A consolidated the fragmented v3 → v4 → v5 renderer stack and the focused P0/P1 product-rule modules into:

- `assets/nova-current-renderer.js` — canonical current renderer;
- `assets/nova-current-state.js` — canonical product interaction/state owner;
- `assets/nova-current.css` — canonical current stylesheet.

### P2.1B

Implementation PR: `#52 — refactor: complete P2.1B foundation runtime consolidation`

Verified merged commit:

`487c0d768c9c1aa58c45d10f57cab6c6a126b90c`

Verification chain:

- PR-head Nova Visual QA run `36676946777` — `SUCCESS`;
- merged-main Nova Visual QA run `36677133725` — `SUCCESS`;
- GitHub Pages build/deployment run `36677132720` — `SUCCESS`;
- UIUX Factory Flow OS passed using pinned Factory commit `11003bf36909b08c3def617023dc8ecd9c3964fd`;
- deterministic runtime-generation drift check passed;
- generic rendered visual/Axe QA passed;
- transfer, Activity, Cards, Savings, passcode, recipient, accessibility and native-state regressions passed;
- P2.1A runtime-architecture regression passed;
- P2.1B foundation-consolidation regression passed.

### P2.2

Implementation PR: `#69 — Nova P2.2: make canonical runtime Nova-native`

Verified merged commit:

`d1e4c6a7c511825b32587b2e0993e85a30d79508`

P2.2 moved identity truth into generation rather than repairing it after render:

- canonical generated renderer contains Nova identity directly;
- historical `LDG_` transaction prefix is normalized to `NVA_` before runtime;
- `assets/nova-brand-fixes.js` is no longer a canonical runtime input;
- `assets/nova-redesign.js` and `assets/nova-ios26.js` no longer perform Ledger-specific runtime identity repair;
- `qa/identity-source.spec.mjs` protects source and rendered identity ownership;
- merged-main Nova Visual QA run `#313` / `36825048721` passed;
- GitHub Pages build/deploy and Vercel commit status passed for the merged state.

See `docs/uiux/IDENTITY-SOURCE-2026-10-01.md`.

## Problem before P2 consolidation

Nova had accumulated multiple historical runtime passes. Final product behavior depended on load/execution order across base rendering, redesign/financial-intelligence transformations, brand repair, iOS navigation/chrome, dashboard passes, v3/v4/v5 replacements, focused P0/P1 rule modules and a long stylesheet override chain.

The prototype worked, but runtime ownership was fragile: a stale tag or new override could silently return old behavior.

## Architecture after P2.1 + P2.2

### Canonical renderer

Runtime owner:

`assets/nova-current-renderer.js`

The deterministic source-to-bundle contract lives in:

`scripts/p2-1b-consolidate-runtime.mjs`

The generated ownership manifest lives in:

`docs/uiux/runtime-manifest.p2-1b.json`

P2.1B physically bundles the verified foundation/rendering passes in their preserved order. P2.2 additionally normalizes historical predecessor identity during generation so the canonical output is Nova-native before execution.

### Canonical interaction/state owner

Runtime owner:

`assets/nova-current-state.js`

It owns verified product state and P0/P1 rules including:

- Safe-to-spend transfer validation;
- amount/reference persistence;
- above-Safe-to-spend acknowledgement;
- live transfer-impact preview;
- recovery/no-money-moved truth;
- Activity search/filter/no-result behavior;
- Card preferences, freeze hierarchy and Daily limit validation;
- Savings Money Horizon recomputation and shortfall states;
- passcode retry/recovery;
- recipient search/selection/continuity;
- native Empty / Loading / Error / Edge lifecycle states.

Later evidence-informed clarity/truth-boundary modules may refine copy/presentation for verified decisions, but they do not restore the pre-P2 fragmented renderer ownership model.

### Canonical stylesheet

Runtime owner:

`assets/nova-current.css`

The verified historical style cascade is physically bundled in its prior order. This was a parity-first architecture cleanup, not a hidden redesign.

### Separate cross-cutting concerns

Motion remains separate:

- `assets/nova-motion.js`;
- `assets/nova-motion.css`.

Reviewer tooling remains separate because it is not product-state ownership:

- `assets/state-lab-launcher.js`.

## `app.html` canonical runtime boundary

The application loads canonical product assets plus scoped cross-cutting/evidence concerns. Historical foundation modules are not independently loaded as competing runtime owners.

Core canonical owners:

### CSS

- `assets/nova-current.css`;
- `assets/nova-motion.css`;
- scoped post-research truth/clarity styles where explicitly loaded by the current implementation.

### JavaScript

- `assets/nova-current-renderer.js`;
- `assets/nova-current-state.js`;
- `assets/nova-motion.js`;
- `assets/state-lab-launcher.js`;
- scoped post-research truth/clarity behavior where explicitly loaded by the current implementation.

The inline card-frozen bootstrap remains intentionally scoped to the direct frozen-card evidence route.

## Historical sources retained for provenance

P2 does **not** erase earlier source/history. Historical files remain inspectable as provenance or generator inputs where documented, but they are not independent live owners.

P2.1B originally absorbed foundation JavaScript such as:

- `assets/nova.js`;
- `assets/nova-redesign.js`;
- `assets/nova-financial-intelligence.js`;
- `assets/accessibility.js`;
- `assets/nova-ios26.js`;
- `assets/nova-pastel-dashboard.js`;
- `assets/nova-dashboard-v2.js`;
- the archived P2.1A canonical renderer snapshot.

`assets/nova-brand-fixes.js` is now historical provenance only after P2.2 and is **not** in the current generated runtime input list.

The older CSS foundation/override chain is bundled into `assets/nova-current.css`; exact current inputs are recorded in `docs/uiux/runtime-manifest.p2-1b.json`.

## Regression protection

### `qa/runtime-consolidation.spec.mjs`

Protects P2.1A ownership and verified current product surfaces.

### `qa/foundation-consolidation.spec.mjs`

Protects P2.1B by verifying that historical foundation scripts/styles are not direct competing dependencies and canonical renderer/state/style owners remain unique.

### `qa/identity-source.spec.mjs`

Protects P2.2 by verifying canonical Nova identity at source and on representative rendered routes.

### Deterministic drift gate

Nova Visual QA reruns:

`node scripts/p2-1b-consolidate-runtime.mjs`

and fails if committed generated output differs. This prevents historical-input or generator changes from silently desynchronizing canonical runtime.

## Behavior-preservation boundary

Architecture cleanup was accepted only because protected behavior remained green. Browser regression does not become user research merely because architecture is verified.

Protected scenarios include:

- transfer amount/reference continuity and Safe-to-spend integrity;
- live transfer consequences at normal, boundary, over-plan and above-balance values;
- Activity search/filter/no-result/reset behavior;
- Card preference persistence, Daily limit validation and freeze hierarchy;
- Savings preview recomputation, including negative Safe-to-spend;
- biometric fallback/passcode retry;
- recipient identity continuity through recovery and receipt;
- keyboard, focus, scaling, reduced-motion and accessibility-tree browser evidence;
- direct native Empty / Loading / Error / Edge state routes;
- canonical Nova identity ownership.

## Human-research boundary — current addendum

The old `RECRUITING / 0 verified sessions / no direct-user evidence` statement is superseded.

Current evidence:

- **Round 01:** 5 eligible real users; unmoderated task-based prototype evaluation with consented self-report; 5 verified direct-user records; 0 moderated sessions.
- **Round 02:** 5 NEW eligible participants; verified asynchronous structured self-report retest; 5 verified records; 0 moderated sessions.
- Round 02 used different participants, so cross-round changes are cross-sectional self-report signals rather than causal within-subject effects.
- D-01 through D-04 received a further evidence-informed implementation pass after Round 02 and remain `ITERATED / NOT HUMAN-RETESTED`.
- The planned moderated Round 03 was explicitly skipped and contributes no validation evidence.

Architecture/QA evidence may prove implementation and regression behavior. It cannot prove observed task-success/time improvement, causality, overall validated usability or business impact.

The next valid research transition, if resumed, is a retest of the latest D-01…D-04 implementation; use moderated observation if observed behavior/time-on-task evidence is desired.
