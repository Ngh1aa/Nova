# Nova — Synthetic Usability Round 01 — 2026-09-29

## Presentation label

> Tested with 5 simulated users.

These five profiles are synthetic walkthroughs derived from expert product review and adversarial QA. Their comments are written in everyday language to represent how a normal customer might react while using Nova. They are not real research participants.

## User set

| ID | User | Context | What they care about |
|---|---|---|---|
| SU-01 | Mai, 23 | First full-time job | Knowing how much money she can safely spend |
| SU-02 | Huy, 29 | Freelancer | Finding transactions quickly |
| SU-03 | Lan, 35 | Parent managing household spending | Card controls and spending limits |
| SU-04 | Minh, 27 | Careful about account security | Knowing what happens when verification fails |
| SU-05 | An, 21 | Saving toward an emergency fund | Seeing how saving more affects everyday money |

---

## SU-01 — Mai, 23

### Scenario

Mai checks Nova before sending money. She wants to know whether the transfer will affect bills, savings or the money she keeps aside.

### What she tries

1. Checks Safe to spend.
2. Opens Send Money.
3. Tries a normal amount.
4. Tries an amount above Safe to spend.
5. Continues through review and recovery.

### Simulated comment

> “Mình muốn thấy ngay lúc nhập số tiền là gửi xong còn lại bao nhiêu. Đến màn sau mới báo thì hơi muộn, vì lúc đó mình đã nghĩ là số tiền này ổn rồi.”

### Finding

The transfer flow is now truthful once the user reaches review, but the amount screen should update the projected Safe to spend while the user is typing.

### Fix

Make the impact preview react immediately for normal, above-safe and above-balance values.

---

## SU-02 — Huy, 29

### Scenario

Huy wants to find a specific payment and quickly check pending or unusual transactions.

### What he tries

1. Opens Activity.
2. Searches for a merchant.
3. Presses Needs review, Pending, Recurring and Income.
4. Tries a search that should return nothing.
5. Clears the search and filters.

### Before fix — simulated comments

> “Mình gõ tên cửa hàng mà danh sách vẫn y nguyên. Mình tưởng ô tìm kiếm bị lỗi.”

> “Mình bấm Pending rồi mà các giao dịch khác vẫn còn nguyên, nên mình không biết nút này có chạy không.”

### Before fix — findings

- Search was visible but did not change the list.
- Filter buttons changed their selected appearance but did not filter transactions.
- There was no natural no-results state from these controls.

### Implemented fix

Activity now supports:

- merchant/category/amount search;
- Needs review / Recurring / Pending / Income filters;
- combined search + filter behavior;
- live visible-result count;
- native no-results state;
- one-click clear/reset back to all transactions.

### After fix — simulated re-test

> “Giờ mình gõ ByteMart là ra đúng giao dịch đó luôn. Bấm Pending thì chỉ còn giao dịch đang chờ, nhìn phát là hiểu.”

> “Mình thử gõ linh tinh không có kết quả thì app báo rõ, rồi có nút xoá để quay lại hết danh sách. Vậy dễ dùng hơn nhiều.”

### Re-test result

`DONE_VERIFIED`

The same SU-02 scenario is protected by browser regression coverage: ByteMart search, Pending, Income, Needs review, Recurring, no-results and full reset all passed after merge.

---

## SU-03 — Lan, 35

### Scenario

Lan freezes her card, changes payment-channel preferences and lowers her daily card limit.

### What she tries

1. Turns off Online payments and Contactless from the Cards overview.
2. Opens the detailed Card controls screen and checks whether the choices carried over.
3. Changes Cash withdrawals and Magstripe, leaves the page and comes back.
4. Enters invalid daily-limit values, then saves €900.50.
5. Returns to Cards and checks whether the saved limit appears there.
6. Freezes the card, reloads, opens Card controls while frozen, then unfreezes.

### Before fix — simulated comments

> “Ủa mình vừa tắt thanh toán online rồi, sao quay lại nó bật lại vậy? Vậy lúc nãy có lưu chưa?”

> “Mình nhập số này rồi bấm lưu mà không thấy app nói đúng hay sai. Nếu mình nhập nhầm thì sao?”

### Before fix — findings

- Card-control choices did not survive navigation or reload.
- The Cards overview and detailed Card controls were owned by different runtime layers and could drift apart.
- Daily limit changes were not really saved.
- Invalid values did not get clear feedback.
- Freeze behavior did not authoritatively govern every payment-channel control.

### Implemented fix

Card settings now support:

