# Nova — A32 Product / Recruiter Surface Audit

This audit applies the `website-audit-and-redesign` skill to Nova's interactive product and portfolio-evidence surfaces. Nova is not treated as a marketing website; the same audit method is used to identify source-of-truth drift, page-role mismatch and technical/design debt.

## Project truth

- Product: Nova — Personal Banking & Money Planning.
- Mode: responsive interactive prototype.
- Domain: consumer fintech / personal banking.
- Core thesis: help people decide what money is truly safe to spend after known commitments, planned savings and a protected buffer.
- Current active art direction: iOS 26 Financial Workspace — native / calm / precise / fluid / premium.
- System reality: account values, banking, risk, KYC, biometrics and payments are simulated.
- Validation state: Round 01 recruiting / planned; 0 verified sessions.

## Surface inventory

| Surface | Role | Current state | Decision |
| --- | --- | --- | --- |
| `app.html` | Product runtime shell | Active product entry; loads current product implementation | KEEP / simplify ownership later |
| `prototype.html` | Recruiter orientation / guided demo | **Stale narrative**: still describes retired “Modern Daybook” / editorial direction | IMPROVE NOW |
| `design-system.html` | System evidence | Mostly aligned to current iOS-inspired system | KEEP / verify terminology |
| `component-states.html` | State/recovery evidence | Strong coverage of trust and exception states | KEEP |
| `sitemap.html` | IA evidence | Product navigation / route evidence | KEEP / verify against runtime |
| `user-flows.html` | Journey evidence | Core protection, transfer and recovery flow evidence | KEEP / verify against runtime |
| `research/validation/nova-round-01/` | Research evidence | Operational package prepared; 0 verified sessions | KEEP / human gate |
| `docs/FIGMA-HANDOFF-SPEC.md` | Handoff contract | Source-backed spec; actual Figma restructure not yet verified | KEEP / external gate |

## Owner goal ↔ user goal

| Owner / portfolio wants to prove | Product user wants to do | Intersection | Artifact responsibility | Proof needed |
| --- | --- | --- | --- | --- |
| Product strategy, not only polished UI | Know what is safe to spend | Money Horizon product model | Product + recruiter index | Calculation logic, consequence copy, state model |
| Trust and high-consequence UX | Resolve unusual activity | Evidence before protection action | Transaction detail / freeze flow | Facts, reversible action, accurate freeze consequence |
| Systems thinking | Move money without losing context | End-to-end task + recovery | Transfer flow | happy path + insufficient/offline/auth failure |
| Design-system depth | Understand consistent states | Predictable state language | Design system / component states | reusable visual/state grammar |
| Evidence discipline | Know which claims are real | No fake banking / fake validation | All recruiter surfaces | explicit simulated / planned labels |

## Material findings

### P0 — Recruiter entry narrative contradicts active source of truth

**Evidence**

`prototype.html` currently uses “Modern Daybook — interactive prototype”, “Accountable / Editorial / Tactile”, and daybook / ledger composition language. The active `PROJECT-CONTEXT.md` and `Nova-iOS26-Design-Contract-2026.md` explicitly say the previous warm-ledger / editorial direction is historical and must not control the implementation.

**Impact**

A recruiter can open the intended guided demo and receive the wrong explanation of the product's current design direction. This weakens decision credibility even if the product screens are visually current.

**Root owner**

`prototype.html` recruiter narrative.

**Decision**

Rewrite the recruiter index around the current Product Thesis, iOS 26 Financial Workspace, senior decision evidence, state/recovery depth and validation boundary.

### P1 — Runtime ownership is fragmented across many historical CSS/JS layers

**Evidence**

`app.html` loads multiple generations of Ledger, redesign, iOS26, pastel, dashboard and system-v3/v4/v5 CSS plus several JavaScript override layers.

**Impact**

The rendered artifact can still be correct, but ownership is difficult to reason about and future fixes risk patch-on-patch behavior. This is implementation debt, not proof that the current UX is broken.

**Root owner**

Runtime asset architecture.

**Decision**

Do not add another visual override layer in A32. Record consolidation as a separate implementation task after recruiter/source truth is repaired and a baseline visual diff can protect against accidental regression.

### P1 — Direct-user evidence is intentionally absent

**Evidence**

Round 01 remains recruiting/planned with 0 verified sessions.

**Impact**

Nova can prove product reasoning, working states and QA, but cannot yet prove comprehension or usability outcomes.

**Root owner**

Human research gate, not UI code.

**Decision**

Keep validation claims explicitly planned. Do not use the lack of sessions as a reason to invent metrics.

### P1 — Figma handoff depth is specified but not verified in the actual file

**Evidence**

The repo contains `docs/FIGMA-HANDOFF-SPEC.md`; the external Figma gate remains open.

**Impact**

The repository can prove the desired handoff system but not that the current editable Figma file implements every 00–10 page/state requirement.

**Decision**

Keep the distinction visible; no fake “Figma complete” claim.

## Preserve list

- Money Horizon and safe-to-spend product thesis.
- Unusual-transaction → evidence → freeze flow.
- Transfer review with visible projected impact.
- Offline, biometric, insufficient-funds and KYC recovery.
- Explicit simulation language.
- Current iOS-inspired visual system and responsive composition.
- Existing component-state evidence and QA coverage.
- Research evidence boundary and 0-session truth.

## Visible A32 delta

| Current visible problem | New behavior | Verification |
| --- | --- | --- |
| Recruiter index explains retired Modern Daybook / editorial direction | Recruiter index explains the current Financial Workspace thesis and signature moments | raw-source assertion + browser check |
| Prototype entry reads like a style showcase | Entry exposes Product thesis, Role/Mode, constraints, decisions, state depth, evidence status and guided tasks | content assertion |
| Validation boundary is buried in README/research folder | Recruiter entry shows `PLANNED_VALIDATION · 0 verified sessions` without implying failure | content assertion |
| Historical narrative can silently return | QA rejects `Modern Daybook` / retired primary narrative in `prototype.html` | regression test |

## A32 scope

### Implement now

1. Rewrite `prototype.html` to current source of truth.
2. Add explicit recruiter scan blocks for thesis, decisions, constraints, working proof and evidence state.
3. Preserve direct links to the strongest product flows and evidence pages.
4. Add QA that prevents historical art-direction drift.
5. Keep runtime product visuals untouched unless QA exposes a product defect.

### Defer to a separate technical cleanup

- CSS/JS layer consolidation in `app.html`.
- Actual Figma 00–10 restructure.
- Direct-user findings until real sessions exist.

## Acceptance criteria

- The guided prototype no longer presents Modern Daybook / editorial as the active direction.
- The first viewport explains the current Nova product thesis and simulation boundary.
- A recruiter can identify product problem, primary decisions, recovery depth and evidence state without opening source docs.
- No user-validation result is invented.
- Existing product routes remain unchanged.
- QA explicitly guards current narrative ownership.
