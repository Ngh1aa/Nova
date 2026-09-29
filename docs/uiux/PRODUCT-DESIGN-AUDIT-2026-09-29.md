# Nova — Product Design Audit — 2026-09-29

## Audit intent

Audit Nova as a real Product Designer portfolio case without pretending commercial seniority or inventing validation, business impact, user quotes or production evidence.

Evidence states used here:

- `VERIFIED` — directly supported by repository implementation, test evidence or committed research artifacts.
- `INFERRED` — reasonable conclusion from evidence but not directly tested.
- `ASSUMED` — temporary product assumption.
- `UNKNOWN` — no reliable evidence exists yet.

Delivery states follow the UIUX Factory gating language:

- `DONE_VERIFIED` — implemented and verified by committed evidence.
- `BLOCKED_EXTERNAL_EVIDENCE` — cannot be truthfully closed by code/docs alone.

## Verification record

### 2026-09-29 — P0 technical remediation

The technical P0 work is now merged into `main` and verified through the repository QA workflow.

Verified changes:

- PR #27 — transfer integrity, persisted amount/reference, explicit above-Safe-to-spend acknowledgement, measurement framework and regression coverage.
- PR #28 — truthful above-Safe-to-spend recovery state, explicit plan shortfall, and a visible “No transfer has been made” reassurance after failed authentication/offline recovery.
- `main` commit `945e8beadd05933f7b04865008c9221055a21553` — Nova Visual QA passed.
- GitHub Pages build and deployment for the same `main` commit passed.

This does **not** close direct-user validation. Issue #29 tracks Round 01 recruitment and evidence collection.

## Executive result

Nova is already stronger than a typical visual concept: it has a product thesis, IA, exception/recovery flows, state contracts, responsive QA, handoff documentation and a real-user validation protocol. The largest remaining flagship risk is no longer the repaired transfer logic; it is the absence of direct-user evidence.

The audit found three P0 areas:

1. **Core financial-flow integrity** — repaired and regression-tested.
2. **Direct-user validation** — Round 01 remains operationally ready but still has `0` verified sessions.
3. **Measurement discipline** — canonical measurement framework added, while all unsupported outcomes remain explicitly unmeasured.

## P0 — fix before presenting Nova as flagship

### P0.1 — Transfer must respect the Safe-to-spend decision model

**Evidence:** `VERIFIED`

Original gap:

The prototype allowed a transfer above Safe to spend as long as it remained below total account balance, while review/recovery copy could imply known bills and the protected buffer remained covered.

Implemented behavior:

- amounts above total balance remain invalid;
- amounts above Safe to spend remain possible in the prototype, but are explicitly flagged as using money currently allocated to commitments/buffer;
- the user must acknowledge that consequence before biometric confirmation;
- review and recovery states show an explicit plan shortfall instead of pretending the protected allocation still fits;
- failed-authentication/offline recovery explicitly states that no transfer has been made.

Status: `DONE_VERIFIED`

Verification:

- browser regression coverage for within-safe, above-safe and above-balance transfer paths;
- above-safe recovery coverage through biometric failure;
- Nova Visual QA passed on the merged `main` commit.

### P0.2 — Transfer receipt must preserve the reviewed amount

**Evidence:** `VERIFIED`

Original gap:

The success receipt could fall back to the default transfer amount/reference instead of preserving user-entered values.

Implemented behavior:

`amount entry -> review -> confirm -> receipt` preserves the same amount and reference.

Status: `DONE_VERIFIED`

Verification:

Regression test covers a custom amount/reference through successful receipt.

### P0.3 — Real-user validation is still missing

**Evidence:** `VERIFIED`

Round 01 is in `RECRUITING / PLANNED_VALIDATION` with `0` verified sessions.

Allowed claim:

> A moderated usability study has been designed and is ready to recruit.

Forbidden until evidence exists:

- Nova has been validated by users;
- Money Horizon improves confidence;
- task success improved;
- users prefer Nova;
- conversion, retention, adoption or business impact claims.

Status: `BLOCKED_EXTERNAL_EVIDENCE`

Tracking:

- GitHub issue #29 — `P0: Run Nova usability validation Round 01`.

Exit condition:

At least one anonymized real session must be committed before any `DIRECT_USER` finding can exist. Complete the intended five-participant Round 01 before treating the round itself as complete.