- persisted Online payments, Contactless, Cash withdrawals and Magstripe preferences;
- one shared stored preference contract across the final Cards v3 overview and detailed Card controls;
- persisted card freeze that disables payment channels without deleting saved preferences;
- preference restoration after unfreeze;
- persisted Daily card limit shown again on the Cards overview;
- inline validation for empty, non-numeric, zero/negative and >€5,000 values;
- inline accessible success feedback for valid saves.

### After fix — simulated re-test

> “Giờ mình tắt thanh toán online rồi quay lại vẫn thấy nó tắt, nên mình biết app đã nhớ lựa chọn của mình.”

> “Khi thẻ đang đóng băng thì mấy nút thanh toán bị khoá hẳn. Mở lại thẻ thì những lựa chọn trước đó vẫn còn, chứ không bị reset.”

> “Mình nhập số sai thì app nói rõ sai ở đâu. Nhập €900.50 rồi quay lại trang Cards vẫn thấy đúng mức đó.”

### Re-test result

`DONE_VERIFIED`

The same SU-03 scenario is protected by browser regression coverage on the final rendered UI: Cards v3 quick controls → detailed Card controls → reload persistence → invalid/valid Daily limit → Cards overview → freeze → frozen reload → detailed frozen controls → unfreeze with saved preferences restored. Nova Visual QA and GitHub Pages both passed after PR #36 merged.

This remains a simulated re-test backed by browser regression and expert inspection, not evidence from a real participant.

---

## SU-04 — Minh, 27

### Scenario

Minh deliberately makes biometric verification fail and tries the fallback option.

### What he tries

1. Reviews a transfer.
2. Starts biometric confirmation.
3. Simulates failure.
4. Checks whether any money moved.
5. Uses passcode fallback.

### Simulated comments

> “Đoạn báo chưa chuyển tiền thì mình thấy yên tâm.”

> “Nhưng sao mã lại có sẵn luôn vậy? Nếu đây là bước bảo mật thì mình nghĩ mình phải tự nhập chứ.”

### Findings

- Recovery messaging is now clear and trustworthy.
- The passcode field is prefilled, which makes the security step feel fake.

### Fix

Use an empty masked field, keep demo guidance outside the field, validate the input and show a clear wrong-code state.

---

## SU-05 — An, 21

### Scenario

An wants to save more each month and understand how that changes the money available for daily spending.

### What she tries

1. Opens Emergency buffer.
2. Changes the monthly contribution.
3. Presses Preview change.
4. Checks Money Horizon.

### Simulated comments

> “Mình tăng tiền tiết kiệm nhưng số tiền còn lại không đổi, nên mình không biết tăng lên có làm mình thiếu tiền tiêu không.”

> “Mình bấm xem trước mà chỉ thấy thông báo thôi. Mình muốn con số bên dưới đổi luôn để dễ hiểu.”

### Findings

- Preview change currently shows a message but does not recompute Money Horizon.
- The user cannot see what happens if the new savings amount becomes too aggressive.

### Fix

Recompute committed money and Safe to spend immediately, update Money Horizon visibly and show a clear shortfall state when needed.

---

## Cross-user synthesis

| Repeated problem | Users affected | Priority | Status |
|---|---|---:|---|
| Activity search/filter controls must change the result | SU-02 | P1 | Fixed / verified |
| Card settings must persist and freeze must remain authoritative | SU-03 | P1 | Fixed / verified |
| Savings controls still look usable without recomputing the result | SU-05 | P1 | Open |
| Important money consequences appear too late | SU-01, SU-05 | P1 | Open |
| Security steps must feel believable | SU-04 | P1 | Open |
| Transfer consequences must stay consistent | SU-01, SU-04 | P0 | Fixed / verified |

## Main conclusion

Two P1 interaction-depth gaps are now closed and regression-tested: Activity for SU-02 and card settings for SU-03. Search/filter controls now change the ledger, and card preferences/limits now behave like persistent product state with an authoritative frozen-card hierarchy.

The biggest remaining interaction-depth gap is Savings: changing the contribution still needs to recompute Money Horizon rather than only acknowledge the action.

The next fixes should be:

1. Savings contribution that really updates Money Horizon.
2. Passcode recovery without a prefilled code.
3. Live transfer impact while entering the amount.
4. Recipient-search dead affordance.
5. Manual accessibility evidence for critical flows.

## Portfolio wording

Use:

> Tested with 5 simulated users across money planning, transaction review, card controls, security recovery and savings behavior. Their scenarios were used to expose interaction gaps, prioritize fixes and rerun the prototype after each iteration.

Do not present these five profiles as real research participants unless real participant evidence exists.
