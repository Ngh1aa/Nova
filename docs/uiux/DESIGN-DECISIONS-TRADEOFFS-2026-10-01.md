# Nova P2.4 — Design Decisions, Rejected Alternatives & Trade-offs

Status: `DONE_VERIFIED`

> Internal deep-evidence record. The recruiter-facing page intentionally exposes only three stories; this file keeps seven consequential decisions for interview depth and provenance.

## Public vs internal contract

**Public recruiter cut (`design-decisions.html`)**

1. Protected money / Safe-to-spend mental model.
2. Freeze vs Report consequence boundary.
3. Failure recovery — `NO MONEY MOVED` before retry speed.

Each public story uses: **Problem / constraint → Decision → Rejected alternative → Trade-off → Evidence → Remaining uncertainty**.

**Internal record**

Seven decisions remain traceable here. This record is not a claim that every decision was proven with moderated users or production data.

## Recruiter scan

| ID | Decision | Chosen direction | Rejected alternative | Core trade-off | Evidence state |
|---|---|---|---|---|---|
| P24-D01 | Money model | Safe to spend + 14-day Money Horizon leads | Raw-balance hero; generic KPI dashboard; unexplained health score | More explanation for a more decision-useful model | Implemented; latest clarity pass not human-retested |
| P24-D02 | Transfer guardrail | Friction above Safe to spend; hard block only above total balance | Block all over-plan transfers; silently allow them | Agency vs protective friction | Prototype/technical regression evidence |
| P24-D03 | Protected buffer | Buffer stays reserved unless the rule is deliberately changed | Auto-consume it; hide rule in arithmetic | Conservative planning vs maximum spendability | Round-02-informed; not human-retested |
| P24-D04 | Sensitive actions | Freeze and Report remain distinct with explicit demo truth boundary | Combined action; implied bank contact; footer-only disclaimer | More UI/copy vs lower consequence ambiguity | Round-02-informed; not human-retested |
| P24-D05 | Failure recovery | `NO MONEY MOVED` + cause + unchanged balance before retry | Generic error; silent resend; ambiguous completion | Slightly slower recovery vs stronger certainty | Round-02-informed; not human-retested |
| P24-D06 | Prototype scope | Saved recipients only; preserve identity end-to-end | Fake Add recipient; default every transfer to Maya; invented metadata | Narrower scope vs higher credibility | Prototype/technical regression evidence |
| P24-D07 | Art direction | iOS 26 Financial Workspace | Warm ledger; generic SaaS; narrow phone-like desktop; nested glass | Less decorative novelty vs platform familiarity and responsive credibility | Active visual contract + rendered QA |

---

## P24-D01 — Lead with Safe to spend, not raw balance

**Product question**  
Should Home answer “How much money exists?” or “How much is actually safe after near-term commitments?”

**Chosen direction**  
Safe to spend leads. Money Horizon explains the next 14 days, commitments, planned savings and protected reserve. Raw balance remains supporting context.

**Rejected alternatives**

- Raw balance as the hero.
- Interchangeable KPI dashboard.
- Unexplained financial-health score.

**Trade-off accepted**  
The model needs more explanation and visible horizon language in exchange for being more useful to a spending decision.

**Evidence**

- `PROJECT-CONTEXT.md`
- `docs/uiux/Nova-iOS26-Design-Contract-2026.md`
- `research/validation/nova-round-02/DECISION-LOG.md`
- `docs/uiux/NOVA-PHASE3-CLARITY-ITERATION.md`

**What remains open**  
The latest 14-day clarity pass is implemented and QA-verified, but post-Round-02 comprehension has not been human-retested.

---

## P24-D02 — Agency with friction above Safe to spend

**Product question**  
Should a planning amount behave like a legal account-balance hard limit?

**Chosen direction**  
Amounts above total balance are blocked. Amounts above Safe to spend remain possible only after the plan shortfall is shown and explicitly acknowledged.

**Rejected alternatives**

- Hard-block every amount above Safe to spend.
- Allow the transfer with no consequence disclosure.

**Trade-off accepted**  
One extra decision step preserves user agency without making the planning model decorative.

**Evidence**

- `docs/uiux/PRODUCT-DESIGN-AUDIT-2026-09-29.md`
- `qa/product-integrity.spec.mjs`
- `qa/transfer-impact.spec.mjs`

**What remains open**  
This is prototype policy logic, not a validated banking-risk policy.

---

## P24-D03 — Keep the Protected buffer reserved

**Product question**  
Should a protected reserve silently become ordinary spendable money when a transfer exceeds the plan?

**Chosen direction**  
At the transfer decision point Nova states: `Protected buffer stays reserved — this transfer does not use it.`

**Rejected alternatives**

- Automatically consume the buffer.
- Leave the rule implicit inside arithmetic.

**Trade-off accepted**  
The model is more conservative, but “protected” keeps one stable meaning.

