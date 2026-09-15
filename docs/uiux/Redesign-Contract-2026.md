# NOVA — Redesign Design Contract 2026

Skill lock: `Ngh1aa/uiux-ai-workspace@221370ef294408f3f5a0c6a7fb0567c3db840c3e`  
Branch: `feat/nova-financial-field-guide`  
Project mode: `interactive_prototype`  
Responsive scope: `390 / 768 / 1024 / 1440`

## 1. Owner / portfolio goal

NOVA must prove that its designer can handle a high-trust consumer fintech product end-to-end: product framing, information hierarchy, money visualization, security/recovery, mobile interaction, responsive transformation, accessible states and design-to-code craft.

The redesign must be visibly more ownable than the current implementation without sacrificing the existing product logic.

## 2. Product thesis — preserved

> **NOVA helps digital-first young adults decide what money is truly safe to spend and act on financial exceptions by composing balances, committed payments, savings goals and risk signals into one calm decision layer.**

## 3. Primary audience / entry intents

### Everyday money owner
- Opens Home repeatedly during the week.
- Needs a fast answer: “What can I safely spend?”
- Secondary questions: next bill, current goal, unusual charge.

### Sender / planner
- Enters through Pay or a recipient.
- Needs confidence around recipient, amount, timing and effect on remaining money.

### Security-conscious customer
- Often enters via notification / suspicious transaction / Cards.
- Needs a reversible protective action with consequences explained before commitment.

### KYC / account setup user
- Needs to know why identity evidence is required, what quality is acceptable and how to recover if capture fails.

## 4. Preserve / change contract

### Preserve
- IA and existing screen coverage.
- Safe-to-spend formula and disclosure.
- Money Horizon conceptual model.
- Hero security flow and transfer flow.
- State persistence for freeze/unfreeze.
- Simulated-system labels.
- Existing functional QA intent.

### Change
- Visual grammar, typography, iconography and navigation craft.
- Home composition and Money Horizon form.
- Activity from generic list to ledger composition.
- Transaction detail from generic page sections to payment dossier.
- Cards from fintech-card showcase to card + security ledger.
- Transfer from generic forms to focused step canvases.
- Savings from simple progress component to a goal ledger tied to future cashflow.
- KYC from generic form journey to document/checklist progression.
- Evidence pages so Figma conversion shows the same system as the product.

## 5. Art direction

### Working name
**Financial Field Guide**

### Attributes
1. **Grounded** — credible, quiet surfaces; no speculative “future finance” effects.
2. **Anticipatory** — UI prioritizes what happens next: due date, safe amount, transfer impact, recovery.
3. **Editorial** — strong typographic hierarchy and deliberate rules/columns instead of endless cards.
4. **Tactile without skeuomorphism** — statement/planner/receipt structure, no fake paper texture.
5. **Human** — plain-language labels, reversible actions, calm risk phrasing.

### First-three-seconds test

> “This feels like a money plan I can read, not a bank dashboard I have to decode.”

## 6. Visual signature

### Money Horizon 2.0 — the living financial field

The Horizon is no longer a progress bar inside a rounded card. It becomes a **dated planning strip** with four layers:

1. Safe-now zone.
2. Known commitments zone.
3. Protected buffer zone.
4. Event markers on a 14-day timeline.

Home always exposes:
- safe-to-spend amount;
- total balance;
- next material event + date;
- horizon calculation legend;
- a disclosure that this is an estimate based on known commitments.

#### Visual form
- Wide rectangular field, low radius or square corners.
- Hairline tick marks / date captions.
- Strong baseline / horizon rule.
- Event marker is a small pin with label, not a floating tooltip.
- Safe / committed / protected colors stay semantic and accessible.

#### Motion
- Zone widths: 600–800ms cubic ease.
- Marker: 450–650ms positional shift.
- Values update without odometer/slot animation.
- `prefers-reduced-motion` makes updates effectively instant.

## 7. Domain artifact transfer

### Dominant artifact: bank statement / ledger
- Layer: **structural**.
- Fidelity: **L2**.
- Keep: aligned amounts, date/period grouping, debit/credit clarity, running context, ruled separation.
- Reject: fake account stamps, faux typewriter look, paper texture.

### Supporting artifact: monthly planner
- Layer: structural + information.
- Fidelity: L1–L2.
- Keep: event sequence, due dates, near-future horizon.
- Reject: literal calendar grid for every screen.

### Supporting artifact: receipt / payment slip
- Layer: information.
- Fidelity: L2.
- Keep: merchant/amount/reference/status anatomy.
- Reject: fake receipt paper, perforations, thermal-print styling.

### Direct-form artifact: debit card
- Layer: form.
- Fidelity: L3 only on Cards.
- Keep: recognizable card ratio/anatomy.
- Reject: 3D tilt, fake network marks, glossy plastic realism.

## 8. Color-role map

