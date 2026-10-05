# Nova — Personal Banking & Money Planning

Nova is a portfolio-grade consumer fintech prototype focused on **safe-to-spend decision support**, Money Horizon planning, transaction trust, card controls, transfers, savings, subscriptions, KYC and recovery.

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

## Current status

Start with `docs/uiux/Phase-State.md` for the canonical current project/evidence state. Dated audit and research documents are retained as historical snapshots and should not override that ledger when their old “current/next/pending” language has been superseded.

Current delivery state:

- P0 product-integrity work: `DONE_VERIFIED`
- P1 interaction/state/accessibility work: `DONE_VERIFIED`
- P2.1 runtime consolidation: `DONE_VERIFIED`
- P2.2 canonical Nova identity source: `DONE_VERIFIED`
- P2.3 phase/status ledger refresh: in verification
- P2.4 design-decision / rejected-alternative evidence: next planned portfolio-clarity task

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
