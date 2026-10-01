# Nova P2.4 — Design Decisions, Rejected Alternatives & Trade-offs

Status: `IMPLEMENTED / RECRUITER_VISIBLE / QA_PENDING`

> This is a portfolio-facing decision record, not a claim that every decision has been validated with moderated users or production data. Current research and impact boundaries remain governed by `docs/uiux/Phase-State.md`.

## Why this artifact exists

Nova already exposes polished UI, product states, research records and QA evidence. P2.4 makes the **reasoning between those artifacts explicit** so a reviewer can see what was chosen, what was deliberately rejected, what each choice costs, and which claims remain open.

A decision only appears here when it is traceable to the current product contract, implementation, research evidence or verified QA history. This file does not invent business outcomes, preference claims or retrospective certainty.

## Recruiter scan

| ID | Decision | Chosen direction | Rejected alternative | Core trade-off | Current evidence state |
|---|---|---|---|---|---|
| P24-D01 | Money model | Safe-to-spend + 14-day Money Horizon leads; raw balance is supporting context | Raw-balance hero, interchangeable KPI dashboard, unexplained health score | More explanation in exchange for a more decision-useful model | Implemented; 14-day clarity iteration QA-verified, not human-retested |
| P24-D02 | Transfer guardrail | Allow transfers above Safe to spend only with explicit plan-shortfall consequence + acknowledgement; block above total balance | Hard-block everything above Safe to spend, or silently allow it | User autonomy vs. protective friction | Product-integrity behavior verified in regression QA |
| P24-D03 | Protected buffer | Keep the buffer reserved by default and state the rule at the transfer decision point | Automatically consume the buffer or hide the rule inside a formula | Conservative planning vs. maximum immediately spendable amount | Round 02-informed iteration implemented; not human-retested |
| P24-D04 | Sensitive actions | Separate Freeze and Report with distinct consequences and `DEMO ONLY · NO BANK CONTACT` truth boundary | One combined protection action or bank-contact implication | More UI/copy vs. lower consequence ambiguity | Round 02-informed iteration implemented; not human-retested |
| P24-D05 | Failure recovery | Lead with `NO MONEY MOVED`, concrete cause and unchanged balance; keep retry/passcode secondary | Generic error + primary retry, silent resend, or completion ambiguity | Slightly slower recovery vs. stronger money-movement certainty | Round 02-informed iteration implemented; not human-retested |
| P24-D06 | Prototype scope | Saved recipients only; preserve selected identity end-to-end | Fake/nonfunctional Add recipient or silently default every transfer to Maya | Narrower scope vs. higher prototype credibility | Recipient continuity and scope boundary regression-verified |
| P24-D07 | Visual direction | iOS 26 Financial Workspace: content-first, calm, precise, responsive, restrained glass chrome | Warm ledger/editorial theme, generic SaaS sidebar/dashboard-card grid | Less decorative distinctiveness vs. modern platform familiarity and spacious responsiveness | Active visual contract + rendered QA baseline |

---

## P24-D01 — Lead with Safe to spend, not raw balance

### Product question

What should Nova answer first when the user opens the app: **“How much money do I have?”** or **“How much is actually safe to spend after near-term commitments?”**

### Chosen direction

- Safe to spend is the primary home decision.
- Money Horizon makes the next 14 days, known commitments, planned savings and protected buffer visible around that number.
- Raw account balance remains available as supporting context rather than the product thesis.

### Rejected alternatives

1. **Raw balance as the hero.** Rejected because balance alone does not account for money already allocated to bills, goals or reserve.
2. **A 4-up KPI dashboard.** Rejected because it fragments the decision into interchangeable fintech cards and weakens the single product question.
3. **An unexplained financial-health score.** Rejected because a score without transparent inputs creates false authority.

### Trade-off accepted

Safe-to-spend is more useful only if the horizon and calculation remain understandable. The product therefore accepts extra explanatory work: visible horizon language, commitment context and explicit estimate boundaries.

### Evidence

- `PROJECT-CONTEXT.md` — current product thesis and five core user problems.
- `docs/uiux/Nova-iOS26-Design-Contract-2026.md` — Safe-to-spend hero + 14-day Money Horizon as current signature.
- `research/validation/nova-round-02/DECISION-LOG.md` — D-01 remained unresolved after Round 02; the exact `next 14 days` language was promoted.
- `docs/uiux/NOVA-PHASE3-CLARITY-ITERATION.md` — the latest 14-day language is implemented and QA-verified, not human-retested.

### What remains open

Do not claim that the 14-day model is now understood better by users without a compatible human retest.

---

## P24-D02 — Guardrail above Safe to spend; hard block only above total balance

### Product question

Should Nova prevent a user from sending money simply because the transfer exceeds the planning amount, even when the account balance can cover it?

