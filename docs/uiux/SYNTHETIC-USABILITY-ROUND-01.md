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
3. Watches the impact while changing the amount.
4. Tries €500 as a normal transfer.
5. Tries exactly €1,300.
6. Tries €1,400, above Safe to spend but still inside total balance.
7. Tries €3,000, above the total available balance.
8. Changes the amount back to €145 to see whether the preview returns to normal.

### Before fix — simulated comment

> “Mình muốn thấy ngay lúc nhập số tiền là gửi xong còn lại bao nhiêu. Đến màn sau mới báo thì hơi muộn, vì lúc đó mình đã nghĩ là số tiền này ổn rồi.”

### Before fix — findings

- The amount screen warned about risky values but the Money Horizon preview stayed visually stale.
- The user had to reach review to understand the full consequence of an over-plan transfer.
- Above-balance validation existed at submit, but the impact panel did not explain the blocked state while typing.

### Implemented fix

Transfer amount preview now:

- recalculates projected Safe to spend while the amount changes;
- shows the remaining account balance in the same live preview;
- recomposes Money Horizon for normal transfers;
- treats €1,300 as the exact Safe-to-spend boundary with €0 left safe;
- shows a visible plan shortfall before review when the amount exceeds Safe to spend;
- shows a blocked preview immediately when the amount exceeds total available balance;
- keeps the existing submit validation, so preview feedback does not weaken the transfer rule;
- restores the normal Horizon state when the amount is corrected.

### After fix — simulated re-test

> “Giờ mình gõ €500 là thấy ngay còn €800 để tiêu, nên mình không cần bấm qua màn sau mới biết.”

> “Mình thử đúng €1,300 thì nó báo còn €0, vậy mình hiểu đây là giới hạn tiền mình đang có thể dùng thoải mái.”

> “Nhập €1,400 là nó báo thiếu kế hoạch €100 ngay ở đây. Mình vẫn có đủ tiền trong tài khoản, nhưng nhìn vậy là biết mình đang ăn vào phần đã để dành cho việc khác.”

> “Mình thử €3,000 thì nó nói luôn là không đủ tiền và thiếu €160. Vậy đỡ phải bấm tiếp rồi mới bị chặn.”

> “Sửa lại về €145 thì mấy con số trở lại bình thường, nên mình thấy phần này phản hồi theo số mình đang nhập thật.”

### Re-test result

`DONE_VERIFIED`

The same SU-01 scenario is protected by dedicated browser regression coverage: €145 baseline → €500 normal state → €1,300 boundary → €1,400 plan shortfall → €3,000 blocked preview + submit rejection → correction back to €145. Nova Visual QA and GitHub Pages both passed after PR #42 merged.

This remains a simulated re-test backed by browser regression and expert inspection, not evidence from a real participant.

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
5. Opens passcode fallback.
6. Submits nothing.
7. Tries a short code.
8. Tries a wrong four-digit code.
9. Corrects it with the prototype demo code.
10. Separately checks that Cancel leaves the transfer incomplete.

### Before fix — simulated comments

> “Đoạn báo chưa chuyển tiền thì mình thấy yên tâm.”

> “Nhưng sao mã lại có sẵn luôn vậy? Nếu đây là bước bảo mật thì mình nghĩ mình phải tự nhập chứ.”

### Before fix — findings

- Recovery messaging was clear and trustworthy.
- The passcode field was prefilled, which made the security step feel fake.
- The old dialog closed before it could show a useful wrong-code state.
- There was no believable retry loop inside the passcode fallback.

### Implemented fix

Passcode recovery now:

- opens with an empty masked field;
- keeps the prototype hint outside the credential value;
- says explicitly that no credential is stored;
- rejects empty input;
- rejects invalid length/format;
- shows a wrong-code message without closing the dialog;
- lets the user correct the code and retry in the same task;
- only continues to simulated success after the correct prototype code;
- lets Cancel return to the failed-biometric recovery screen with no transfer completed.

### After fix — simulated re-test

> “Giờ mở lên ô mã trống nên mình thấy hợp lý hơn, ít nhất là mình phải tự nhập.”

> “Mình nhập thiếu số thì app nói rõ, nhập sai thì nó vẫn để mình ở đây để sửa lại chứ không tự nhảy sang chỗ khác.”

> “Mình thử sai trước rồi nhập lại đúng vẫn tiếp tục được, nên cảm giác giống một bước xác nhận thật hơn.”

> “Bấm huỷ thì mình vẫn thấy rõ là chưa có tiền nào được chuyển, vậy mình yên tâm hơn.”

### Re-test result

