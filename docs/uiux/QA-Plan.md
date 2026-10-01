# NOVA — QA Contract & Current Evidence

Nova has an active cloud QA pipeline on `Ngh1aa/Nova`. This document describes the continuing verification contract; it is not a future-only plan.

## Canonical toolchain

`.github/workflows/nova-cloud-qa.yml` checks out the pinned `Ngh1aa/uiux-ai-workspace` revision and runs the canonical Flow OS against the actual Nova repository.

Factory pin: `11003bf36909b08c3def617023dc8ecd9c3964fd`

Before browser QA the workflow also verifies deterministic canonical-runtime generation.

## Current evidence baseline

P2.4 recruiter-evidence work passed the full branch gate before canonical ledger promotion:

- PR `#73`;
- Nova Visual QA / Actions run `36840448193`: `SUCCESS`;
- generated-runtime sync: `SUCCESS`;
- pinned UIUX Factory Flow OS dogfood: `SUCCESS`;
- rendered/browser/accessibility/product regression suite: `SUCCESS`;
- responsive P2.4 section screenshots captured at 1440 / 768 / 390;
- mobile/tablet six-link evidence navigation repaired to remain on one row.

A final branch run is still required after current-status ledger updates, followed by canonical-main release confirmation after merge.

## Representative routes

The cloud workflow covers primary product, lifecycle and evidence surfaces including:

- `/app.html?screen=home`
- `/app.html?screen=home&state=empty&pin=1`
- `/app.html?screen=home&state=loading&pin=1`
- `/app.html?screen=home&state=edge&pin=1`
- `/app.html?screen=error`
- `/app.html?screen=activity`
- `/app.html?screen=transaction-detail`
- `/app.html?screen=report-transaction`
- `/app.html?screen=report-transaction&state=handoff`
- `/app.html?screen=cards`
- `/app.html?screen=transfer-recipient`
- `/app.html?screen=transfer-amount`
- `/app.html?screen=transfer-review`
- `/app.html?screen=biometric-failed`
- `/app.html?screen=offline`
- `/app.html?screen=transfer-success`
- `/app.html?screen=savings`
- `/app.html?screen=savings-detail`
- `/app.html?screen=kyc`
- `/recruiter-state-lab.html?state=empty`
- `/state-matrix.html`
- `/prototype.html`
- `/design-decisions.html`
- `/design-system.html`
- `/component-states.html`
- `/sitemap.html`
- `/user-flows.html`

## Protected product journeys

### Suspicious transaction / protection

1. Open Home and inspect an unusual transaction.
2. Open Transaction Detail.
3. Verify Freeze and Report remain distinct actions with explicit simulated/no-bank-contact boundaries.
4. Verify freeze/recovery state remains consistent across relevant card surfaces.

### Transfer

1. Search/select recipient.
2. Enter amount and inspect live Safe-to-spend / balance impact.
3. Review recipient, amount, reference and protected-buffer rule.
4. Exercise biometric/passcode or offline/revalidation recovery.
5. Verify `NO MONEY MOVED` truth until simulated confirmation.
6. Verify receipt preserves reviewed identity and amount.

### Savings / Money Horizon

- validate contribution inputs;
- preview normal, paused and overcommitted states;
- preserve protected-buffer semantics;
- keep negative Safe-to-spend visible where the calculation is negative.

### Lifecycle / KYC

- direct Empty / Loading / Error / Edge routes;
- Empty and Loading recovery behavior;
- KYC capture retry/manual-review behavior.

### Recruiter decision surface

- public page exposes exactly 3 decision stories;
- internal record retains 7 decisions;
- each public story includes problem/constraint, decision, rejected alternative, trade-off, evidence and remaining uncertainty;
- public evidence labels are restricted to the lean vocabulary and only used when supported;
- optional deep evidence remains secondary to the three-story recruiter scan.

## Accessibility evidence

Regression protects representative browser-assisted evidence for Axe findings, keyboard reachability, visible focus, enlarged-content reflow, reduced motion and representative Chromium Accessibility Tree semantics.

This is **not** a WCAG conformance certification and does not substitute for hands-on NVDA/JAWS/VoiceOver/TalkBack testing.

## Responsive / visual review rule

After a material visual change, inspect rendered evidence at representative desktop/tablet/mobile widths for hierarchy, overflow, clipping, state differentiation and interaction quality.

P2.4 rendered evidence was inspected at 1440 / 768 / 390. The inspection caught a real mobile/tablet navigation layout defect; the owning shared evidence stylesheet was repaired before the gate was rerun.

Documentation-only ledger changes do not create a new pixel-quality claim, but the normal rendered QA still reruns as a regression guard.

## Runtime / integrity gates

- regenerate canonical renderer/styles and fail on drift;
- no broken critical assets or uncaught exceptions;
- no unexpected document-level horizontal overflow on protected routes;
- critical controls remain reachable and named;
- canonical renderer/state/style owners remain unique;
- P2.2 Nova identity regression stays green;
- P2.3 historical/current-status contracts remain consistent;
- P2.4 lean recruiter surface and completed status remain regression-protected.

## Research-truth gate

QA may verify wording, states and evidence labels. QA must **not** promote research method or outcome claims.

Current boundary:

- Round 01: 5 verified direct-user self-report records / 0 moderated sessions.
- Round 02: 5 NEW verified async retest self-report records / 0 moderated sessions.
- latest D-01…D-04 changes: implemented / not human-retested.
- no observed task-success/time-on-task improvement claim.
- no causal, conversion, retention or production-impact claim.
- QA/CI is **prototype / technical evidence**, not usability validation.

## Human visual veto

For material UI changes, review as Design Director / Product Designer / recruiter / end user:

- Is Safe to spend the first decision visible?
- Does Money Horizon read as finance information rather than decoration?
- Is the suspicious-transaction flow urgent but calm?
- Are Freeze/Report consequences and simulated boundaries clear?
- Does transfer impact explain protected-buffer behavior without false certainty?
- Does desktop remain a consumer product rather than a generic dashboard?
- Are states visibly different without relying on color alone?
- Are text and controls readable on representative surfaces/states?
- Can a recruiter understand the three P2.4 stories without reading the seven-decision deep record?

Material REVISE/REMOVE findings return to the owning layer and require new evidence.
