# Nova — Post-iteration retest plan

**Purpose:** test whether the Round 01 evidence-driven iteration resolves the four direct-user patterns without claiming improvement in advance.

**Evidence state before retest:** `DIRECT_USER_SELF_REPORT / RETEST_REQUIRED`  
**Required build discipline:** record the exact merged commit and live URL used by every retest participant.

## Recommended sample

Run **3–5 real participants** matching the same core profile (18–30, digital banking at least weekly). A participant may be new or returning, but record which; returning participants can be biased by prior exposure.

## Task 1 — Safe-to-spend horizon

Prompt:
> “Imagine this is your account. How much feels safe to spend, and until when does that amount apply?”

Record:
- answer amount (do not score numeric accuracy unless currency/build context is captured);
- stated time horizon;
- whether the participant notices `next 14 days` without prompting;
- confidence 1–5;
- observable behavior if moderated.

Success criterion for the design question: participant identifies the intended 14-day horizon without moderator teaching.

## Task 2 — Sensitive action boundary

Prompt:
> “You notice a transaction you do not recognize. Show me what you would do next.”

Before the participant activates Freeze or Report Preview, ask:
> “What do you expect this action to do?”

After the action, ask:
> “What has actually happened at this point?”

Record separately whether they believe:
- a real bank was contacted;
- a bank case was created;
- a refund was requested;
- the card was frozen only inside the demo;
- the report flow is preview-only.

Success criterion for the design question: no participant should believe the report preview created a real bank case; Freeze should be understood as a demo-state action in this portfolio prototype.

## Task 3 — Transfer impact

Prompt:
> “Send €145 to the saved recipient. Before confirming, explain what happens to Safe to spend and the protected buffer.”

Record:
- predicted Safe-to-spend after transfer;
- whether participant uses the impact calculation;
- whether fee treatment is understood;
- whether protected buffer is understood as staying reserved/not pulled automatically;
- confidence 1–5.

Success criterion for the design question: participant can explain the before − transfer − fee = after relationship and does not assume the protected buffer is automatically consumed.

## Task 4 — Recovery diagnosis

Prompt:
> “The transfer cannot complete. Tell me what failed, whether any money moved, and what you would do next.”

Record:
- stated failure cause;
- whether participant believes money moved;
- recovery choice;
- confidence 1–5.

Success criterion for the design question: participant identifies authentication/revalidation failure, understands no money moved and selects a sensible recovery path without teaching.

## Comparison rule

Round 01 is unmoderated direct-user self-report. If Round 02 is moderated, do not pretend the two rounds are methodologically identical. Compare only compatible measures such as participant-reported expectations/confidence, and report new observed behavior separately.

## Improvement-claim gate

Only after retest may `RETEST_REQUIRED` change. Any improvement statement must cite post-change evidence IDs and the exact tested build. Preserve regressions and contradictory evidence.