### Chosen direction

- Amounts above total balance are invalid and blocked.
- Amounts above Safe to spend remain possible in the prototype.
- Before confirmation, Nova exposes the plan shortfall and requires explicit acknowledgement that the transfer uses money allocated to the plan.
- Review and recovery preserve the same consequence state.

### Rejected alternatives

1. **Hard-block every transfer above Safe to spend.** Rejected because Safe to spend is a planning model, not the user's legal account balance.
2. **Allow the transfer with no additional consequence.** Rejected because it would turn the planning model into decorative UI exactly when it matters.

### Trade-off accepted

Nova chooses **agency with friction** over either paternalistic blocking or consequence-free speed. That adds one decision step, but keeps the difference between liquidity and planned affordability visible.

### Evidence

- `docs/uiux/PRODUCT-DESIGN-AUDIT-2026-09-29.md` — P0.1 transfer integrity and plan-shortfall behavior.
- `qa/product-integrity.spec.mjs` and `qa/transfer-impact.spec.mjs` — protected transfer rules and live consequence regression.

### What remains open

This is prototype policy logic. It is not a validated real-bank risk policy and has no production loss/fraud evidence.

---

## P24-D03 — Keep Protected buffer reserved by default

### Product question

When a transfer pushes planned spending, should Nova quietly treat the protected reserve as available money?

### Chosen direction

At amount and review decision surfaces Nova states:

> `Protected buffer stays reserved — this transfer does not use it.`

The buffer remains a deliberate reserve unless the product explicitly introduces a separate rule for changing it.

### Rejected alternatives

1. **Automatically consume the buffer.** Rejected because it would make a supposedly protected amount behave like ordinary spendable balance.
2. **Leave the rule implicit inside arithmetic.** Rejected because Round 02 participants could reach the correct remaining Safe-to-spend amount while still misunderstanding the buffer behavior.

### Trade-off accepted

The model may feel conservative because it does not maximize immediately spendable money. In exchange, the meaning of “protected” stays stable across planning and transfers.

### Evidence

- `research/validation/nova-round-02/DECISION-LOG.md` — D-03: 5/5 landed around the transfer arithmetic, but only 1/5 correctly understood the buffer rule.
- `docs/uiux/NOVA-PHASE3-CLARITY-ITERATION.md` — decision-point buffer copy implemented and QA-verified.

### What remains open

The post-Round-02 change is `ITERATED / NOT HUMAN-RETESTED`; comprehension improvement is unknown.

---

## P24-D04 — Split Freeze and Report; make simulation truth impossible to miss

### Product question

Should a suspicious-payment surface optimize for the fewest taps, or for clear distinction between two high-consequence actions?

### Chosen direction

- Freeze and Report are separate actions with separate consequence copy.
- Primary decision/result surfaces carry `DEMO ONLY · NO BANK CONTACT`.
- Report preview/handoff remains distinct from card freeze state.

### Rejected alternatives

1. **One combined “Freeze / Report” action.** Rejected because the actions have different consequences and recovery paths.
2. **UI that implies a real bank report was submitted.** Rejected because Nova has no connected banking service.
3. **Only a footer-level prototype disclaimer.** Rejected because the truth boundary must appear where the sensitive action is decided.

### Trade-off accepted

The surface is denser and asks the user to read more before acting. Nova accepts that cost because consequence clarity matters more than action compression in a high-risk moment.

### Evidence

- `research/validation/nova-round-02/DECISION-LOG.md` — D-02 remained mixed; 3/5 still reported a real-bank consequence, uncertainty or action conflation.
- commit `b5f0c8b5375857eb6b2ecc283336d82cb14f514a` — sensitive-action truth-boundary iteration.
- `qa/report-boundary.spec.mjs` — distinct action/result boundaries regression-protected.

### What remains open

The latest D-02 surface has not been human-retested. Do not claim improved comprehension.

---

## P24-D05 — Recovery certainty before retry speed

### Product question

After biometric, network or revalidation failure, what must the interface make unambiguous before asking the user to try again?

### Chosen direction

- `NO MONEY MOVED` is the dominant recovery status.
- The concrete failure cause sits beside it.
- The current balance is described as unchanged.
- Retry/passcode/reconnect actions remain available but secondary.
- Offline recovery never silently auto-sends when connection returns.

### Rejected alternatives

1. **Generic error + Retry as the first message.** Rejected because it leaves money-movement status uncertain.
2. **Silent resend / automatic completion after reconnect.** Rejected because a high-consequence action should not occur without renewed user confirmation.
3. **Treating recovery as an implementation detail.** Rejected because the user's primary question is whether money moved, not why a request failed technically.

### Trade-off accepted

The path may take one more moment before resuming the task. Nova accepts that delay to protect state certainty and avoid duplicate-send assumptions.

