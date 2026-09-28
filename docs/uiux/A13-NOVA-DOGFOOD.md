# A13 — Nova UIUX Factory Dogfood

Status: `CANDIDATE_PASS` pending final PR/main CI after this report commit.

## Purpose

A13 uses Nova as a real-project integration target for the post-A12 UIUX Factory. The goal is not to claim autonomous redesign; it is to verify that the current Factory can resolve a real product repository through the canonical Flow OS and then validate the rendered product through the same pinned Factory revision without weakening evidence gates.

## Pinned Factory revision

```text
Ngh1aa/uiux-ai-workspace
a9b74f354c485f8b61635755704342205083bb13
```

This revision contains A8.5 through A12 and is pinned by commit SHA in `.github/workflows/nova-cloud-qa.yml` for reproducibility.

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

The canonical managed planner resolves:

```text
flow: professional-website-redesign
active_stage: research
stage_count: 4
```

The generated managed-plan JSON is retained in the Nova Visual QA artifact as `a13-managed-plan.json`.

## Real failures found by dogfooding

### 1. Task/Flow mismatch

The first A13 run used `intent=improve` with `change_surface=PRODUCT`.

The canonical resolver correctly failed closed because no declarative Flow matched that contract. The existing focused-improvement Flow is scoped to `FOCUSED`, while the professional redesign Flow accepts a product redesign.

Resolution: the dogfood task was corrected to the truthful intent `redesign`. No Flow matcher or gate was weakened just to make Nova pass.

### 2. Cross-origin font dependencies

After planning succeeded, browser evidence failed on the primary Nova screens because two CSS files imported Google Fonts from `fonts.googleapis.com`.

Affected imports existed in:

- `assets/nova-redesign.css`
- `assets/nova-financial-intelligence.css`

A9 same-origin browser evidence correctly blocked those requests.

Resolution: remove only the two remote `@import` lines and keep the existing local/system fallback font stacks. No browser network allowlist was broadened.

## Passing evidence

Final clean PR run:

```text
Nova Visual QA #157
GitHub Actions run: 36459138391
head: c9e7e336f2120d1ad16c13c5d8635e1bdb6629cc
conclusion: success
```

The clean run passed:

- canonical managed Flow OS planning against the checked-out Nova repository;
- Factory dependency setup;
- accessibility QA;
- same-origin browser evidence capture across the configured Nova routes;
- media QA;
- Nova product-flow Playwright tests;
- QA artifact upload.

Configured rendered routes include the primary banking screens plus the prototype/design evidence surfaces:

```text
/app.html?screen=home
/app.html?screen=activity
/app.html?screen=transaction-detail
/app.html?screen=cards
/app.html?screen=transfer-review
/app.html?screen=savings
/app.html?screen=kyc
/prototype.html
/design-system.html
/component-states.html
/sitemap.html
/user-flows.html
```

## What A13 proves

A13 proves that the current pinned Factory can be consumed by an external real project and can:

1. normalize a real Nova task into the canonical managed Flow OS;
2. fail closed when the task contract does not match a Flow;
3. resolve a valid Nova redesign through the declarative routing layer;
4. run deterministic rendered QA against Nova rather than fixtures;
5. detect a real cross-origin production dependency in the primary UI;
6. remain strict while the project is fixed at the source;
7. pass planning and rendered verification together after remediation.

## What A13 does not prove

This slice does **not** claim that an external LLM/provider autonomously implemented Nova changes end to end.

The CI dogfood runs the managed planner with `read_only` authority and deterministic browser/flow QA. No paid/external provider execution is required, and no external Vision Creative Director analyzer is configured in this run.

Therefore A13 must not be cited as evidence that:

- provider-authored implementation was executed autonomously;
- automated vision produced an authoritative aesthetic PASS;
- a model approved merge, deploy or release;
- human Creative Director review occurred when it did not.

Those boundaries remain owned by the existing Factory authority/evidence contracts.

## Acceptance

A13 may be changed from `CANDIDATE_PASS` to `PASSED` only after this report commit passes PR CI, the PR is merged, and Nova `main` passes the same workflow on the merge commit.
