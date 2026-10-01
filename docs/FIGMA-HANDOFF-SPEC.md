# Nova — Figma System + Handoff Spec

**Status:** source-backed implementation contract; this file does **not** claim the linked Figma file already contains every item below.

This spec translates the current Nova source (`design-system.html`, `component-states.html`, `user-flows.html`, `prototype.html`, and the implemented app) into a reviewer-ready Figma structure. `docs/uiux/Phase-State.md` is the canonical current-status source.

## 00 — Cover / Prototype Guide

Include:
- project title + independent concept boundary;
- primary review task: **interpret safe-to-spend → inspect suspicious activity → recover/freeze/report → transfer with impact review**;
- live prototype link;
- case-study link;
- evidence status: **Round 01: 5 verified direct-user self-report records · Round 02: 5 verified async retest records on the frozen post-iteration build**;
- latest product state: **post-Round-02 D-01…D-04 iteration implemented / QA-verified / not human-retested**;
- explicit note: neither round was five moderated sessions; Round 02 supports self-report comparison, not observed task-success/time claims.

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
- `ROUND_01_DIRECT_USER_SELF_REPORT` — five consented real-user records from an unmoderated task-based prototype evaluation;
- `ITERATION_01` — D-01…D-04 changes driven by Round 01 evidence IDs;
- `ROUND_02_ASYNC_RETEST_SELF_REPORT` — five NEW users, tested 2026-09-30 on the frozen post-iteration build;
- `ITERATION_02_IMPLEMENTED_NOT_RETESTED` — latest D-01…D-04 product changes driven by unresolved/mixed Round 02 signals;
- `FUTURE_RETEST_OPTIONAL` — human validation remains open; no moderated Round 03 occurred.

Show the evidence-method boundary prominently:
- Round 01: 5 verified self-report records / 0 moderated sessions;
- Round 02: 5 verified async retest self-report records / 0 moderated sessions;
- Round 02 tested build: `5c457075510359703a41966aaa3f0a1cecf8ca44`;
- no observed task-success/time-on-task claim;
- cross-round deltas are cross-sectional because Round 02 used NEW participants;
- do not claim that either iteration caused an improvement or regression;
- latest post-Round-02 implementation is not human-retested.

Reference:
- `research/validation/nova-round-01/evidence-ledger.jsonl`;
- `research/validation/nova-round-01/FINDINGS.md`;
- `research/validation/nova-round-01/DECISION-LOG.md`;
- `research/validation/nova-round-02/evidence-ledger.jsonl`;
- `research/validation/nova-round-02/RETEST-SYNTHESIS.md`;
- `research/validation/nova-round-02/DECISION-LOG.md`;
- `docs/uiux/NOVA-PHASE3-CLARITY-ITERATION.md`.

## 03 — User Flows

Minimum flows:
1. Balance → Money Horizon → interpret safe-to-spend.
2. Transaction → suspicious evidence → freeze/report-preview → recovery.
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

### Round 01 iteration

- **D-01 / P2:** attach `next 14 days` to the primary Safe-to-spend decision number;
- **D-02 / P1:** put simulated consequences directly in Freeze/Report action labels and boundary copy;
- **D-03 / P1:** show transfer impact as a before − transfer − fee = after calculation and preserve protected buffer explicitly;
- **D-04 / P2:** pair failure cause with `No money moved` reassurance.

### Round 02 retest result

- **D-01 / F-03:** `UNRESOLVED` — only 2/5 identify the intended 14-day horizon.
- **D-02 / F-01:** `IMPROVED_SELF_REPORT_SIGNAL / UNRESOLVED` — 2/5 clearly understand demo/preview and action distinction; 3/5 still show confusion/real-bank interpretation.
- **D-03 / F-02:** `PARTIAL_IMPROVEMENT / UNRESOLVED` — 5/5 understand the €1,155 arithmetic, only 1/5 correctly understands that Protected buffer is not automatically consumed.
- **D-04 / F-04:** `REGRESSED_SELF_REPORT_SIGNAL` — only 2/5 Round 02 participants clearly understand that no money moved, versus 4/5 in Round 01 self-report.

### Post-Round-02 implementation

- **D-01:** promote explicit `Next 14 days` language across Safe-to-spend, Money Horizon and transfer surfaces.
- **D-02:** separate Freeze and Report into distinct consequence paths and place `DEMO ONLY · NO BANK CONTACT` beside the primary decision/result.
- **D-03:** preserve the successful arithmetic explanation and add `Protected buffer stays reserved — this transfer does not use it.` at the decision point.
- **D-04:** foreground `NO MONEY MOVED`, concrete failure cause and unchanged balance before recovery actions.

Status for all four: **implemented / QA-verified / not human-retested**.

For every direction show Round 01 and Round 02 atomic evidence IDs separately. Mark cross-round deltas as **self-report signals**, not causal observed usability effects.

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
- understand money state — show horizon attached to Safe to spend;
- inspect/act on risk — show demo-only Freeze and report-preview consequences before interaction;
- move money — show impact calculation and protected-buffer treatment;
- recover from failure — show failure cause + no-money-moved reassurance together;
- returning-user/account controls.

For each task include desktop and mobile representatives where behavior changes.

Annotate the post-Round-02 screens as **evidence-informed iteration / not human-retested**, so a recruiter does not mistake implementation polish for validated improvement.

## 09 — Prototype / Research State

Round 02 was executed on frozen build `5c457075510359703a41966aaa3f0a1cecf8ca44` with five NEW participants on 2026-09-30 using async structured self-report.

After Round 02, the D-01…D-04 implementation pass was completed and QA-verified. The planned moderated Round 03 was explicitly skipped, so there is no post-change participant evidence for the latest build.

If human research resumes, freeze the exact latest build and retest the same affected concepts:
- Task 1: ask what period Safe to spend applies to without teaching the answer;
- Task 2: before/after Freeze or Report Preview, ask what the participant believes has actually happened;
- Task 3: ask the participant to predict the Safe-to-spend impact **and** state whether Protected buffer is used automatically;
- Task 4: ask what failed, whether money moved and what action they would take next;
- happy path;
- alternative path;
- failure + retry;
- freeze/unfreeze recovery;
- confirmation/success;
- keyboard/focus behavior for desktop-critical controls;
- reduced-motion behavior where motion conveys state.

Record the exact tested commit/build for every future participant. Prefer moderated observation if observed task-success/time evidence is needed.

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
2. what direct-user evidence exists and what method produced it;
3. what changed after Round 01;
4. what Round 02 showed as improved signal, unresolved or regressed signal;
5. what changed after Round 02 and why those changes are still not human-retested;
6. how the system behaves outside the happy path;
7. how the design maps to implementation;
8. what is observed, self-reported, simulated, planned, cross-sectional or unknown.
