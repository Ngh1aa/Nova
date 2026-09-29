# Nova — Product Design Audit — 2026-09-29

## Audit intent

Audit Nova as a real Product Designer portfolio case without pretending commercial seniority or inventing validation, business impact, user quotes or production evidence.

Evidence states used here:

- `VERIFIED` — directly supported by repository implementation, test evidence or committed research artifacts.
- `INFERRED` — reasonable conclusion from evidence but not directly tested.
- `ASSUMED` — temporary product assumption.
- `UNKNOWN` — no reliable evidence exists yet.

## Executive result

Nova is already stronger than a typical visual concept: it has a product thesis, IA, exception/recovery flows, state contracts, responsive QA, handoff documentation and a real-user validation protocol. The largest remaining risk is not visual polish. It is whether the core product logic and evidence story stay truthful under deeper review.

The audit found three P0 areas:

1. **Core financial-flow integrity** — transfer behavior can contradict the Safe-to-spend promise and receipt state can drift from the amount actually reviewed.
2. **Direct-user validation** — Round 01 is operationally ready but still has `0` verified sessions. This cannot be closed by writing better copy or inventing findings.
3. **Measurement discipline** — Nova needs an explicit measurement framework separating prototype signals from hypothetical product outcomes.

## P0 — fix before presenting Nova as flagship

### P0.1 — Transfer must respect the Safe-to-spend decision model

**Evidence:** `VERIFIED`

Current behavior allows a transfer above Safe to spend as long as it remains below total account balance. The review copy can still imply known bills and protected buffer remain covered.

Why this matters:

- Safe to spend is Nova's primary product thesis.
- A finance prototype cannot teach one mental model on Home and silently ignore it during the highest-consequence flow.
- Blocking every above-safe transfer would also be an unsupported product policy.

Required behavior:

- amounts above total balance remain invalid;
- amounts above Safe to spend remain possible in the prototype, but are explicitly flagged as using money currently allocated to commitments/buffer;
- user must acknowledge the consequence before biometric confirmation;
- no copy may say protected obligations remain covered when the amount exceeds Safe to spend.

Status: `FIXING_ON_AUDIT_BRANCH`

### P0.2 — Transfer receipt must preserve the reviewed amount

**Evidence:** `VERIFIED`

The current success receipt uses the default transfer amount instead of the persisted amount entered by the user.

Required behavior:

`amount entry -> review -> confirm -> receipt` must preserve the same amount.

Status: `FIXING_ON_AUDIT_BRANCH`

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

Exit condition:

At least one anonymized real session must be committed before any direct-user finding can exist. The intended Round 01 target remains five eligible participants.

### P0.4 — Metrics must be a framework, not fabricated impact

**Evidence:** `VERIFIED_GAP`

Nova currently has strong product hypotheses and QA evidence but no canonical product measurement contract tying key decisions to observable outcomes.

Fix:

Add `docs/uiux/MEASUREMENT-FRAMEWORK.md` with:

- product outcome hypotheses;
- user-behavior metrics;
- guardrail metrics;
- prototype usability measures;
- event taxonomy;
- explicit `NOT_MEASURED` status for every metric that lacks real data.

Status: `FIXING_ON_AUDIT_BRANCH`

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
| Product thinking | Strong hypothesis + benchmark synthesis; needs real evidence loop | P0/P1 |
| UX states | Broad documented coverage; native ownership incomplete | P1 |
| Edge cases | Strong security/transfer/KYC coverage; deepen cross-state conflicts | P1 |
| Validation | Protocol ready, 0 verified sessions | P0 |
| Metrics | Missing canonical measurement contract | P0 |
| Accessibility | Automated/render checks strong; manual evidence incomplete | P1 |
| Handoff | Strong source-backed contract; runtime layering is hard to hand off | P2 |
| Prototype | Visually broad and testable; transfer integrity needs repair | P0 |

## Portfolio truth statement

Until Round 01 produces real session evidence, Nova should be presented as:

> An independent consumer-finance product concept and interactive prototype. Product decisions are grounded in benchmark research and explicit hypotheses; usability validation is planned/recruiting, not yet completed.

Do not convert this into a commercial impact case until real commercial/product evidence exists.