`DONE_VERIFIED`

The same SU-04 scenario is protected by dedicated browser regression coverage: biometric failure → no-money-moved reassurance → empty masked passcode → empty validation → invalid length → wrong four-digit code → retry → correct prototype code → simulated success, plus a cancel path that leaves the transfer incomplete. Nova Visual QA and GitHub Pages both passed after PR #40 merged.

This remains a simulated re-test backed by browser regression and expert inspection, not evidence from a real participant.

---

## SU-05 — An, 21

### Scenario

An wants to save more each month and understand how that changes the money available for daily spending.

### What she tries

1. Opens Emergency buffer.
2. Changes the monthly contribution.
3. Tries blank, text and negative values.
4. Previews €500 per month.
5. Previews €0 to see a paused contribution.
6. Tries €1,600 to see what happens when the plan becomes too aggressive.
7. Checks Money Horizon after each valid preview.

### Before fix — simulated comments

> “Mình tăng tiền tiết kiệm nhưng số tiền còn lại không đổi, nên mình không biết tăng lên có làm mình thiếu tiền tiêu không.”

> “Mình bấm xem trước mà chỉ thấy thông báo thôi. Mình muốn con số bên dưới đổi luôn để dễ hiểu.”

### Before fix — findings

- Preview change showed a message but did not recompute Money Horizon.
- Invalid contribution values had no useful inline feedback.
- The user could not see what happens if the new savings amount becomes too aggressive.

### Implemented fix

Savings preview now:

- rejects blank, non-numeric, negative and >€10,000 values with inline feedback;
- accepts €0 as a paused-contribution preview;
- recomputes committed money from fixed commitments + the proposed savings contribution;
- recomputes Safe to spend from the current balance, commitments and protected buffer;
- updates the Money Horizon bar, legend and explanation together;
- shows a negative Safe-to-spend / plan-shortfall state when the plan no longer fits;
- states clearly that previewing the change does not move money.

### After fix — simulated re-test

> “Giờ mình đổi lên €500 là thấy ngay còn €1,060 để tiêu, nên mình hiểu tăng tiền tiết kiệm ảnh hưởng chỗ nào.”

> “Nếu mình để €0 thì số tiền còn lại tăng lên, nhìn là biết đây giống như tạm dừng khoản tiết kiệm.”

> “Mình thử €1,600 thì app báo âm €40 và nói kế hoạch đang thiếu €40. Vậy mình biết mức này hơi quá chứ không phải cứ bấm là xong.”

> “Mình nhập linh tinh hay số âm thì app báo ngay, không làm mấy con số phía dưới nhảy theo.”

### Re-test result

`DONE_VERIFIED`

The same SU-05 scenario is protected by dedicated browser regression coverage: baseline €260, invalid input, €500 normal recomposition, €0 pause preview and €1,600 overcommitted preview with a visible €40 shortfall. Nova Visual QA and GitHub Pages both passed after PR #38 merged.

This remains a simulated re-test backed by browser regression and expert inspection, not evidence from a real participant.

---

## Cross-user synthesis

| Repeated problem | Users affected | Priority | Status |
|---|---|---:|---|
| Activity search/filter controls must change the result | SU-02 | P1 | Fixed / verified |
| Card settings must persist and freeze must remain authoritative | SU-03 | P1 | Fixed / verified |
| Savings preview must recompute the money result | SU-05 | P1 | Fixed / verified |
| Important money consequences must appear before review | SU-01 | P1 | Fixed / verified |
| Security recovery must feel believable and retryable | SU-04 | P1 | Fixed / verified |
| Transfer consequences must stay consistent | SU-01, SU-04 | P0 | Fixed / verified |

## Main conclusion

All five synthetic-user interaction gaps currently assigned to SU-01 through SU-05 are now fixed and regression-tested: live transfer impact for SU-01, Activity for SU-02, card settings for SU-03, passcode recovery for SU-04 and Savings for SU-05.

The remaining P1 work is no longer one of these five primary scenario failures. It is now focused on the recipient-search dead affordance, native state ownership and manual accessibility evidence.

The next fixes should be:

1. Recipient-search dead affordance.
2. Manual accessibility evidence for critical flows.
3. Native state ownership where Recruiter State Lab still injects behavior.
4. Runtime-layer consolidation during P2 cleanup.

## Portfolio wording

Use:

> Tested with 5 simulated users across money planning, transaction review, card controls, security recovery and savings behavior. Their scenarios were used to expose interaction gaps, prioritize fixes and rerun the prototype after each iteration.

Do not present these five profiles as real research participants unless real participant evidence exists.