### P0.4 — Metrics must be a framework, not fabricated impact

**Evidence:** `VERIFIED`

Implemented:

`docs/uiux/MEASUREMENT-FRAMEWORK.md` now defines:

- product outcome hypotheses;
- user-behavior metrics;
- guardrail metrics;
- prototype usability measures;
- event taxonomy;
- explicit `NOT_MEASURED` status for metrics without real data;
- anti-metric rules preventing prototype evidence from being presented as production impact.

Status: `DONE_VERIFIED`

Important boundary:

The framework is complete; the product outcomes are **not measured yet**.

## P1 — next after P0

### P1.1 — Make state handling native rather than primarily recruiter-injected

The Recruiter State Lab is useful and has rendered QA for Normal / Empty / Loading / Error / Edge. However, Empty/Loading/Edge are forced by a review wrapper rather than owned by the core product state model.

Next step:

- expose native product state inputs in the app data/state layer;
- keep the State Lab as a controller, not the place where product behavior is invented;
- cover stale data, account-link failure and overcommitted Money Horizon from the same state model used by the product UI.

### P1.2 — Activity search and filters should change results

Current search/filter controls are present, but the prototype should demonstrate at least one functional filter and a zero-result state rather than only acknowledging clicks.

### P1.3 — Transfer impact preview should react before submit

The amount screen should recalculate the visible projected Safe to spend as the amount changes, including above-safe warning state before review.

### P1.4 — Card controls and limits need state persistence + invalid input handling

Switches and limit editing currently demonstrate UI feedback, but deeper product behavior should include:

- persisted prototype state;
- invalid/too-high/too-low limit handling;
- conflict between frozen/system-restricted card state and user-editable controls.

### P1.5 — Savings contribution preview should actually recompute Money Horizon

The current CTA explains that a contribution change would recompose the forecast; the prototype should visibly show that recomposition.

### P1.6 — Manual accessibility evidence

Automated axe/render checks are useful but not a conformance claim. Add a small manual evidence record for:

- keyboard-only critical flows;
- focus order;
- zoom/text scaling;
- screen-reader labels for Money Horizon and dialogs;
- reduced motion.

## P2 — cleanup / maintainability / portfolio clarity

### P2.1 — Collapse legacy visual override layers

`app.html` loads many historical CSS/JS passes. The rendered result can pass while ownership is difficult to understand during handoff.

Goal:

- one canonical current visual layer;
- one canonical current interaction layer;
- historical experiments archived or removed from runtime.

### P2.2 — Remove source-level Nova/Ledger identity drift

Runtime brand-fix scripts convert visible Ledger labels to Nova, but canonical source should not depend on repair scripts for product identity.

### P2.3 — Refresh stale phase ledger language

Some early phase documents still describe QA/PR/deploy as future work even though later A13/state-lab evidence exists. Preserve historical records, but add current superseding status instead of leaving ambiguous lifecycle truth.

### P2.4 — Add explicit design-decision / rejected-alternative evidence to the portfolio surface

The handoff contract asks for trade-offs, but recruiter-visible material should clearly show at least:

- balance-first vs Money Horizon;
- speed vs transfer review safety;
- protection vs recovery friction;
- confidence vs false certainty.

## Category summary

| Area | Current state | Priority |
|---|---|---|
| Product thinking | Strong hypothesis + benchmark synthesis; still needs direct-user learning loop | P0/P1 |
| UX states | Broad documented coverage; native ownership incomplete | P1 |
| Edge cases | Transfer/recovery P0 repaired; deepen cross-state conflicts | P1 |
| Validation | Protocol ready, 0 verified sessions | P0 — blocked on real participants |
| Metrics | Canonical framework exists; outcomes remain NOT_MEASURED | P0 technical done |
| Accessibility | Automated/render checks strong; manual evidence incomplete | P1 |
| Handoff | Strong source-backed contract; runtime layering is hard to hand off | P2 |
| Prototype | Core transfer integrity repaired and browser-regression-tested | P0 technical done |

## Portfolio truth statement

Until Round 01 produces real session evidence, Nova should be presented as:

> An independent consumer-finance product concept and interactive prototype. Product decisions are grounded in benchmark research and explicit hypotheses; technical product logic is regression-tested, while usability validation is planned/recruiting and not yet completed.

Do not convert this into a commercial impact case until real commercial/product evidence exists.
