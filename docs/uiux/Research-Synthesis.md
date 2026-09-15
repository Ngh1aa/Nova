# NOVA — Benchmark Research Synthesis

Research date: 2026-09-15  
Evidence level: Official product/help/support sources unless otherwise noted.

## Competitor matrix

| Product | Target / main JTBD | Primary flow/pattern | Strength to learn | Constraint / weakness signal | Opportunity for NOVA | Adopt / adapt / reject |
|---|---|---|---|---|---|---|
| Revolut | Digital-first users managing daily money, subscriptions and card security | Payments/transactions -> subscriptions; security -> blocked payments; card freeze | Fast self-service security and granular merchant/subscription blocking | Breadth creates feature density (`INFERRED`); subscription blocking does not equal cancelling the merchant relationship (`VERIFIED`) | Make subscription impact explicit and keep security contextual | **ADOPT** direct controls; **ADAPT** into calmer IA; **REJECT** copying its visual identity/ring analytics |
| Monzo | Everyday banking + budgeting | Home/payment feed -> transaction detail; Trends -> Balance/Spending/Targets; freeze from home/card | “Left to spend” incorporates upcoming payments; fraud guidance puts freeze before investigation | Some money-management capabilities vary by plan (`VERIFIED`) | Make “safe to spend” a core first-class home decision, not a secondary analytics destination | **ADOPT** left-to-spend mental model and immediate freeze; **ADAPT** with obligations/goals in one horizon |
| Wise Personal | Transparent transfers + account/card safety | Home -> Send -> recipient -> amount/currency -> payment method/fees/ETA -> review -> send; card freeze; account lockdown | Strong transfer clarity and transparent consequences; freeze nuance is explicit | Product is transfer-centric; holistic money-health is secondary (`INFERRED`) | Bring Wise-like review clarity to transfers and security while making money health central | **ADOPT** review/fee/ETA disclosure and freeze nuance; **ADAPT** to domestic personal-banking context |
| N26 | Mobile banking, budgeting, Spaces and automations | Insights categorization; recurring-payment view; Spaces goals; card limits | Combines categories, goals, automations, spending limits and instant notifications | Features vary by plan/market (`VERIFIED`) and live across multiple modules | Compose goals + commitments into a single decision surface without hiding detail views | **ADOPT** goals/recurring/limits; **ADAPT** into Money Horizon |
| bunq | Feature-rich mobile banking | Dedicated Home/Cards/Savings; Money Insights; card controls; Savings Goals | Strong functional separation by job; granular card settings | Broad capability set can become dense (`INFERRED`) | Use job-based navigation but cap global choices and expose progressive detail | **ADOPT** job-specific tabs/control clarity; **ADAPT** visual density |
| Apple Wallet / Apple Card | iPhone users reviewing card activity and payments | Card -> latest transactions -> transaction detail/search; activity by week/month/year | Extremely legible transaction hierarchy, search by category/merchant/location/date, location context | US Apple Card context and platform-native patterns are not transferable 1:1 | Borrow clarity and transaction-detail hierarchy, not visual identity | **ADOPT** search/detail clarity; **REJECT** cloning iOS-native styling |

## Verified benchmark findings

### Monzo
- Trends exposes spending, balance, targets and an estimate of what is left to spend based on upcoming payments.
- Current “left to spend” can be calculated from balance minus upcoming scheduled payments and included spending categories.
- Fraud/unrecognized-payment guidance tells users to freeze the card, inspect transaction details, then report if still unrecognized.
- Freezing blocks most outbound card payments; refunds can still arrive; unfreeze is available.

### Wise
- Transfer flow: choose recipient -> amount/currency -> payment method with fees and ETA -> review -> send.
- Card freeze is temporary and blocks new payments/ATM; pending and offline transactions may still process.
- Wise account lockdown can log users out, cancel pending transfers, suspend cards and force password reset; recovery uses verification/biometric checks.
- Identity verification may require government ID and a video selfie.

### Revolut
- Onboarding requires contact/personal details, government ID and a selfie; additional account-purpose/tax information can be requested.
- Subscriptions can be viewed in the Payments calendar and blocked; blocking a payment/merchant does not itself cancel the merchant subscription.
- Revolut security guidance recommends freezing a card after unrecognized charges.

### N26
- N26 Insights categorizes spending and can show recurring payments and comparisons to prior spending.
- Spaces are subaccounts with savings goals; Rules/Income Sorter/Round-Ups automate movement into them.
- Card limits are adjustable from Cards -> card -> Limits.
- Identity verification can use ID photo/video + selfie; fallback/troubleshooting paths are documented.

### bunq
- V5 separates Home, Cards and Savings around user jobs.
- Cards can be frozen and configured with limits/country/security settings.
- Money Insights exposes spending categories and comparisons.
- Savings tab exposes goals and progress.

### Apple Card / Wallet
- Users can inspect latest transactions and search by category, merchant, location, date/time period.
- Activity can be viewed weekly/monthly/yearly with prior-period comparison.

## Pattern inventory

### Navigation
- Bottom navigation should contain 4–5 highest-frequency jobs; profile/security can be utility navigation.
- Use contextual entry points from Home to detailed transactions, subscriptions, goals and security instead of duplicating seven equal tabs.

