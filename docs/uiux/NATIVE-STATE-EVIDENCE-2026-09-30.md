# Nova — P1.1 Native Product State Evidence — 2026-09-30

## Status

`DONE_VERIFIED`

P1.1 closes the gap where Empty, Loading and Edge states existed primarily because Recruiter State Lab rewrote the product DOM inside an iframe. Those lifecycle states are now owned by the Nova product runtime and can be opened directly without the review wrapper.

This remains an interactive prototype. The states below simulate product lifecycle conditions; they are not evidence of production bank connectivity, live network behavior or real account data.

## Verification source

Implementation PR: `#48 — feat: move lifecycle states into native Nova routes`

Verified on merged `main` commit:

`d997d7b6bcae16af5df6adf2555fd967fc55389e`

Verification chain:

- UIUX Factory Flow OS passed using pinned Factory commit `11003bf36909b08c3def617023dc8ecd9c3964fd`;
- full Nova Axe/render QA passed on PR #48 after the accessibility fixes described below;
- `qa/native-states.spec.mjs` passed alongside the existing transfer, Activity, Cards, Savings, passcode, recipient and P1.8 accessibility regressions;
- Nova Visual QA passed again on merged `main`;
- GitHub Pages build and deployment passed on the same merged `main` commit.

Factory ownership classification: `PRODUCT / Nova lifecycle-state ownership`.

## Architecture change

Before P1.1, `recruiter-state-lab.html` created several states itself by reaching into the iframe and changing the rendered product. That made the evidence page look complete while the product route itself did not actually own those conditions.

After P1.1:

- State Lab only changes iframe routes;
- State Matrix embeds the product routes directly;
- the product runtime owns Empty, Loading and Edge state rendering through `assets/nova-native-states.js`;
- the existing transfer Error screen remains a native product screen;
- regression explicitly asserts that State Lab injection markers/styles are absent.

Direct evidence routes:

- Empty: `app.html?screen=home&state=empty&pin=1`
- Loading: `app.html?screen=home&state=loading&pin=1`
- Error: `app.html?screen=error`
- Edge: `app.html?screen=home&state=edge&pin=1`

`pin=1` exists only to keep transient Loading visible long enough for review/evidence. Without `pin`, Loading automatically returns to the normal Home route after the simulated recalculation period.

## State 01 — Empty / first-use account

### Product rule

If no account exists, Nova must not display a plausible-looking Safe-to-spend number.

### Native behavior

The direct Empty route shows:

- `Safe to spend unavailable`;
- Balance = `Not connected`;
- Known commitments = `Waiting for account data`;
- Safe to spend = `Not calculated`;
- a `Connect demo account` recovery action;
- a prototype boundary explaining that no real bank connection or credential exchange occurs.

### Result

`PASS`

The regression opens the direct product URL, verifies the unavailable-data language, verifies absence of State Lab injection, activates `Connect demo account`, and confirms that only then does the normal demo account render the €1,300 Safe-to-spend state.

## State 02 — Loading / recalculation

### Product rule

While Money Horizon is being recomputed, Nova should not leave an old spendable number looking authoritative.

### Native behavior

The direct Loading route:

- exposes `aria-busy="true"` and a polite live region;
- states that Nova is recalculating balance, known commitments, planned saving and protected buffer;
- says that money actions remain unavailable until the calculation completes;
- presents a skeleton rather than stale financial values;
- respects `prefers-reduced-motion` by disabling the skeleton shimmer;
- automatically returns to the normal Home state when not pinned for evidence.

### Result

`PASS`

Regression verifies both the pinned evidence state and the unpinned recovery back to normal Home.

## State 03 — Error / transfer revalidation

### Product rule

A change before confirmation must not imply that money moved.

### Native behavior

The existing native Error screen remains the source of truth and exposes:

- `Something changed before confirmation`;
- explicit `No money moved` reassurance;
- `Review again` recovery back to transfer review.

### Result

`PASS`

No State Lab injection is required for this state.

## State 04 — Edge / overcommitted Money Horizon

### Product rule

When known obligations exceed available money, Nova must show the negative planning result rather than clipping it to €0 or hiding the shortfall.

### Native scenario calculation

The Edge state calculates the stress scenario from explicit values:

- Balance: €2,840
- Existing commitments: €780
- Planned goal contribution: €260
- Protected buffer: €500
- Annual tax payment: €9,720

Calculation:

`€2,840 − €780 − €260 − €500 − €9,720 = −€8,420`

### Native behavior

The direct Edge route shows:

- `−€8,420.00` Safe-to-spend result;
- `Overcommitted — not safe to spend`;
- the inputs used in the calculation;
- explicit shortfall status;
- reassurance that this is a simulated stress scenario and no money moved;
- the protected €500 buffer remains visibly reserved;
- recovery paths to review commitments or adjust the Savings preview.

