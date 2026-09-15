# NOVA — Design Contract

## Product thesis

> **NOVA helps digital-first young adults decide what money is truly safe to spend and act on financial exceptions by composing balances, committed payments, savings goals and risk signals into one calm decision layer.**

## Primary users

### 1) Everyday owner — primary
- **Goal:** Know what is safe to spend without manual budgeting.
- **Context:** Checks phone several times a day; salary + recurring subscriptions/bills.
- **Frequency:** Daily / event-driven.
- **Pain:** Balance alone is misleading; obligations are fragmented.
- **Risk:** Overspending money already committed to bills or goals.
- **Decision:** “Can I afford this now?”

### 2) Sender / planner — secondary
- **Goal:** Transfer money and save toward near-term goals with confidence.
- **Context:** P2P/bank transfers, travel/emergency goals.
- **Frequency:** Weekly / monthly.
- **Pain:** Fees, timing, recipient confidence, goal trade-offs.
- **Risk:** Wrong recipient, insufficient funds, weakening buffer.
- **Decision:** “Should I send this amount now?”

### 3) Security-conscious account owner — secondary
- **Goal:** Respond quickly to unusual activity and keep account access secure.
- **Context:** Push alert, lost phone/card, unfamiliar merchant.
- **Frequency:** Rare but high consequence.
- **Pain:** Panic, unclear consequences of freeze/report/replace.
- **Risk:** Overreaction or delayed response.
- **Decision:** “Is this mine, and what protection should I apply right now?”

No admin role is needed for this consumer prototype. Internal bank operations are outside scope.

## Jobs To Be Done

1. When I open NOVA, I need to know what I can safely spend after near-term bills and planned savings so I can make a purchase without doing mental math.
2. When spending feels high, I need to see which categories/merchants changed from my normal pattern so I can decide what to cut.
3. When a recurring bill is approaching, I need to see its date and impact on safe-to-spend so I am not surprised by a lower balance later.
4. When I see an unfamiliar transaction, I need enough merchant/time/card context plus a reversible protective action so I can secure my card before investigating further.
5. When I send money, I need recipient, amount, fee/arrival context and a final review before authentication so I can avoid an irreversible mistake.
6. When a savings goal competes with current spending, I need to understand the trade-off and change the contribution without losing the goal context.
7. When authentication or network connectivity fails, I need a safe recovery path that preserves my work and does not imply money moved.
8. When KYC capture fails, I need concrete guidance and a retry/manual-review path so I know what to fix rather than restarting blindly.

## Product risks

- Wrong recipient / wrong amount.
- “Safe to spend” mistaken for guaranteed future balance.
- Risk alert mistaken for confirmed fraud.
- Freeze mistaken for transaction reversal.
- Merchant-block mistaken for subscription cancellation.
- Offline UI implying a transfer completed.
- Biometric failure becoming a dead end.
- KYC camera/identity steps excluding users without recovery/support.
- Over-automation moving savings money without understandable rules.
- Sensitive information exposed in screenshots/notifications.

## Art direction

**calm / clear / human**

### Feeling in the first 3 seconds

> “I understand my money situation, and the app is on my side—not trying to excite me into spending.”

## Visual signature — Money Horizon

Money Horizon is the primary decision visualization, not a decorative chart.

### Structure

A long horizontal financial field with a single horizon line and three semantic zones:

1. **Safe now** — usable money after commitments.
2. **Committed** — upcoming bills/subscriptions + scheduled goal contributions within the horizon.
3. **Future buffer** — protected reserve / amount intentionally not considered spendable.

Markers show the next material event (e.g., rent in 6 days). Tapping a zone reveals the calculation inputs.

### Example prototype calculation

- Account balance: €2,840
- Upcoming committed payments: €780
- Planned goal contribution: €260
- Protected buffer: €500
- **Safe to spend: €1,300**

The UI must label this as an estimate based on currently known commitments, not a guarantee.

### Motion

When a user changes a bill, goal contribution or buffer:
- zone proportions glide to their new widths in ~700–900ms;
- labels cross-fade only if needed;
- no number slot-machine/odometer effect;
- no confetti for moving money;
- reduced-motion mode updates instantly.