Final values must pass rendered contrast checks; intended roles:

- **Canvas / mineral:** `#F3F0E7` — neutral warm backdrop, not luxury cream.
- **Surface:** `#FCFAF4`.
- **Ink:** `#14201B` — primary text / dark action.
- **Ink secondary:** `#3F4A45`.
- **Muted:** target ≥ 4.5:1 on main surfaces.
- **Primary / pine:** `#245C4B`.
- **Safe:** `#2F7A61` + pale mint field.
- **Committed:** `#B6782C` + pale ochre field.
- **Protected:** `#66767B` + pale blue-gray field.
- **Risk:** `#B54A3E` + pale brick field.
- **Info:** desaturated blue/teal.
- **Focus:** high-contrast cobalt/blue focus ring distinct from semantic colors.

Color never carries status alone.

## 9. Typography

### Pairing
- **Inter** — controls, body, lists, forms, navigation.
- **Source Serif 4** — decision amounts, major screen titles, selected editorial callouts.

### Rules
- Serif is not used for dense controls, helper copy or transaction metadata.
- Tabular numerals on monetary values.
- H1 / display letter-spacing stays modest; no ultra-tight startup typography.
- Mobile body target 16px minimum for core content.
- Labels can be 12–14px only when contrast/line-height remain strong.

## 10. Shape / elevation language

- Default grouping: 0–8px radius.
- Pills: filters/status only.
- Card object: physical card can use 16–20px radius because that maps to the object.
- Shadow: rare; reserved for floating modal/bottom sheet only.
- Main separation: rules, whitespace, background fields and typography.
- No glassmorphism, glow or floating “soft cards everywhere”.

## 11. Iconography

- Inline SVG, 1.75–2px stroke, rounded joins.
- Icons are geometric and calm; no emoji/ASCII glyphs.
- High-risk actions pair icon + label.
- Navigation icons have active and inactive states without color-only reliance.

## 12. Navigation

### Mobile
Bottom navigation remains:
**Home / Activity / Pay / Cards / Save**.

- 56–64px interaction zone.
- Active destination uses ink + subtle field, not filled pill everywhere.
- Top bar: NOVA mark left, notification + security/profile right.

### Desktop
- 208–224px rail.
- Strong brand mark + current account identity.
- Five primary jobs.
- Security / prototype evidence in lower utility group.
- Rail background is a distinct field, but not a dark SaaS sidebar.

## 13. Page-role composition matrix

| Screen role | Entry question | First visual anchor | Top composition | Decision object | Primary action | Mobile transformation |
|---|---|---|---|---|---|---|
| Home | What can I safely spend now? | Safe amount + Horizon | Decision header → Horizon → risk strip | Money Horizon | Review anomaly / Send | Safe amount + compact Horizon in first 1.5 viewports |
| Activity | What changed this month? | Month cashflow | Period summary + search/filter + ledger | Transaction ledger | Open detail | Sticky search/filter, grouped rows |
| Transaction detail | Is this mine / what happened? | Merchant + amount + risk status | Payment dossier | Transaction evidence | Freeze / recognise | Action stays close after evidence |
| Cards | Is my card safe / what can it do? | Physical card object + state | Card object left / security controls right | Card state | Freeze/unfreeze | Card first, controls below |
| Pay recipient | Who am I paying? | Recipient list/search | Focus step | Recipient identity | Continue | Full-width list |
| Pay amount | How much and what does it change? | Large amount input | Amount canvas + balance/horizon side context | Transfer impact | Review transfer | Impact strip beneath amount |
| Pay review | Is everything correct? | Recipient + total | Review sheet + impact field | Final confirmation | Authenticate & send | Sticky confirm CTA |
| Savings | Am I on track? | Goal amount + timeline | Goal ledger + contribution schedule | Goal vs Horizon | Adjust contribution | Goal header → timeline → details |
| Subscriptions | What is committed? | Monthly recurring total | Merchant ledger | Recurring commitments | Block/view merchant | Grouped recurring list |
| Security | Is my account protected? | Security status | Security checklist | Controls / trusted settings | Review setting | Single checklist column |
| Notifications | What needs attention now? | Action-required group | Priority inbox | Notification event | Open relevant object | Priority groups |
| KYC | What do you need from me? | Progress spine + requirement | Checklist/document sheet | Capture requirement | Continue/retry | Vertical step progression |
| Success/error | What happened, what next? | State mark + concise statement | Focused receipt/recovery | Result | Next safe action | One primary action |

## 14. Three composition families — mandatory

### Family A — Decision Field
Home / Savings.

```text
[screen context + status]
[LARGE decision amount / title]
[Money Horizon / goal timeline field]
[risk or next event strip]
[ledger sections]
```

### Family B — Evidence Ledger
Activity / Transaction detail / Subscriptions / Notifications.

