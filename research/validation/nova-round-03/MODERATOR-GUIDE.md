# Nova Round 03 — Moderator guide

## Study status
`PLANNED_VALIDATION`

## Moderator rule
Observe first. Do not teach the interface, explain Nova terminology, point to controls, or rescue the participant until the failure/hesitation has been recorded.

If help is required to continue, record the intervention and classify the task accordingly.

## Opening script

Thanks for joining. We are testing the prototype, not you. Some parts may be unclear or incomplete, and that is useful for us to see.

Nova is a portfolio prototype using simulated banking data. No real bank account is connected and no real money will move.

I may ask you to think out loud: tell me what you are looking at, what you expect to happen, and what you are deciding. I may stay quiet during tasks so I do not influence your path.

Confirm participation/recording consent before continuing.

## Warm-up

Ask without showing Nova terminology:
- When you open your banking app, what do you usually check first?
- Before sending money, what do you normally want to know?
- If a transfer fails, how do you decide whether to try again?

Do not turn warm-up answers into findings about Nova.

---

## T-01 — Planning window / F-03

### Scenario
"You have bills and savings coming up over the next couple of weeks. Before spending more today, use Nova to work out what period the planning view is covering and what money it has already accounted for."

### Observe silently
- first destination/element inspected;
- time until participant verbalizes a period;
- whether they identify 14 days without a hint;
- what they believe is included/excluded;
- whether 'Money Horizon' is treated as current balance, monthly budget, forecast, or something else;
- backtracking/help-seeking.

### Neutral probes after behavior is captured
- "What time period do you think this covers?"
- "What makes you think that?"
- "What money has already been accounted for here?"
- "What could still change this number?"

### Critical misunderstanding
Participant confidently treats the view as a materially different time frame or says all future spending is guaranteed/known.

---

## T-02 — Protected Buffer / F-02

### Scenario
"You need to send Maya €145 for utilities. Before confirming, tell me what Nova says will remain safe to spend and what happens to the protected money."

### Observe silently
- path to Pay/transfer;
- whether participant notices impact preview before review;
- result they report for safe-to-spend after sending;
- explanation of the €500 protected buffer;
- whether they assume Nova pulls from the buffer automatically;
- whether they confuse protected buffer with the savings goal.

### Neutral probes
- "Where did that number come from?"
- "What happens to the €500 in this scenario?"
- "If you sent €145, what would you expect to change and what would stay reserved?"

### Critical misunderstanding
Participant believes the transfer automatically spends/borrows/moves the protected buffer, or cannot distinguish the buffer from transferable balance after reviewing the flow.

---

## T-03 — Failed confirmation recovery / F-04

### Scenario
"Imagine the identity check or final balance check fails just before the transfer completes. Work out what happened to the money and what you would do next."

Use the frozen build's intended failure state (`biometric-failed` or revalidation error) according to the session protocol. Use the same state for comparable sessions unless explicitly testing both variants.

### Observe silently
- first interpretation of failure;
- whether participant believes money moved;
- whether balance is assumed changed;
- whether they retry immediately without review;
- whether they choose Review again / retry / alternative verification / home;
- evidence in the UI they rely on.

### Neutral probes
- "What do you think has happened so far?"
- "Did any money move? What tells you that?"
- "What would you do next?"
- "What would you want to verify before trying again?"

### Critical error
Participant believes money moved when it did not and takes a recovery action based on that belief, or blindly repeats the consequential action without understanding the state.

---

## T-04 — Input error and review safety / A11Y-ERR

### Scenario
"Try to send an amount that Nova should not allow, then recover and get as far as the final review."

Moderator may provide a test value only if needed to create the invalid condition. Do not explain where the error will appear.

### Observe
- error notice visibility/perception;
- error description clarity;
- correction suggestion usefulness;
- focus position after submit;
- keyboard-only recovery when applicable;
- whether final review shows recipient, amount, fee/impact and an edit path before confirmation.

### Probe
- "What is wrong?"
- "What would you change?"
- "Before final confirmation, what can you review or correct?"

---

## Assistance ladder

Only after recording the blockage:
1. repeat the scenario goal verbatim;
2. ask "What would you try next?";
3. ask participant to inspect the page again;
4. provide a broad area hint only if necessary to continue;
5. direct instruction is last resort and marks the task `BLOCKED` for unassisted completion.

Record the exact intervention level.

## Post-task confidence

After each task, optionally collect a 1–5 confidence rating **only as supporting self-report**, never as a substitute for observed behavior.

Ask: "How confident are you that your answer/action is correct? 1 means not confident, 5 means very confident."

## Debrief

- Which part required the most thought?
- Was there any point where you were unsure whether money had moved?
- What did 'Protected Buffer' mean to you after using the flow?
- What did 'Money Horizon' mean to you after using the flow?
- What single change would make you trust the transfer/recovery flow more?

Avoid asking "Did you like it?" as the primary evaluation question.

## End-of-session integrity check

Before marking a session complete, verify:
- consent recorded;
- participant ID used, no PII committed;
- exact build/URL recorded;
- task outcomes based on observation;
- intervention level recorded;
- quotes, if any, are exact and traceable;
- interpretation is separate from observation.