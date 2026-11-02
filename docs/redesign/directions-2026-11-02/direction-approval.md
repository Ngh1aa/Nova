# Duyệt hướng thị giác: Nova, thiết kế lại toàn bộ (02/11/2026)

**Dự án:** Nova, prototype ngân hàng cá nhân.
**Màn quyết định chính:** Home (dashboard).
**Việc chính của màn:** biết tiêu được bao nhiêu trong 14 ngày tới và xử lý ngay việc cần chú ý.
**Người quyết định:** chủ repo.
**Brief của chủ sản phẩm:** tông pastel; sidebar đen cố định bên trái; nội dung bên phải nằm trong một
khung chữ nhật; card hiện đại, tối giản.

Cả ba hướng dùng chung: sidebar đen nổi (bo 24), khung nội dung bo 28, lưới 3 cột từ 1400 px và 2 cột
từ 768 px, việc cần xử lý ngay cạnh hero, thanh tab đen nổi trên điện thoại, cùng nội dung và dữ liệu.
Bản dựng: `home.html?d=a|b|c` trong thư mục này.

| | Hướng A | Hướng B | Hướng C |
|---|---|---|---|
| Tên ngắn | Tiến hoá ADN | Khối màu pastel | Sổ cái gọn |
| Thứ bậc | Hero aurora pastel, số 60 px | Hero đen, số 72 px, khối nặng nhất trang | Hero trắng viền mảnh, số 52 px, dải aurora mảnh ở đáy |
| Mật độ | Vừa | Thoáng | Gọn (dòng 48 px, icon 32 px) |
| Giọng thị giác | Card trắng trên khung xám nhạt, bóng rất nhẹ | Card tô pastel theo vai trò (xanh trời: hoá đơn, dự báo; bạc hà: tiết kiệm; oải hương: tài khoản; hồng: cảnh báo), không viền không bóng | Khung trắng, card viền 1 px, pastel chỉ trong dữ liệu và chip |
| ADN pastel iOS | Giữ hết, kể cả hero aurora | Giữ vai trò màu pastel, mạnh hơn; hero aurora đổi thành đen (aurora còn trên thẻ ngân hàng) | Giữ vai trò màu nhưng pastel nhạt nhất |
| Phục vụ việc chính | Rõ, quen thuộc | Số tiêu được nổi nhất; màu cho biết nhóm thông tin trước khi đọc | Quét nhiều số nhanh, hợp người dùng hay soát |
| Đánh đổi | Ít khác bản hiện tại | Nhiều màu nền hơn, cần giữ chữ đủ tương phản | Kém "pastel" nhất so với brief |
| Rủi ro | Trông như phiên bản cũ đổi sidebar | Hero đen cạnh sidebar đen có thể nặng ở màn nhỏ | Dễ thành bảng tính, ít cảm xúc |

## Đề xuất

**Hướng đề xuất:** B.
**Lý do:** đúng nhất với brief (pastel rõ, sidebar đen có khối đen thứ hai ở hero để cân), màu pastel mang
vai trò như ADN đã ghi, và tạo một điểm táo bạo duy nhất là con số tiêu được trên nền đen.
**Lấy thêm từ hướng khác:** mật độ dòng của C cho các màn danh sách (Activity, Pay).

## Quyết định

**Trạng thái:** `ĐÃ DUYỆT`
**Hướng được chọn:** B. Khối màu pastel
**Người chọn, ngày:** chủ sản phẩm, 02/11/2026
**Góp ý kèm theo:**
