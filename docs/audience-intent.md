# Nova — Audience Intent & Top Tasks

Status: A32 recruiter-facing product evidence. This document is derived from current Nova project truth and does **not** claim direct-user validation.

## Evidence boundary

- **VERIFIED:** current product thesis, implemented routes, simulated system behavior, design contracts, QA coverage.
- **PLANNED_VALIDATION:** Round 01 usability study; 0 verified sessions at the time of this document.
- **INFERRED:** audience priorities below are product hypotheses grounded in the current project brief and implemented journeys, not observed user findings.

## Primary audience

Digital-first account owners, approximately 18–30, who use recurring payments and want to understand what money is actually safe to spend without maintaining a spreadsheet.

This is a product-target hypothesis from `PROJECT-CONTEXT.md`, not a validated demographic segment.

## Trigger → need → top task map

| Trigger / context | Need | Top task | Evidence needed before action | Product responsibility | Current evidence state |
| --- | --- | --- | --- | --- | --- |
| User checks money before spending | Understand what remains usable after obligations | Decide what is safe to spend | Balance, known commitments, protected buffer, freshness | Explain Money Horizon and safe-to-spend calculation without implying certainty | Product logic implemented; comprehension unvalidated |
| A transaction looks unfamiliar | Protect account without panic or irreversible action | Inspect evidence and decide whether to freeze | Merchant, amount, card, location/context, consequence of freeze | Put evidence before the destructive action; explain what freeze does and does not stop | Working flow + QA |
| User wants to send money | Know the consequence before commitment | Review recipient, amount, fee/timing and projected remaining safe-to-spend | Recipient identity, transfer amount, timing, impact, auth state | Keep commitment reversible until confirmation; preserve context through recovery | Working flow + QA |
| User wants to protect savings | Keep a buffer while planning day-to-day money | Review savings goal and next contribution | Goal progress, next contribution, impact on Money Horizon | Connect savings to the same planning model instead of a disconnected feature | Implemented screen; comprehension unvalidated |
| Connection/authentication fails | Avoid duplicate or accidental money movement | Recover without losing review context | Clear failure reason, preserved inputs/review, explicit retry route | Never auto-send after reconnect or failed authentication | Working recovery states + QA |
| Identity capture fails | Understand why and what to do next | Retry capture or choose manual review | Capture-quality guidance, failure reason, alternate route | Keep KYC explicitly simulated and avoid implying real verification | Implemented recovery state |

## Priority ranking

1. **Decide what is safe to spend.** This is the product-defining task and the reason Money Horizon exists.
2. **Resolve unusual activity safely.** High consequence; trust depends on evidence, reversibility and plain language.
3. **Send money with visible impact.** A commitment task where consequence must appear before confirmation.
4. **Recover from failure without ambiguity.** Offline/auth/KYC states are part of the product model, not edge-case decoration.
5. **Protect future money.** Savings and recurring commitments should remain connected to the planning model.

## Question / evidence / action matrix

| User question | Evidence the interface must show | Action enabled |
| --- | --- | --- |
| “Can I safely spend this?” | Safe-to-spend estimate + known commitments + protected buffer + freshness | Spend / wait / inspect upcoming items |
| “Is this transaction actually suspicious?” | Transaction facts + reason it needs review + no unsupported fraud claim | Freeze / review / leave card active |
| “What changes if I send this?” | Recipient + amount + fee/timing + projected remaining safe-to-spend | Confirm / edit / cancel |
| “What happened after failure?” | Failure state + preserved context + explicit retry or alternate route | Retry / review / stop |
| “Is this real banking?” | Persistent prototype/simulation disclosure | Interpret the artifact correctly |

## Business / portfolio goal ↔ user goal

Nova is also a portfolio case. The artifact must therefore serve two audiences without corrupting the product experience:

- **Product user goal:** complete money-planning and protection tasks with clear consequences.
- **Recruiter / Design Lead goal:** inspect product reasoning, state depth, recovery, responsive behavior and evidence boundaries quickly.

The recruiter layer belongs in `prototype.html` and evidence pages. It must not leak into the core product UI as explanatory portfolio copy.

## Validation risks

Round 01 should specifically test:

- whether people correctly interpret “safe to spend” versus total balance;
- whether Money Horizon increases or reduces comprehension;
- whether the unusual-activity evidence is sufficient before freezing;
- whether transfer impact is understood before confirmation;
- whether offline/authentication recovery prevents duplicate-action assumptions.

Until real sessions exist, these remain hypotheses and planned validation targets.
