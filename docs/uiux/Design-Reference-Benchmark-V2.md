# NOVA — Design Reference Benchmark V2

Research date: 2026-09-15
Skill lock: `221370ef294408f3f5a0c6a7fb0567c3db840c3e`
Evidence policy: official production/help sources for product patterns; visual conclusions marked as synthesis rather than usability proof.

## Redesign decision

NOVA already has a credible consumer-banking product model, but the current rendered UI reads too much like a portfolio prototype/dashboard: one large balance, one rounded Money Horizon card, repeated section/list patterns and a desktop rail that can drift toward generic SaaS composition. The redesign must preserve product logic while making the interface feel like a mature daily banking product.

Primary user question: **What can I safely do with my money next, and what needs my attention?**

Preserve:
- Money Horizon / safe-to-spend thesis.
- Home / Activity / Pay / Cards / Save navigation.
- Suspicious transaction → detail → freeze → recovery hero flow.
- Transfer review, KYC recovery and truthful SIMULATED system reality.

Change structurally:
- Money Horizon becomes a financial runway/timeline rather than a chart card.
- Home becomes a decision-first canvas with quick money actions + unified activity.
- Desktop uses an open reading field and contextual lanes rather than a dashboard grid.
- Transaction, card, transfer and KYC page tops use different composition families based on task.
- Reduce container/shadow/radius repetition; hierarchy and alignment do more work.

## Production reference pool

| Reference | Role inspected | What transfers | What does not transfer | Decision |
|---|---|---|---|---|
| Monzo | Home redesign, unified activity, Trends | Full-financial-picture orientation; latest activity in one glanceable feed; upcoming payments matter on Home; complexity ordered rather than hidden | Monzo brand, coral identity, exact account/pot cards | ADOPT unified activity; ADAPT Home hierarchy |
| Wise Personal | Balance/account overview and send-money review | Quiet utility-first composition; strong amount/recipient/fee/ETA hierarchy; consequences before send | Transfer-centric product emphasis and brand surface | ADOPT review clarity; ADAPT visual restraint |
| Apple Card / Wallet | Balance, spending activity, transaction search/detail | Extremely legible amount/status/merchant hierarchy; search by category/merchant/location; period comparison | iOS-native chrome/material and Apple visual identity | ADOPT transaction hierarchy; REJECT clone |
| bunq V5 | Home, Cards, Savings, Profile | Job-based tabs; Home puts accounts/recent activity/send/request together; dedicated Card/Savings jobs | Feature density, rainbow/brand language, stocks/crypto breadth | ADOPT job separation; ADAPT density |
| Revolut | Home actions, activity, cards/security | Fast quick actions and security self-service close to account context | Donut/ring analytics, breadth-heavy density, brand surface | ADAPT quick actions/security; REJECT ring-first analytics |
| N26 | Insights, Spaces, limits | Goals, recurring payments and limits linked to daily banking | Market/plan-specific modules, visual identity | ADAPT goal + commitment integration |

## Page-role reference matrix

| NOVA role | User question | Reference role | Principle extracted | NOVA adaptation |
|---|---|---|---|---|
| Home / money health | “What is safe now and what happens next?” | Monzo Home + bunq Home | Overview + activity + high-frequency actions live together | Safe-to-spend is primary; Financial Runway is the visual signature; risk alert enters before long content |
| Activity | “What changed and can I find a transaction fast?” | Apple Card activity + Monzo feed | Searchable chronological feed with only useful context | Date-grouped activity, status/filter chips, compact monthly comparison; no donut |
| Transaction detail | “Is this mine and what should I do?” | Apple detail + Monzo fraud guidance | Merchant/amount/status first, then factual context and action | Risk explanation explicitly says simulated/needs review; freeze is reversible and consequences precede action |
| Cards | “Is my card safe and what can it do?” | bunq Cards + Revolut security | Card state + direct controls + recent card activity | Card object stays recognizable but supporting UI becomes utility-first, not promotional |
| Transfer | “Am I sending the right amount to the right person?” | Wise transfer | Recipient → amount → review → authentication → receipt | Review includes after-transfer safe-to-spend and Money Horizon impact |
| Savings | “Am I on track without hurting daily cash flow?” | N26 Spaces + bunq Savings | Goal progress + automation context | Goal contribution is visibly part of committed money in the runway |
| KYC / onboarding | “What do you need and how do I recover if capture fails?” | Wise/Revolut/N26 verification | Explain why, one task per step, specific retry guidance | Calm full-height capture/recovery composition; no fake production verification |
| Security / notifications | “What needs action and what can I control?” | Revolut security + Monzo alert model | Actionable, consequence-aware self-service | Structured settings and risk inbox; no generic settings-card grid |

## Extracted design DNA

### Layout grammar
- Mobile is a single decision stream, but not a stack of identical cards.
- Desktop uses a fixed navigation rail + open primary canvas + optional contextual lane.
- The Home first viewport contains: safe-to-spend, 3 quick actions, Financial Runway, and the urgent review entry when present.
- Use section rules, whitespace and aligned columns before containers.
- True objects may use surfaces: card object, risk alert, transfer review, capture frame. Lists and explanatory sections normally stay open.

### Visual hierarchy
- Money/value typography is large but not marketing-display oversized.
- Stable tabular numerals.
- Strong headings, restrained supporting copy, compact status labels.
- One sans family; no luxury/editorial serif dependency.

### Color/surface roles
- Daylight neutral canvas; white/near-white working surfaces.
- Deep forest/graphite ink.
- Jade action/safe role.
- Amber commitment role, slate protected-buffer role, restrained coral risk role.
- No purple fintech gradient, glow or glass.

### Domain-native visual signature
**Financial Runway / Money Horizon V2**: a 14-day planning track that shows safe now, known commitments, protected buffer and dated event markers. It should answer “what changes next?” rather than merely visualizing percentages.

### Interaction
- Quick actions on Home: Send, Request, Move.
- Risk actions stay close to transaction/card context.
- Runway proportions/markers animate only to explain a changed commitment; reduced motion is immediate.
- Authentication and destructive/reversible actions explicitly state consequences.

## Rejected patterns
- Donut/ring as the primary money-health visualization.
- Generic 4-up KPI dashboard.
- One universal rounded card shell for every section.
- Giant decorative debit card on Home.
- Luxury cream + serif editorial banking skin.
- Purple/blue gradients, glow, glassmorphism.
- AI-chat “insights” bubble.
- Confetti or slot-machine money animation.

## Figma-conversion constraint

The redesign uses semantic DOM, regular CSS variables and inline SVG icons; no canvas-based charts or 3D/webgl. Core surfaces should remain straightforward to import/rebuild in Figma while preserving a clear token/component model.

## Phase-1 benchmark gate

- Production/category references: DONE_VERIFIED
- Page-role mapping: DONE_VERIFIED
- Principles + do-not-copy + adaptation: DONE_VERIFIED
- Mobile/performance/accessibility feasibility considered: DONE_VERIFIED
- Measured user superiority: UNKNOWN / not claimed