### Dashboard / money health
- Lead with a decision, not an account ledger.
- Show total balance as context; make **Safe to spend** the dominant computed value.
- Show nearest bill/commitment and savings progress adjacent to the decision layer.

### Transactions
- Date-grouped list + search/filter.
- Status is text + icon, never color-only.
- Detail includes merchant, amount, time, status, category, payment/card, reference, and action/help path.
- Suspicious does not equal fraud; label “Needs review” or “Unusual activity”.

### Cards
- Freeze/unfreeze is one tap away from card context and suspicious-transaction context.
- Freeze confirmation must explain what is and is not blocked.
- Controls: online payments, contactless, cash withdrawal, spending limits, optional merchant/region controls.

### Payments / transfer
- Progressive flow: recipient -> amount -> review -> authentication -> confirmation.
- Review shows source, recipient, amount, fee (if any), arrival estimate, note/reference.
- High-risk action requires explicit re-authentication.

### Savings / goals
- Goal progress should coexist with cashflow context, not compete with it.
- Auto-contribution should be transparent and included in committed money when scheduled within the current horizon.

### Subscriptions / upcoming bills
- Detect recurring payment patterns but allow user correction.
- Clearly distinguish “block future card charge” from “cancel subscription with merchant”.

### Search / filters
- Transaction search by merchant, category, amount/date; quick filters for status and recurring.
- Do not bury search in an advanced-filter modal.

### Charts
- Prefer decision-oriented trend lines/bars and Money Horizon.
- Avoid decorative donut charts as the primary finance story.
- Use tabular numerals and accessible labels; chart meaning also available as text.

### Confirmation / destructive actions
- Freeze card: confirmation with impact summary and recovery action.
- Recipient deletion / card replacement: stronger confirmation than reversible actions.
- Never rely only on modal color to convey danger.

### Empty / loading / error
- Skeleton for balance/transaction surfaces.
- Offline state preserves local navigation/readable cached prototype data but blocks simulated money movement.
- Biometric failure offers passcode fallback; do not dead-end.
- Insufficient balance explains required vs available and returns user to amount editing.

### Mobile transformation
- 390: single decision column, bottom nav, bottom sheets, sticky action area.
- 768: wider transaction/detail split where useful; controls can become side sheet.
- 1024/1440: nav rail + primary content + contextual rail; do not turn into a generic 12-card admin dashboard.

## Opportunity statement

> **NOVA will make “what can I safely do with my money next?” clearer than a conventional balance + transaction app by composing available cash, committed bills/subscriptions, savings commitments and near-future obligations into one Money Horizon—then connecting anomalies and actions directly to that context.**

This is a synthesis/hypothesis, not a measured superiority claim.

## Reference source register

Official sources reviewed:

- Monzo Help — Spending, Balance and Targets in Trends: https://monzo.com/help/budgeting-overdrafts-savings/trends-spending-and-balance-web
- Monzo Help — differences between Summary and Trends: https://monzo.com/help/budgeting-overdrafts-savings/web-the-differences-between-Summary-and-Trends
- Monzo Help — reporting an unrecognised payment: https://monzo.com/help/payments-troubleshooting/unrecognised-payment-web
- Monzo Help — reporting fraud / frozen card guidance: https://monzo.com/help/emergencies/report-fraud
- Wise Help — how to send money: https://wise.com/help/articles/2977959/how-do-i-send-money-with-wise
- Wise Help — freeze/unfreeze card: https://wise.com/help/articles/2977977/how-do-i-freeze-or-unfreeze-my-wise-card
- Wise Help — account lockdown: https://wise.com/help/articles/3DaZhGYsnl9nENtZD4Ht0f/how-i-can-lock-down-my-account
- Wise Help — first transfer / ID + video selfie: https://wise.com/help/articles/86BXb0psaAyZIpMWemqFV/sending-money-with-wise
- Revolut Help — getting started: https://help.revolut.com/en-US/help/profile-and-plan/getting-started-with-revolut/
- Revolut Help — subscription management: https://help.revolut.com/en-US/help/card-payments-withdrawals/subscriptions/
- Revolut Help — selfie authentication: https://help.revolut.com/en-US/help/sign-up/how-do-i-upload-a-selfie/
- N26 Support — identity verification: https://support.n26.com/en-fr/account-and-personal-details/verifying-identity/how-to-prove-my-identity
- N26 — budgeting apps / Insights: https://n26.com/en-eu/blog/budgeting-apps/
- N26 Support — Spaces: https://support.n26.com/en-eu/app-and-features/spaces/how-does-spaces-work
- N26 Support — card/transaction limits: https://support.n26.com/en-it/cards/setup-and-usage/what-is-the-maximum-i-can-spend
- bunq Help — Cards Tab: https://help.bunq.com/articles/cards-tab
- bunq Help — Money Insights: https://help.bunq.com/articles/your-budgeting-screen
- bunq Help — Savings Tab: https://help.bunq.com/articles/savings-tab
- bunq Help — V5: https://help.bunq.com/articles/introducing-v5-your-new-bunq-app-experience
- Apple Support — Apple Card spending history: https://support.apple.com/en-om/102329

## Evidence caveats

- Product capabilities vary by country, account tier and release version.
- Public help/product pages reveal documented flows, not full usability quality.
- No private app access or user interviews were performed.
- “Weakness” notes marked `INFERRED` are design synthesis, not verified customer complaints.
