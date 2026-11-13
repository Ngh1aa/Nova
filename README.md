# Nova — Personal Banking & Money Planning

Nova is a portfolio-grade consumer fintech prototype focused on **safe-to-spend decision support**, Money Horizon planning, transaction trust, card controls, transfers, savings, subscriptions, KYC and recovery.

## Live product

**Entry URL for the portfolio:** https://nova-gamma-eosin.vercel.app/ (the root redirects to `app.html?screen=home`). Visitors land signed in as Alex Nguyen. *Settings → Sign out* shows the sign-in screen (`signin.html`), which offers *Continue as Alex Nguyen* or email `alex.nguyen@novamail.app` with passcode `2468`.

The product UI carries no prototype labels; one footer line credits the concept. Evidence and documentation pages (`prototype.html`, `recruiter-state-lab.html`, `design-system.html`, `state-matrix.html`, `figma-export/` and the rest) are still deployed but are not linked from the product. Demo tools: see `?demo=1` below.

## Prototype

### HTML to Figma captures

Open `/figma-export/` for the agreed 70-screen catalogue, copy URLs and set the converter viewport to 1440 / 1024 / 768 / 390. Numbered capture routes reuse the canonical Nova renderer with deterministic, isolated state. See `docs/FIGMA-EXPORT-70.md` and `figma-export/manifest.json` for the source audit, states, viewport coverage and expected production URLs. Local readiness and public deployment are recorded separately; Figma import quality remains unverified until the converter output is inspected.

Open `prototype.html` for the guided recruiter demo, or `app.html?screen=home` for the product.

### Core demo flows

- Home → suspicious transaction → transaction detail → freeze/report decision → truthful simulated result
- Home → transfer → recipient → amount → review → biometric/passcode recovery → success
- Failure/recovery: insufficient balance, offline, biometric failed, revalidation
- Onboarding/KYC: capture guidance, quality failure, manual-review recovery
- Native lifecycle evidence: Empty, Loading, Error and overcommitted Edge states

### Complete workflows (feature/full-prototype)

Every control does something; only the backend is missing. All changes are kept in **sessionStorage** for the current tab, seeded from one file, `assets/nova-demo-data.js`, through `assets/nova-store.js`. The workflows live in `assets/nova-workflows.js` (styles in `assets/nova-ui/workflows.css`).

- **Payees** (`?screen=payees`): add with IBAN checksum validation, view, edit, delete, search, empty and not-found states.
- **Scheduled and recurring transfers** (`?screen=scheduled`): create, view, edit, cancel, restore, remove.
- **Cards**: freeze, payment-channel controls, daily / cash / contactless limits, replacement (lost or stolen also freezes), passcode-gated PIN reveal.
- **Savings goals**: create, add money, withdraw, edit, delete, goal activity, empty state.
- **Subscriptions**: pause, resume, cancel (after confirming the merchant cancellation) and restore.
- **Notifications**: unread state, mark read / unread / all, dismiss, empty state, link to preferences.
- **Settings**: profile edit with inline validation, date format, notification preferences.
- **Security**: trusted devices, sign out one or all other devices, passcode change rules, activity log.
- **Activity**: search, filters and **dispute drafts** (`?screen=disputes`). Drafts are never sent, in line with the D-02 report boundary.

**Demo tools** (hidden from visitors): add `?demo=1` to any app URL, e.g. `app.html?screen=settings&demo=1`. A small floating **Demo tools** panel then offers **Reset demo data**, **Simulate a failed request** (fail the next request or every request) and the demo passcode, so you can see each flow’s loading and recoverable-error states. The flag stays on for the tab; `?demo=0` turns it off. With demo tools on, the transfer confirmation also offers *Simulate failure* and KYC offers *Simulate quality issue*. `&state=loading&pin=1` and `&state=error` pin those states on the workflow screens. Money never moves.