### Result

`PASS`

The negative number is computed inside the product state owner. State Lab no longer patches text to create it.

## Accessibility issue caught during implementation

The first PR browser run did **not** pass.

Axe found real contrast defects introduced by the new native-state UI:

- Empty/Edge small labels used `#7b8799` on `#f8fafc`, approximately `3.47:1`;
- the State Matrix eyebrow used `#657085` on `#eef3f9`, approximately `4.47:1`.

The acceptance criteria were not weakened. The foregrounds were darkened in the product/evidence source and the full gate was rerun.

Final values provide comfortable AA margin for the affected normal/small text, and the subsequent full PR run passed. The same suite passed again on merged `main`.

This failure is retained as evidence because it demonstrates that the QA gate can reject newly introduced portfolio UI rather than simply documenting a predetermined pass.

---

# Tested with 5 simulated users — lifecycle-state walkthrough

These are synthetic scenario walkthroughs, not real research participants. The comments below translate the verified product behavior into ordinary customer language. They must not be presented as external usability-test quotes.

## SU-01 — Mai, 23 — first use with no account

### What she tries

Mai opens Nova before any demo account data is available and wants to know how much she can safely spend.

### Simulated comment

> “Mới vào mà chưa có tài khoản thì app nói thẳng là chưa tính được tiền an toàn để tiêu, chứ không tự hiện một con số nhìn có vẻ thật.”

### Result

`DONE_VERIFIED`

Backed by the direct Empty route and recovery regression.

## SU-02 — Huy, 29 — waiting for a fresh calculation

### What he tries

Huy returns while Money Horizon is recalculating and checks whether an old financial number could be mistaken for the latest one.

### Simulated comment

> “Lúc app đang tính lại thì mình biết là phải chờ, không thấy số tiền cũ rồi tưởng vẫn dùng được.”

### Result

`DONE_VERIFIED`

Backed by the native Loading route, busy semantics and automatic recovery to normal Home.

## SU-03 — Lan, 35 — transfer changes before confirmation

### What she tries

Lan reaches an error just before confirming a transfer and wants to know whether anything has already been sent.

### Simulated comment

> “Nếu có gì thay đổi trước lúc gửi, app nói rõ là tiền chưa đi và cho mình xem lại, vậy mình đỡ lo.”

### Result

`DONE_VERIFIED`

Backed by the existing native Error/recovery route.

## SU-04 — Minh, 27 — obligations exceed available money

### What he tries

Minh opens a stress scenario where a large upcoming tax payment makes the plan deeply overcommitted.

### Simulated comment

> “Khi tiền sắp phải trả nhiều hơn số đang có, mình muốn thấy nó âm thật như vậy. Nhìn €0 thì mình lại tưởng vẫn ổn.”

### Result

`DONE_VERIFIED`

Backed by the native Edge calculation and negative Safe-to-spend regression.

## SU-05 — An, 21 — understanding when a number becomes trustworthy

### What she tries

An moves from first-use or recalculation states back into the normal demo account.

### Simulated comment

> “Bấm vào tài khoản demo thì mới thấy số tiền được tính, còn lúc đang cập nhật thì app tự quay lại khi xong. Mình hiểu lúc nào con số mới đáng tin.”

### Result

`DONE_VERIFIED`

Backed by Empty recovery and unpinned Loading recovery tests.

## Cross-user synthesis

| Pattern | Synthetic users | Evidence | Status |
|---|---|---|---|
| Unknown account data is shown as unavailable, not invented | SU-01 | Direct Empty route | `VERIFIED` |
| Recalculation suppresses stale financial certainty | SU-02, SU-05 | Native Loading + auto recovery | `VERIFIED` |
| Transfer failure explicitly says no money moved | SU-03 | Native Error route | `VERIFIED` |
| Extreme obligations remain visibly negative | SU-04 | Computed Edge route | `VERIFIED` |
| State evidence does not depend on Recruiter State Lab injection | SU-01–05 | Native-state regression + route-only State Lab | `VERIFIED` |

## Portfolio-safe claim

Use:

> Empty, loading, error and overcommitted edge conditions are implemented as native prototype states and regression-tested directly. The recruiter evidence tools only navigate to those product routes; they do not manufacture the states.

Do not claim:

- these states were validated with five real users;
- they represent production bank/network behavior;
- the prototype has live account connectivity;
- the synthetic comments are participant quotes.

## Remaining architecture debt

P1.1 intentionally adds a focused lifecycle-state owner because the current runtime still contains many historical renderer and interaction layers. P2.1 should absorb `nova-native-states.js` together with the other focused P1 modules into one canonical renderer/state architecture rather than adding another downstream override.