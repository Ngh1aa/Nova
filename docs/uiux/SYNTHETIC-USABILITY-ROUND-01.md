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

Lan freezes her card, turns off online payments and lowers her daily card limit.

### What she tries

1. Freezes the card.
2. Turns off Online payments and Contactless.
3. Leaves the page and comes back.
4. Changes the daily card limit.
5. Tries invalid values.

### Simulated comments

> “Ủa mình vừa tắt thanh toán online rồi, sao quay lại nó bật lại vậy? Vậy lúc nãy có lưu chưa?”

> “Mình nhập số này rồi bấm lưu mà không thấy app nói đúng hay sai. Nếu mình nhập nhầm thì sao?”

### Findings

- Card-control choices do not survive navigation or reload.
- Daily limit changes are not really saved.
- Invalid values do not get clear feedback.

### Fix

Persist card settings, make freeze state override payment channels, validate the daily limit and show clear success/error feedback.

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
| Other controls still look usable but do not fully change/persist the result | SU-03, SU-05 | P1 | Open |
| Important money consequences appear too late | SU-01, SU-05 | P1 | Open |
| A saved setting should still be there when the user returns | SU-03 | P1 | Open |
| Security steps must feel believable | SU-04 | P1 | Open |
| Transfer consequences must stay consistent | SU-01, SU-04 | P0 | Fixed / verified |

## Main conclusion

The first P1 iteration closed the Activity interaction-depth gap for SU-02: search, filters, result count, no-results and reset now behave like real product controls and are regression-tested.

The biggest remaining weakness is still interaction depth in the other flows, especially card settings and savings planning.

The next fixes should be:

1. Card settings persistence + daily-limit validation.
2. Savings contribution that really updates Money Horizon.
3. Passcode recovery without a prefilled code.
4. Live transfer impact while entering the amount.
5. Recipient-search dead affordance.

## Portfolio wording

Use:

> Tested with 5 simulated users across money planning, transaction review, card controls, security recovery and savings behavior. Their scenarios were used to expose interaction gaps, prioritize fixes and rerun the prototype after each iteration.

Do not present these five profiles as real research participants unless real participant evidence exists.