```text
[period / object header]
[search/filter or risk evidence]
[ruled ledger / dossier]
[contextual action]
```

### Family C — Focused Task Canvas
Transfer / KYC / Security / Card controls.

```text
[progress / state]
[one primary task]
[context / consequences]
[sticky or high-salience action]
```

Cards uses a hybrid: direct-form card object + Focused Task Canvas.

## 15. Screen-by-screen content priorities

### Home
1. Context/date + prototype disclosure.
2. Safe to spend.
3. Money Horizon 2.0.
4. Risk review if present.
5. Next 7–14 days commitments.
6. Emergency buffer goal.
7. Recent activity.
8. Weekly/monthly comparison as a secondary insight.

### Activity
- September 2026.
- Money in / money out / net as compact strip, not KPI cards.
- Search.
- Filters: All / Needs review / Recurring / Pending / Income.
- Date-grouped transactions.

### Transaction detail
- Merchant, amount, time, status.
- “Why NOVA surfaced this” label is explicitly simulated.
- Card, channel, location, category, reference.
- Recognise / freeze / report path.
- Consequence copy before freeze.

### Cards
- Card state and last four.
- Freeze/unfreeze.
- Card controls: online, contactless, cash withdrawal.
- Daily limit.
- Recent card activity.

### Transfer
- Recipient identity visible through every later step.
- Review includes safe-to-spend after transfer.
- Offline state never implies queued auto-send.
- Biometric failure offers passcode fallback.

### Savings
- Goal: Emergency buffer.
- €2,480 / €4,000.
- Next planned contribution €260 Sep 28.
- Contribution can be changed in prototype.
- Horizon impact is explained.

### KYC
- Why it is needed.
- Accepted document / capture guidance.
- Failed quality state says exactly what to correct.
- Manual-review/support route visible.

## 16. Motion contract

### Functional
- nav active state: 160ms.
- row press/selection: 120–180ms.
- sheets/dialogs: 220–280ms.
- Horizon recomposition: 600–800ms.
- progress/goal adjustment: 450–650ms.

### Do not
- fade-up every section;
- stagger transaction rows;
- use parallax;
- animate money values as counting/rolling;
- celebrate routine transfers with confetti.

### Reduced motion
All transforms become opacity/instant state swaps where possible; Horizon jumps directly to final proportions.

## 17. Accessibility contract

- WCAG 2.2 AA target where reasonably applicable; no conformance claim without evidence.
- 44px+ minimum touch targets.
- Visible focus ring on all interactive elements.
- Status = text + icon/shape, never color only.
- Money Horizon exposes textual equivalent.
- Inputs retain persistent labels.
- Destructive/reversible actions are differentiated semantically.
- Dialog focus handling and Escape/close behavior tested.
- Reduced motion supported.
- No sensitive data beyond fictional prototype values.

## 18. System reality

All banking, card, KYC, biometric, notification and fraud/risk behavior stays `SIMULATED` or `STATIC`.

No UI may imply:
- money actually moved;
- identity was truly verified;
- risk detection is real;
- a merchant subscription was cancelled by blocking a card charge;
- a frozen card reverses already-authorized transactions.

## 19. Do / do not

### Do
- use editorial hierarchy to clarify decisions;
- use statement/planner/receipt structures at low fidelity;
- expose time and next events;
- use real states and recovery;
- make desktop feel like a personal money workspace;
- make Home instantly recognisable by Money Horizon.

### Do not
- create a luxury wealth-management aesthetic;
- wash the whole interface in beige;
- use serif for every label/control;
- use more than one major artifact metaphor per composition;
- reintroduce generic rounded card grids;
- clone competitor branding;
- hide risk behind decorative visuals.

## 20. Acceptance criteria

Before PR:

- [ ] All existing functional routes still work.
- [ ] Home, Activity, Transaction Detail, Cards, Transfer, Savings and KYC have visibly distinct top compositions.
- [ ] Money Horizon 2.0 is clear at 390 / 768 / 1024 / 1440.
- [ ] Navigation uses coherent SVG icons.
- [ ] Evidence pages reflect the redesigned system.
- [ ] 0 serious/critical axe findings on audited routes; aim for 0 A/AA violations.
- [ ] Critical Playwright flows pass.
- [ ] No console/page errors or broken local assets.
- [ ] Lighthouse budgets remain at or above existing project targets unless a documented trade-off is reviewed.
- [ ] Cross-page screenshot montage is manually critiqued.
- [ ] P0/P1 visual defects repaired and re-QA’d.
- [ ] PR created only after rendered evidence.

## 21. Pre-code gate

`PASSED`

The redesign has:
- owner/user goals;
- preserve/change list;
- reference-role synthesis;
- artifact transfer/fidelity decisions;
- concrete visual grammar;
- three composition families;
- page-role composition matrix;
- mobile transformation rules;
- do/do-not boundaries;
- accessibility/motion/system-reality contracts.