**Evidence**  
Round 02 D-03: 5/5 participants reached the transfer arithmetic, while only 1/5 correctly described buffer behavior. The clarity repair is implemented and technically verified.

**What remains open**  
The post-Round-02 change is `ITERATED / NOT HUMAN-RETESTED`; improved comprehension is unknown.

---

## P24-D04 — Split Freeze and Report

**Product question**  
Should a high-consequence suspicious-payment surface optimize for fewer controls or clearer consequences?

**Chosen direction**  
Freeze and Report are separate. Their consequences are separate. `DEMO ONLY · NO BANK CONTACT` sits beside the sensitive decision/result instead of only in a global disclaimer.

**Rejected alternatives**

- Combined “Freeze / Report” action.
- UI that implies a real bank submission.
- Footer-only simulation disclaimer.

**Trade-off accepted**  
More UI and copy in exchange for less ambiguity at a high-risk moment.

**Evidence**  
Round 02 D-02 remained mixed; 3/5 responses still indicated real-bank consequence, uncertainty or action conflation. The follow-up truth boundary is regression-protected.

**What remains open**  
The latest surface has not been human-retested.

---

## P24-D05 — Recovery certainty before retry speed

**Product question**  
After biometric, network or revalidation failure, what must be answered before another action is offered?

**Chosen direction**

- `NO MONEY MOVED` is dominant.
- Concrete failure cause stays adjacent.
- Balance is described as unchanged.
- Retry/passcode/reconnect remain secondary.
- Reconnect never silently sends.

**Rejected alternatives**

- Generic error + primary Retry.
- Silent resend after reconnect.
- Ambiguous completion state.

**Trade-off accepted**  
Recovery takes another moment, but transaction-state certainty comes first.

**Evidence**  
Round 02 D-04 produced a negative cross-sectional self-report signal. That signal changed the hierarchy; it is not treated as causal proof.

**What remains open**  
The revised hierarchy is implemented and QA-verified but not human-retested.

---

## P24-D06 — Smaller credible scope beats fake completeness

**Product question**  
Should the prototype advertise recipient creation simply to look feature-complete?

**Chosen direction**  
Saved recipients only; search what actually exists; preserve selected identity through Amount → Review → recovery → Receipt.

**Rejected alternatives**

- Nonfunctional Add recipient affordance.
- Silently default every transfer to Maya.
- Invent missing bank metadata.

**Trade-off accepted**  
Less feature breadth in exchange for a prototype whose visible capabilities are internally honest.

**Evidence**

- `docs/uiux/PRODUCT-DESIGN-AUDIT-2026-09-29.md`
- `qa/recipient-continuity.spec.mjs`

**What remains open**  
Recipient creation stays out of scope until its data, recovery and end-to-end behavior can be implemented rather than mocked.

---

## P24-D07 — Reset the visual contract instead of polishing the old theme

**Product question**  
When the warm ledger direction felt dated and too narrow on desktop, should Nova keep patching the theme or reset the art direction?

**Chosen direction**  
iOS 26 Financial Workspace: content-first, cool neutral, system typography, restrained glass chrome and responsive desktop composition.

**Rejected alternatives**

- Beige/paper-first ledger theme.
- Serif money UI.
- Generic SaaS sidebar/card grid.
- Narrow phone-like desktop column.
- Nested glass surfaces.

**Trade-off accepted**  
Less editorial novelty in exchange for platform familiarity, clearer financial hierarchy and more credible responsiveness.

**Evidence**

- `docs/uiux/Nova-iOS26-Design-Contract-2026.md`
- `PROJECT-CONTEXT.md`
- rendered/browser QA in `.github/workflows/nova-cloud-qa.yml`

**What remains open**  
Rendered QA proves visual integrity and responsiveness, not user preference.

---

## Claim boundary

Supported:

- all seven decisions are traceable to product contracts, implementation, QA or retained research evidence;
- the public page intentionally exposes only three decision stories;
- Round 02 changed priorities for D-01 through D-04;
- latest post-Round-02 changes are implemented and technically verified.

Not allowed without new compatible evidence:

- every decision is objectively optimal;
- post-Round-02 comprehension improved;
- moderated task-success or time-on-task improvement;
- user preference for the visual reset;
- production conversion, retention, fraud reduction or banking impact.

## P2.4 verification

- Public surface: 3 recruiter stories; internal record: 7 decisions.
- Public evidence labels stay within the lean four-label vocabulary; Nova currently uses only labels it can support.
- `design-decisions.html` is part of the normal Nova Visual QA route set.
- Responsive section evidence is captured at 1440 / 768 / 390.
- Mobile evidence navigation remains one row after the six-link responsive repair.
- PR-head Nova Visual QA: Actions run `36840448193` — `SUCCESS`.
- Pinned UIUX Factory Flow OS, generated-runtime sync, browser/render/accessibility/product regressions: `SUCCESS` in the same gate.

P2.4 is `DONE_VERIFIED`. New human observation remains a separate future evidence task and is not implied by this completion state.