## Color role map

Implementation should resolve exact accessible values against real rendered surfaces; initial direction:

- **Canvas:** warm-neutral off-white, not cream luxury styling.
- **Ink:** deep green-black / charcoal.
- **Primary action:** restrained deep jade/teal.
- **Safe:** green-teal with text/icon label.
- **Committed:** muted amber/ochre with text/icon label.
- **Future/buffer:** cool slate.
- **Risk / suspicious:** restrained coral/red, used sparingly.
- **Success:** distinct green with check icon/text.
- **Info:** desaturated blue/teal.

No fintech purple gradient. No glow. No glass panels.

## Typography

- Humanist/grotesk sans with strong tabular numerals.
- Maximum two font families; ideally one family + tabular-number feature.
- Large money values use stable-width/tabular numerals.
- Transaction IDs/references may use a mono treatment only where it improves scanability.
- Body minimum 16px on mobile; secondary labels remain readable, not washed-out gray.

## Layout grammar

### 390 mobile
- Single decision column.
- Bottom nav: **Home / Activity / Pay / Cards / Save**.
- Profile avatar is top utility; Insights is a contextual destination from Money Health rather than a sixth bottom-tab item.
- Sticky bottom CTA only when a flow requires one.
- Bottom sheets for filters/card controls/review help; full screen for high-risk confirmation when context matters.

### 768
- Preserve mobile task order; transaction/detail can use master-detail when room allows.
- Bottom nav may remain; sheets widen into side panels.

### 1024 / 1440
- Left navigation rail + centered primary decision surface + contextual right rail.
- Do not expand into a generic admin dashboard grid.
- Money Horizon becomes wider and more explanatory, not taller/decorative.

## Global navigation

Primary high-frequency destinations:
- Home
- Activity (Transactions)
- Pay
- Cards
- Save

Contextual / utility:
- Money Health / Insights from Home
- Subscriptions from Home/Activity
- Notifications from header utility
- Profile -> Security

## Core screen priorities

### Home
1. Safe to spend / Money Horizon
2. Unusual transaction if present
3. Upcoming commitments
4. Goal progress
5. Recent transactions
6. Insight summary

### Transaction detail
1. Merchant + amount + status
2. Why attention is needed (when applicable)
3. Date/time + payment/card + location/reference
4. Freeze/report/help action
5. Category / recurring controls

### Card
1. Card state
2. Freeze/unfreeze
3. Spending/ATM/contactless/online controls
4. Limits
5. Recent card transactions

### Transfer review
1. Recipient identity
2. Amount/currency
3. Fees/arrival estimate (if applicable)
4. Source account + resulting safe-to-spend impact
5. Authenticate & send

## Component principles

- “Card” as a component is reserved for true grouped objects; do not wrap every section in the same rounded rectangle.
- Lists use separators, alignment and typography before containers/shadows.
- High-risk actions pair icon + text + consequence.
- Status never relies on color alone.
- Touch target minimum 44px.
- Focus-visible is designed, not default-outline removal.

## Anti-template rules

Do not use:
- purple/blue gradient hero;
- giant floating debit card as the app’s main visual idea;
- endless 24px-radius cards;
- 4-up KPI grid on mobile;
- glowing charts;
- generic “AI insights” chat bubble;
- every section fade-up;
- confetti/checkmark spectacle for routine transfers;
- meaningless financial-health score without explainable inputs.

## Content voice

- Calm, concise, non-judgmental.
- “Needs review” not “Fraud detected” unless the system truly knows.
- “You’re on track” / “This may leave less for upcoming bills” rather than shame language.
- Explain consequences before high-risk actions.

## Accessibility contract

- WCAG 2.2 AA target where reasonably applicable; conformance claim only after proper verification.
- Keyboard navigation and visible focus.
- Programmatic labels and form error association.
- `aria-live` only for meaningful async state changes.
- Charts have text equivalents.
- Color + icon/text for all states.
- `prefers-reduced-motion: reduce` supported.
- Sensitive notification previews can be hidden via security setting in prototype.
