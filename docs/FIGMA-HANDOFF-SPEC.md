# Nova — Figma System + Handoff Spec

**Status:** source-backed implementation contract; this file does **not** claim the linked Figma file already contains every item below.

This spec translates the current Nova source (`design-system.html`, `component-states.html`, `user-flows.html`, `prototype.html`, and the implemented app) into a reviewer-ready Figma structure.

## 00 — Cover / Prototype Guide

Include:
- project title + independent concept boundary;
- primary review task: **interpret safe-to-spend → inspect suspicious activity → recover/freeze → transfer with impact review**;
- live prototype link;
- case-study link;
- evidence status: `RECRUITING / 0 VERIFIED SESSIONS` until real research exists.

## 01 — Product Context

Show:
- user problem: current balance is not the same as safely spendable money;
- product hypothesis: Money Horizon may reduce ambiguity by combining current balance, commitments and protected buffer;
- business/product goal: trust before engagement;
- non-goal: production banking or guaranteed financial prediction;
- technical boundary: simulated data and front-end prototype.

## 02 — Research / Assumptions

Separate visually:
- `DESK_EVIDENCE` — benchmark/reference patterns;
- `HYPOTHESIS` — Nova-specific beliefs;
- `PLANNED_VALIDATION` — Round 01 protocol;
- `DIRECT_USER` — empty until real session evidence exists.

Link or reference the Round 01 research package. Never paste invented quotes, success rates, or confidence improvements.

## 03 — User Flows

Minimum flows:
1. Balance → Money Horizon → interpret safe-to-spend.
2. Transaction → suspicious evidence → freeze → unfreeze/recovery.
3. Recipient → amount → impact review → simulated authentication → result.
4. Transfer failure → diagnosis → correction/retry.

Annotate decision points and irreversible/recoverable actions.

## 04 — Information Architecture

Map:
- Home / money state;
- planning / Money Horizon;
- transactions / transaction detail;
- payments / transfer;
- cards / protection;
- settings / account controls.

Show how global navigation and local task context differ across desktop/mobile.

## 05 — Wireframes

Use grayscale only. Include:
- balance + Money Horizon hierarchy;
- suspicious transaction detail;
- transfer review;
- failure/recovery;
- mobile transformation.

Do not use final imagery, semantic color, shadows, or decorative motion in this page.

## 06 — Explorations / Decisions

Document at least these trade-offs:
- balance-first dashboard vs balance + Money Horizon vs full cash-flow planner;
- richness vs cognitive load;
- transfer speed vs review safety;
- protection vs recovery friction;
- confidence vs false certainty.

Every selected direction should show at least one rejected alternative and the reason.

## 07 — Design System

### Foundations
- color tokens with semantic status mapping;
- typography scale;
- spacing scale;
- grid/breakpoints;
- radius/elevation;
- icon rules;
- motion durations/easing where used.

### Components
Minimum reusable set:
- buttons;
- inputs/selects;
- navigation;
- balance/stat cards;
- transaction rows;
- status/risk badges;
- modal/drawer;
- toast;
- transfer review block;
- error/recovery block.

### Required states
For applicable components show:
`default · hover · focus · pressed · disabled · loading · error · success · destructive`.

State meaning must not rely on color alone.

## 08 — Final Screens

Group by task, not by random screen count:
- understand money state;
- inspect/act on risk;
- move money;
- recover from failure;
- returning-user/account controls.

For each task include desktop and mobile representatives where behavior changes.

## 09 — Prototype

Prototype the exact Round 01 tasks. Make the start point obvious and label the tested version/commit if possible.

Must include:
- happy path;
- alternative path;
- failure + retry;
- freeze/unfreeze recovery;
- confirmation/success;
- keyboard/focus behavior for desktop-critical controls;
- reduced-motion behavior where motion conveys state.

## 10 — Handoff / Specs

Document:
- breakpoints used by implementation;
- component reuse boundaries;
- long-text/truncation rules;
- number/currency formatting rules;
- loading behavior and timeout/failure copy;
- empty-state rules;
- focus order / keyboard behavior;
- status semantics beyond color;
- motion duration/easing;
- simulated-data boundary;
- dependencies production engineering would still need: ledger data, auth, fraud/risk services, privacy/security/regulatory handling.

## Review gate

The Figma file is reviewer-ready only when a reviewer can answer:
1. what problem is being solved;
2. what was considered and rejected;
3. how the system behaves outside the happy path;
4. how the design maps to implementation;
5. what is validated, planned, simulated, or unknown.
