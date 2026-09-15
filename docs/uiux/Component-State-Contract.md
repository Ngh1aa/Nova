# NOVA — Component & State Contract

## Required foundation components

- Button / Icon Button
- Input / Amount input
- Search
- Textarea / transfer note
- Select
- Checkbox / Radio / Switch
- Tabs / segmented control
- Badge / status label
- Tooltip
- Dropdown
- Modal / confirmation dialog
- Toast
- Bottom sheet / drawer
- Transaction list / table variant
- Pagination or “load more” where appropriate
- Filter chips / date filter
- Date/time display
- Empty state
- Skeleton/loading
- Inline/form error

## Domain-specific components

### Money Horizon
States:
- loading
- healthy / safe
- tight margin
- overcommitted
- incomplete commitments
- offline/stale data
- details expanded
- reduced motion

### Transaction Row
- completed
- pending
- reversed
- declined
- suspicious / needs review
- recurring/subscription
- refund
- selected/focus

### Transaction Detail
- standard completed
- pending
- reversed
- declined
- suspicious
- already reported
- card frozen
- offline/read-only

### Card Object
- active
- frozen
- system-restricted
- expired (optional prototype state)
- replacement in progress (optional)

### Card Controls
- online payments on/off
- contactless on/off
- cash withdrawal on/off
- daily limit default/editing/saved/error
- freeze default/confirming/frozen/unfreezing

### Transfer
- recipient default/search/empty/new
- amount default/focused/valid/insufficient
- review default/data changed/revalidation needed
- biometric working/success/failed/cancelled
- passcode fallback
- submitting
- success
- error
- offline

### KYC
- intro
- permission prompt
- camera ready
- capture processing
- image quality failure
- unsupported/expired document
- selfie/liveness failure
- submitted/pending
- more info required
- approved (SIMULATED)
- manual review/help

### Savings Goal
- on track
- behind plan
- achieved
- paused contribution
- contribution changed
- insufficient contribution source

### Subscription
- upcoming
- charged
- price changed (optional)
- blocked at bank
- cancellation must be handled with merchant

### Notification
- unread
- read
- action required
- informational
- sensitive preview hidden

## Universal interaction states

Every interactive component used in the prototype must cover applicable:

`default -> hover -> pressed -> focus-visible -> selected -> disabled -> loading -> success/warning/error`

Mobile does not need hover to function.

## Important state copy examples

- **Suspicious:** “Unusual activity — review this transaction.”
- **Frozen:** “Card frozen. New card payments and ATM withdrawals are blocked.”
- **Insufficient:** “You need €84 more to send this amount.”
- **Offline:** “You’re offline. You can review details, but money actions are paused.”
- **Biometric failed:** “We couldn’t verify you. Try again or use your passcode.”
- **Pending:** “Pending — the final amount can change until the merchant completes it.”
- **Reversed:** “Reversed — this payment was returned before completion.”
- **Declined:** “Declined — no money left your account.”

## Component-state evidence page

`component-states.html` must render the states; it is not enough to list state names as text.

Minimum visual matrices:
- Buttons: default / hover / pressed / focus / disabled / loading.
- Inputs: default / focus / filled / error / success / disabled.
- Transaction rows: completed / pending / reversed / declined / suspicious.
- Card: active / frozen / restricted.
- Money Horizon: safe / tight / overcommitted / stale.
- Transfer: ready / insufficient / biometric failed / offline / success.