### Evidence

- `research/validation/nova-round-02/DECISION-LOG.md` — D-04 produced a negative cross-sectional self-report signal; certainty became a priority.
- `docs/uiux/NOVA-PHASE3-CLARITY-ITERATION.md` — `NO MONEY MOVED`, cause and unchanged-balance hierarchy implemented.
- `docs/uiux/PRODUCT-DESIGN-AUDIT-2026-09-29.md` — recovery truth and no-auto-send product integrity.

### What remains open

Round 02 and Round 01 used different participant sets. The signal is not proof that the old design caused a regression, and the latest repair is not human-retested.

---

## P24-D06 — Narrow prototype scope instead of fake recipient completeness

### Product question

Should the prototype pretend to support creating recipients just to look feature-complete?

### Chosen direction

- The Pay surface is explicitly `Saved recipients only`.
- Search filters the saved recipients that really exist in the rendered product.
- Selecting a person preserves that identity through Amount → Review → recovery → Receipt.

### Rejected alternatives

1. **A nonfunctional “Add new recipient” affordance.** Rejected because it advertises a capability the prototype does not own.
2. **Silently assuming Maya for every transfer.** Rejected because it breaks the relationship between user choice and later transaction evidence.
3. **Inventing missing bank metadata.** Rejected because source data exists for some recipients but not all.

### Trade-off accepted

The demo exposes a smaller feature boundary, but the interactions inside that boundary are credible and internally consistent.

### Evidence

- `docs/uiux/PRODUCT-DESIGN-AUDIT-2026-09-29.md` — P1.7 recipient-source correction and continuity evidence.
- `qa/recipient-continuity.spec.mjs` — deliberately selects Daniel Lee and verifies identity continuity through the transfer flow.

### What remains open

Adding recipients remains out of scope until a complete flow, data contract and recovery behavior can be implemented rather than mocked.

---

## P24-D07 — Reset the art direction instead of patching the old theme

### Product question

When the warm ledger/editorial direction made Nova feel visually dated and narrow on desktop, should the project keep polishing that theme or reset the visual contract?

### Chosen direction

Nova moved to an **iOS 26 Financial Workspace** direction:

- native / calm / precise / fluid / premium;
- cool neutral canvas and white content surfaces;
- system typography and tabular numerals;
- content-first financial surfaces;
- Liquid Glass limited to functional chrome;
- responsive desktop composition instead of a stretched phone column.

### Rejected alternatives

- beige/paper-first banking theme;
- faux ledger rules and serif money typography;
- generic SaaS sidebar;
- narrow ~760px desktop content column;
- nested glass everywhere;
- interchangeable card-grid dashboard.

### Trade-off accepted

The redesign gives up some editorial novelty in exchange for stronger platform familiarity, clearer financial hierarchy and more credible responsive behavior. Distinctiveness now comes from the product model and Money Horizon, not theme decoration.

### Evidence

- `docs/uiux/Nova-iOS26-Design-Contract-2026.md` — active art-direction source of truth and rejected visual patterns.
- `PROJECT-CONTEXT.md` — active visual signature and responsive contract.
- current rendered QA routes in `.github/workflows/nova-cloud-qa.yml`.

### What remains open

Rendered QA supports visual integrity and responsiveness; it does not prove user preference for this direction.

---

## What these decisions demonstrate

The portfolio claim is intentionally narrower than “I made the right design.” The supported claim is:

> Nova documents consequential product/design choices as explicit hypotheses and constraints. Each decision records the alternative that was rejected, the cost that was accepted, the evidence used, and the uncertainty that remains.

That is the P2.4 evidence standard.

## Claim boundary

Allowed:

- these decisions are traceable to current product contracts, implementation history, QA and retained research evidence;
- Round 02 changed the priority of D-01 through D-04;
- the latest post-Round-02 changes are implemented and QA-verified;
- the prototype intentionally chooses scope honesty over fake capability.

Not allowed without new compatible evidence:

- that all decisions are objectively optimal;
- that post-Round-02 comprehension improved;
- moderated usability success;
- user preference for the current visual direction;
- production banking safety, fraud reduction, conversion, retention or business impact.

## P2.4 acceptance checklist

- [x] At least five consequential decisions are explicit.
- [x] Every decision names one or more rejected alternatives.
- [x] Every decision states the cost/trade-off accepted.
- [x] Evidence provenance is linked to existing repository artifacts.
- [x] Human-research and production/business-impact boundaries remain explicit.
- [x] Recruiter-facing web surface is planned as `design-decisions.html`.
- [ ] `design-decisions.html` is rendered and regression-verified.
- [ ] Canonical ledgers promote P2.4 to `DONE_VERIFIED` after branch QA succeeds.