QA: `qa/full-prototype.spec.mjs` covers each flow and the reset. `scripts/control-inventory.cjs` clicks every visible control on each route and reports controls that do nothing or point to `#`.

## Current status

Start with `docs/uiux/Phase-State.md` for the canonical current project/evidence state. Dated audit and research documents are retained as historical snapshots and should not override that ledger when their old “current/next/pending” language has been superseded.

Current delivery state:

- P0 product-integrity work: `DONE_VERIFIED`
- P1 interaction/state/accessibility work: `DONE_VERIFIED`
- P2.1 runtime consolidation: `DONE_VERIFIED`
- P2.2 canonical Nova identity source: `DONE_VERIFIED`
- P2.3 phase/status ledger refresh: in verification
- P2.4 design-decision / rejected-alternative evidence: next planned portfolio-clarity task

## Current visual layer

Pastel iOS redesign (2026-10-26): one token-driven stylesheet in `assets/nova-ui/` (tokens, shell, components, screens), bundled into `assets/nova-current.css` by `scripts/p2-1b-consolidate-runtime.mjs`. Ownership, DNA and QA: `docs/redesign/NOVA-PASTEL-IOS-2026-10-26.md`.

## Product evidence

- `design-system.html`
- `component-states.html`
- `sitemap.html`
- `user-flows.html`
- `prototype.html`
- `docs/uiux/Phase-State.md` — canonical current status
- `docs/uiux/` — research, design contracts, state contracts, QA and dated evidence
- `docs/FIGMA-HANDOFF-SPEC.md` — reviewer-ready handoff structure and research-method boundary

## Direct-user evidence

Nova now has **10 verified direct-user/self-report records across two rounds**, but neither round was a moderated usability study.

### Round 01

- 5 eligible real users
- unmoderated task-based prototype evaluation with consented self-report
- 5 verified direct-user self-report records
- 0 moderated sessions
- evidence informed D-01 through D-04 iteration decisions

### Round 02

- 5 NEW eligible participants
- asynchronous structured self-report retest on the frozen post-iteration build
- 5 verified async retest records
- 0 moderated sessions
- cross-round differences are cross-sectional self-report signals, not causal within-subject effects

Round 02 showed that transfer arithmetic was understood by all five respondents, while the 14-day horizon, protected-buffer behavior, sensitive-action truth boundary and no-money-moved clarity remained unresolved or mixed. The latest D-01 through D-04 implementation pass is **implemented but not human-retested**.

Research sources:

- `research/validation/nova-round-01/status.json`
- `research/validation/nova-round-01/evidence-ledger.jsonl`
- `research/validation/nova-round-02/status.json`
- `research/validation/nova-round-02/evidence-ledger.jsonl`
- `research/validation/nova-round-02/RETEST-SYNTHESIS.md`
- `research/validation/nova-round-02/DECISION-LOG.md`

Allowed claims are method-specific: verified direct-user/self-report records, evidence-informed iterations and cross-sectional self-report signals. Do **not** claim five moderated sessions, observed task-success/time improvements, causal improvement/regression, overall validated usability, conversion, retention, fraud reduction or production impact.

## Runtime / QA

The live app uses canonical generated runtime ownership rather than the old independent override chain:

- `assets/nova-current-renderer.js` — canonical generated renderer
- `assets/nova-current-state.js` — canonical interaction/state owner
- `assets/nova-current.css` — canonical stylesheet
- `assets/nova-motion.js` / `assets/nova-motion.css` — separate motion concern

`.github/workflows/nova-cloud-qa.yml` checks the generated runtime, dogfoods the pinned `Ngh1aa/uiux-ai-workspace` Flow OS, runs rendered/browser/accessibility QA and executes Nova regression suites.

## Reality boundary

All account values and banking operations are **prototype data / simulated behavior**. No production banking service is connected. No conversion, retention, usability improvement, financial outcome or commercial impact is claimed without retained evidence appropriate to that claim.
