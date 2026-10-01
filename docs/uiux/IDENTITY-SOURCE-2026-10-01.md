# Nova — P2.2 Canonical Identity Source — 2026-10-01

## Status

`P2.2 — DONE_VERIFIED`

This task removes the remaining source-level Nova/Ledger identity drift without changing product behavior or claiming new user validation.

## Problem

P2.1 consolidated runtime ownership, but the generated canonical renderer still inherited legacy `Ledger` strings from the historical foundation source and relied on later DOM rewriting to present `Nova`.

That made the visible brand correct while the canonical source was not. It also allowed legacy `LDG_` transaction prefixes to exist upstream and be repaired after render.

## Decision

Canonical identity is now owned at generation time by `scripts/p2-1b-consolidate-runtime.mjs`.

The generator:

- compiles the historical `assets/nova.js` foundation into Nova-native canonical markup/text;
- converts the legacy `LDG_` transaction prefix to `NVA_` before runtime;
- emits the Nova logo markup directly into the canonical renderer;
- rejects generation if `Ledger` or `LDG_` remains in the canonical JavaScript bundle;
- no longer bundles `assets/nova-brand-fixes.js` as a runtime dependency.

`assets/nova.js` and `assets/nova-brand-fixes.js` remain historical provenance only. They are not the canonical identity owner.

## Runtime boundary

`assets/nova-redesign.js` keeps its typography/copy refinement responsibilities, but it no longer rewrites `Ledger → Nova` or `LDG_ → NVA_` at runtime.

`assets/nova-ios26.js` also no longer contains the former Ledger-specific aria-label repair. The canonical renderer supplies Nova identity before that visual/navigation layer runs.

No product-state rules, transfer logic, card persistence, savings calculations, lifecycle states or D-02 truth-boundary behavior are intentionally changed by P2.2.

## Acceptance criteria

All P2.2 acceptance criteria are now satisfied:

1. `assets/nova-current-renderer.js` contains no `Ledger` brand string and no `LDG_` prefix.
2. `assets/nova-redesign.js` contains no runtime identity replacement for `Ledger` or `LDG_`.
3. `assets/nova-brand-fixes.js` is absent from the generated runtime source list.
4. Representative Home, Onboarding, Cards, Transaction Detail, Pay, Savings and KYC routes render Nova identity directly.
5. Transaction Detail exposes the canonical `txn_NVA_9F2K7Q` reference.
6. Existing Nova product/regression/accessibility/rendered QA remains green.
7. UIUX Factory Flow OS still resolves and passes against the Nova target.

## Verification evidence

- PR: `#69 — Nova P2.2: make canonical runtime Nova-native`.
- Verification build: `3b06c0fbc70a3f80040e4efaa7da735214794640`.
- Nova Visual QA: workflow run `36824340628` / run number `311` — `SUCCESS`.
- Generated-runtime sync gate: `SUCCESS`.
- Pinned UIUX Factory Flow OS dogfood: `SUCCESS`.
- Full Playwright product/regression/accessibility/rendered QA, including `qa/identity-source.spec.mjs`: `SUCCESS`.
- Rendered evidence inspected for Home 1440, Cards 1440, Transaction Detail 1440 and KYC. Nova identity is present directly, the transaction reference is `txn_NVA_9F2K7Q`, and no visual regression attributable to P2.2 was observed.

## Claim boundary

Allowed:

> Nova has one canonical generated identity source; legacy Ledger branding remains only as historical provenance and is not repaired at runtime.

Not allowed:

- claiming this improves user comprehension;
- claiming user preference for the Nova brand;
- claiming production identity migration or banking-system integration;
- treating historical source cleanup as product validation.
