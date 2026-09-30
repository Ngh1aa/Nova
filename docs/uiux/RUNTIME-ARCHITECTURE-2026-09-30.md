# Nova — Runtime Architecture Evidence — 2026-09-30

## Status

- **P2.1A — current/versioned renderer + P0/P1 state ownership: `DONE_VERIFIED`**
- **P2.1B — older foundation dependency cleanup: `DONE_VERIFIED`**

Nova now has explicit canonical runtime ownership for the implemented prototype without claiming production banking connectivity, direct-user validation, or production impact.

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
- all existing transfer, Activity, Cards, Savings, passcode, recipient, accessibility and native-state regressions passed without weakening assertions;
- P2.1A runtime-architecture regression passed;
- P2.1B foundation-consolidation regression passed.

## Problem before P2 consolidation

Nova had accumulated multiple historical runtime passes. The final product behavior depended on their load/execution order:

- base `nova.js` data/rendering foundation;
- redesign and financial-intelligence transformations;
- brand repair;
- iOS26 navigation/chrome;
- pastel/dashboard passes;
- v3/v4/v5 renderer replacements;
- focused P0/P1 product-rule modules;
- a long stylesheet override chain.

The prototype worked, but runtime ownership was fragile. A stale script/style tag or a new override could silently return old behavior.

## Architecture after P2.1A + P2.1B

### Canonical renderer

Runtime owner:

`assets/nova-current-renderer.js`

P2.1B physically bundles the verified historical foundation/rendering passes in their existing execution order, including the already-consolidated P2.1A renderer snapshot. This preserves visual/behavior parity while removing those historical files as independent `app.html` dependencies.

The deterministic source-to-bundle contract lives in:

`scripts/p2-1b-consolidate-runtime.mjs`

The generated ownership manifest lives in:

`docs/uiux/runtime-manifest.p2-1b.json`

### Canonical interaction/state owner

Runtime owner:

`assets/nova-current-state.js`

It remains a separate semantic owner for verified product state and P0/P1 rules, including:

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

### Canonical stylesheet

Runtime owner:

`assets/nova-current.css`

The verified historical style cascade is physically bundled in its prior order. This is a parity-first architecture cleanup, not a hidden redesign.

### Separate cross-cutting runtime concern

Motion remains separate:

- `assets/nova-motion.js`;
- `assets/nova-motion.css`.

The State Lab launcher also remains separate because it is evidence/reviewer tooling rather than product-state ownership:

- `assets/state-lab-launcher.js`.

## `app.html` runtime after P2.1B

The live application now loads only:

### CSS

- `assets/nova-current.css`;
- `assets/nova-motion.css`.

### JavaScript

- `assets/nova-current-renderer.js`;
- `assets/nova-motion.js`;
- `assets/nova-current-state.js`;
- `assets/state-lab-launcher.js`.

The inline card-frozen bootstrap remains intentionally scoped to the direct frozen-card evidence route.

## Historical sources retained for provenance, not runtime ownership

P2.1B does **not** delete the earlier source files from repository history. They remain inspectable inputs/provenance, but `app.html` no longer loads them independently.

Absorbed foundation JavaScript includes:

- `assets/nova.js`;
- `assets/nova-redesign.js`;
- `assets/nova-financial-intelligence.js`;
- `assets/accessibility.js`;
- `assets/nova-brand-fixes.js`;
- `assets/nova-ios26.js`;
- `assets/nova-pastel-dashboard.js`;
- `assets/nova-dashboard-v2.js`;
- the archived P2.1A canonical renderer snapshot.

The older CSS foundation/override chain is likewise bundled into `assets/nova-current.css`. Exact inputs are recorded in `docs/uiux/runtime-manifest.p2-1b.json` rather than duplicated here.

## Regression protection

### `qa/runtime-consolidation.spec.mjs`

Protects P2.1A ownership and verified current product surfaces.

### `qa/foundation-consolidation.spec.mjs`

Protects P2.1B by verifying that:

- historical foundation scripts are not direct runtime dependencies;
- historical stylesheets are not direct runtime dependencies;
- canonical renderer/state/style owners load exactly once;
- runtime ownership markers identify the canonical bundle/state owners;
- representative Home, Onboarding, Cards and Pay surfaces still render with their verified final behavior.

### Deterministic drift gate

Nova Visual QA reruns:

`node scripts/p2-1b-consolidate-runtime.mjs`

and fails if the committed canonical output differs. This prevents someone from editing historical inputs or the generated bundle without regenerating and reviewing the architecture change.

## Behavior-preservation boundary

The consolidation was accepted only because protected behavior remained green. It does not convert browser regression into user research.

Protected scenarios include:

- transfer amount/reference continuity and Safe-to-spend integrity;
- live transfer consequences at normal, boundary, over-plan and above-balance values;
- Activity search/filter/no-result/reset behavior;
- Card preference persistence, Daily limit validation and freeze hierarchy;
- Savings preview recomputation, including negative Safe-to-spend;
- biometric fallback/passcode retry;
- recipient identity continuity through recovery and receipt;
- keyboard, focus, scaling, reduced-motion and accessibility-tree browser evidence;
- direct native Empty / Loading / Error / Edge state routes.

## Human-research boundary

Architecture status is now complete for the current Nova prototype, but product validation is not.

Round 01 remains:

- `RECRUITING`;
- `0 verified sessions`;
- no direct-user evidence;
- no measured usability improvement;
- no measured business/production impact.

The QA-verified P2.1B `main` commit `487c0d768c9c1aa58c45d10f57cab6c6a126b90c` is pinned as the Round 01 baseline in `research/validation/nova-round-01/BASELINE-BUILD.md`.

The next valid product-design step is therefore **real participant fieldwork**, not another architecture/UI claim.