# A13 — Nova UIUX Factory Dogfood

Status: `PASSED`

> This file records the original A13 integration slice and the current Nova/Factory integration status. `docs/uiux/Phase-State.md` remains the canonical project-status ledger.

## Purpose

A13 uses Nova as a real-project integration target for the UIUX Factory. The goal is not to claim autonomous redesign; it is to verify that the Factory can resolve a real product repository through the canonical Flow OS and validate the rendered product through a pinned Factory revision without weakening evidence gates.

## Original A13 pinned revision

```text
Ngh1aa/uiux-ai-workspace
a9b74f354c485f8b61635755704342205083bb13
```

That revision was the original A13 integration baseline.

## Current integration pin

Nova's live QA workflow now pins:

```text
Ngh1aa/uiux-ai-workspace
11003bf36909b08c3def617023dc8ecd9c3964fd
```

This is the current reproducible Factory source used by `.github/workflows/nova-cloud-qa.yml`.

## Dogfood task contract

```text
Goal: Redesign and validate the Nova personal banking interactive prototype across product flows and responsive visual quality
intent: redesign
change_surface: PRODUCT
domain: financial-services
validation_lane: evidence-led
mode: interactive-prototype
risk: high
features: payments, cards, savings
authority: read_only
```

The canonical managed planner resolves a valid Flow and routes skills before product QA. The generated managed-plan JSON is retained in Nova Visual QA artifacts as `a13-managed-plan.json`.

## Real failures found by dogfooding

### 1. Task/Flow mismatch

The first A13 run used `intent=improve` with `change_surface=PRODUCT`.

The canonical resolver correctly failed closed because no declarative Flow matched that contract. The existing focused-improvement Flow was scoped to `FOCUSED`, while the professional redesign Flow accepted a product redesign.

Resolution: the dogfood task was corrected to the truthful intent `redesign`. No Flow matcher or gate was weakened just to make Nova pass.

### 2. Cross-origin font dependencies

After planning succeeded, browser evidence failed on the primary Nova screens because CSS imported Google Fonts from `fonts.googleapis.com`.

Resolution: remove only the remote imports and keep the existing local/system fallback font stacks. No browser-network allowlist was broadened.

## Passing evidence

Original clean A13 PR run:

```text
Nova Visual QA #157
GitHub Actions run: 36459138391
head: c9e7e336f2120d1ad16c13c5d8635e1bdb6629cc
conclusion: success
```

A13 is no longer merely a candidate because the integration pattern continued to pass on merged `main` through later Nova work.

Current evidence before P2.3:

```text
Nova Visual QA #313
GitHub Actions run: 36825048721
main: d1e4c6a7c511825b32587b2e0993e85a30d79508
conclusion: success
Factory pin: 11003bf36909b08c3def617023dc8ecd9c3964fd
```

That run passed:

- generated canonical-runtime sync verification;
- canonical managed Flow OS planning against the checked-out Nova repository;
- Factory dependency setup;
- rendered browser/accessibility QA;
- Nova product/regression tests, including P2.2 identity ownership;
- QA artifact upload.

## What A13 proves

A13 proves that the pinned Factory integration can:

1. normalize a real Nova task into the canonical managed Flow OS;
2. fail closed when a task contract does not match a Flow;
3. resolve a valid Nova redesign through the declarative routing layer;
4. run deterministic rendered QA against Nova rather than fixtures;
5. detect real integration/runtime dependency problems;
6. remain strict while the project is fixed at the source;
7. pass planning and rendered verification together after remediation;
8. remain consumable by Nova across later product, accessibility and architecture work.

## What A13 does not prove

This evidence does **not** claim that an external LLM/provider autonomously implemented Nova end to end.

The CI dogfood uses `read_only` authority and deterministic planning/browser/flow QA. No paid/external provider execution is required and no external Vision Creative Director analyzer is implied.

Therefore A13 must not be cited as evidence that:

- provider-authored implementation was executed autonomously;
- automated vision produced an authoritative aesthetic PASS;
- a model approved merge, deploy or release;
- human Creative Director review occurred when it did not.

Those boundaries remain owned by the Factory authority/evidence contracts.
