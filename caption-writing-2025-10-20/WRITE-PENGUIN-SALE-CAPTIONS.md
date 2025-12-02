# Hướng dẫn viết Caption cho Chim Cánh Cụt Sale - VL London

## Tổng quan

Hướng dẫn này giúp bạn viết caption chuyên nghiệp cho **Chim Cánh Cụt Sale** (16/11/2025 - 30/11/2025) dành riêng cho **VL London**. Bạn sẽ sử dụng dữ liệu sản phẩm từ `products-generated.json` và hướng dẫn thương hiệu từ thư mục `brands/` để tạo nội dung quảng cáo trên mạng xã hội và các kênh khác.

**LƯU Ý:** Tài liệu này dành RIÊNG cho **VL London**:
- **Ngôn ngữ:** Tiếng Việt (toàn bộ)
- **Tông giọng:** Ấm áp, thân thiện, thảo luận trực tiếp
- **Footer:** Footer tiếng Việt từ `captions/brand/vllondon-footer.md`

Tất cả caption được viết bằng tiếng Việt, không trộn lẫn tiếng Anh.

---

## Bối cảnh chiến dịch: Chim Cánh Cụt Sale

**Chi tiết chiến dịch:**
- **Thời gian:** 16/11/2025 - 30/11/2025 (2 tuần)
- **Địa điểm:** VL London (quảng bá trên tất cả kênh)
- **Hook chính:** "Ưu đãi kép" - Sản phẩm đã có giảm giá + thêm 10% cho đơn hàng trên £150
- **Tông giọng:** Vui vẻ, lễ hội, nắn ấu (linh vật Chim Cánh Cụt) nhưng chuyên nghiệp
- **Ngôn ngữ:** Tiếng Việt (tất cả caption được viết bằng tiếng Việt)

**Điểm tin nhắn chính:**
- Sự xuất hiện sớm của "Chim Cánh Cụt Sale"—sự kiện đặc biệt, thời hạn có giới hạn
- Giảm giá đa tầng (giảm sản phẩm + giảm giỏ hàng)
- Áp dụng trên tất cả kênh (Facebook, điện thoại, website, showroom)
- Ưu đãi độc quyền lần đầu tiên tại VL London

---

## VL London 🐧

**Thông tin thương hiệu VL London:**
- **Ngôn ngữ:** Tiếng Việt (toàn bộ)
- **Khán giả:** Khách hàng nói tiếng Việt tại Anh Quốc
- **Tông giọng:** Ấm áp, thân thiện, cá nhân hóa ("Anh/Chị"), vui nhộn
- **Hook chiến dịch:** Linh vật Chim Cánh Cụt, kể chuyện, "Chim Cánh Cụt"
- **Footer:** Sử dụng footer tiếng Việt từ `captions/brand/vllondon-footer.md`
- **Lời kêu gọi hành động:** Điện thoại, địa chỉ showroom, các kênh trực tuyến bằng tiếng Việt
- **Ví dụ:** "Anh/chị tranh thủ mua sắm tại VL London!"
- **Liên hệ:** Unit 9, Lombard Trading Estate, London SE7 7SN | 020 8556 5623

**QUY TẮC:** Tất cả nội dung viết cho VL London phải bằng tiếng Việt + footer tiếng Việt. Không trộn lẫn tiếng Anh vào trong caption.

---

## Source Files

### 1. Products JSON (`products-generated.json`)
Contains structured product data with:
- `id`: Unique product identifier
- `category`: Product category (in Vietnamese)
- `productName`: Full product name
- `discountPercentage`: Sale discount % (10%, 20%, 25%, etc.)
- `pricingTable`: Size variants with original and discounted prices
- `images`: Product image URLs (topLeft, topRight, bottomLeft)

**Example Product Structure:**
```json
{
  "id": "product-189",
  "category": "BỘT ACRYLIC + OMBRE",
  "productName": "BlazingStar Maxx Perform - Ombre Collection",
  "discountPercentage": 20,
  "promotionText": "Áp dụng từ ngày 16/11 đến hết ngày 30/11"
}
```

### 2. Brand Guidelines (`brands/` directory)
Each brand has structured information:
- **README.md**: Brand positioning, promise, features, target audience
- **Product Collections**: Organized by category (gel-polish, collections, etc.)
- **Social Media Docs**: Existing social content patterns

**Available Brands for Penguin Sale:**
- `mberry/` — Fashion-forward, trendy, sleek
- `blazingstar/` — Professional, reliable, performance-focused
- `boldberry/` — (explore README.md for positioning)
- `pastel/` — (explore README.md for positioning)

### 3. Campaign Reference (`penguin-sale-announcement.md`)
Vietnamese-language announcement with:
- Campaign overview and urgency messaging
- Discount structure explanation
- Call-to-action for early purchasing
- VL London contact information

---

## Writing Process

### Bước 0: Chuẩn bị - VL London (Tiếng Việt)

**Lưu ý trước khi bắt đầu:**
Tất cả caption được viết cho **VL London** bằng **tiếng Việt**, với tông giọng ấm áp, thân thiện, và footer tiếng Việt. **LUÔN viết caption trong một tệp MD riêng biệt, KHÔNG DÙNG KÝ HIỆU MARKDOWN** (không dùng #, ##, -, *, **, __ hoặc các ký hiệu khác).

**Điều này xác định:**
- Ngôn ngữ xuyên suốt trong caption (Tiếng Việt toàn bộ)
- Tông giọng và giọng nói (Ấm áp, cá nhân hóa)
- Footer tiếng Việt từ `captions/brand/vllondon-footer.md`
- Cách tham khảo thông tin bán hàng/liên hệ
- **Format:** Tệp MD (Markdown) với tên cấu trúc: `captions/[BRAND-PRODUCT-NAME]-CAPTION.md`
- **Kiểu viết:** Văn bản thuần túy (plain text)
  - KHÔNG dùng markdown symbols (# ## - * ** __)
  - KHÔNG dùng tiêu đề phần (FOOTER, LỜI KÊU GỌI HÀNH ĐỘNG, v.v.) — để nội dung thuần túy
  - Dùng dòng trống để tách các phần
  - Nội dung chính → Giá cả → CTA → Footer, theo thứ tự tự nhiên

**Tài liệu tham khảo:**
- Kiểm tra `WRITE-PENGUIN-SALE-CAPTIONS.md` (tệp này) để biết hướng dẫn về giọng nói, tông và phong cách
- Tham khảo README.md của thương hiệu để biết vị trí sản phẩm và tính năng
- Xem lại các caption tương tự trong thư mục này để tham khảo định dạng

**Viết điều này ở đầu tài liệu làm việc của bạn:** ví dụ: "VL London — Caption Tiếng Việt"

### Bước 1: Chọn sản phẩm và thương hiệu

1. Mở `products-generated.json` và chọn một sản phẩm
2. Ghi chú `productName` và xác định thương hiệu nào sản phẩm đó thuộc về:
   - Sản phẩm BlazingStar → `brands/blazingstar/`
   - Sản phẩm MBerry → `brands/mberry/`
   - Sản phẩm Bold Berry → `brands/boldberry/`
   - Sản phẩm Pastel → `brands/pastel/`
3. Đọc README.md của thương hiệu để hiểu giọng nói và vị trí thương hiệu

**Ví dụ kết nối:**
- Sản phẩm: "BlazingStar Maxx Perform - Ombre Collection"
- Thương hiệu: BlazingStar
- Vị trí thương hiệu: Chuyên nghiệp, đáng tin cậy, tập trung vào hiệu suất

### Bước 2: Trích xuất thông tin sản phẩm

Từ `products-generated.json`, thu thập:
- **Tên sản phẩm:** ví dụ: "BlazingStar Maxx Perform - Ombre Collection"
- **Danh mục:** ví dụ: "BỘT ACRYLIC + OMBRE" (Bột Acrylic + Ombre)
- **Giảm giá:** ví dụ: Giảm 20%
- **Kích thước/Biến thể chính:** Từ mảng pricingTable
- **Thời kỳ quảng bá:** 16/11 - 30/11/2025

**Lưu ý:** Giá hiển thị bao gồm giá gốc và giá giảm. Sử dụng chúng để chính xác khi đề cập đến tiết kiệm.

### Bước 3: Tham khảo hướng dẫn thương hiệu

Từ `brands/<brand>/README.md`, ghi chú:
- **Lời hứa thương hiệu:** Mệnh đề giá trị cốt lõi
- **Tính năng chính:** Đặc điểm nổi bật (ví dụ: Cọ Ultra Smooth cho MBerry)
- **Tông giọng:** Cách thương hiệu nói chuyện (ví dụ: thời thượng, chuyên nghiệp, thời trang)
- **Khán giả mục tiêu:** Ai mà thương hiệu phục vụ

### Bước 4: Cấu trúc Caption của bạn

Sử dụng mẫu này làm điểm khởi đầu:

#### Caption Mạng xã hội (Instagram/Facebook)

```
[HOOK - Tại sao sản phẩm này, tại sao bây giờ]
[Tên sản phẩm + danh mục + tính năng chính]
[Lợi ích trong hành động — kỹ thuật hoặc trực quan]
[Tin nhắn giảm giá + cảm giác khẩn cấp]
[Lời kêu gọi hành động với liên kết/chi tiết cửa hàng]
[Branding Chim Cánh Cụt nếu thích hợp]
```

#### Caption Ví dụ (Bold Berry French Pearl Cateye) — Tiếng Việt:

Sáng như gương, bóng như ngọc trai, màu mắt mèo hoàn hảo cho mùa Giáng Sinh! ✨

Bold Berry - French Pearl Cateye
- Hạt magnetic siêu mịn tạo hiệu ứng mắt mèo trong trẻo & long lanh như gương
- 36 màu trendy, phù hợp mọi tông da và phong cách thời trang
- Kết cấu trong suốt, mượt mà - dễ ứng dụng, tạo design chỉ với vài bước đơn giản
- Tinh tế nhưng đủ nổi bật, Anh Chị thợ thoải mái tư vấn cho khách, tăng tiền 'T'

🐧 CÁNH CỤT SALE - giảm thêm 10% cho đơn hàng trên £150!
⏳ Chỉ áp dụng trong: 16/11 - 30/11

£288.00 Set 36 màu 15ml Giảm 25% Còn £216.00
£8.00 Riêng lẻ 15ml (mua < 6 chai) Giảm 0% Còn £8.00
£8.00 Riêng lẻ 15ml (mua ≥ 6 chai) Giảm 10% Còn £7.20
£8.00 Riêng lẻ 15ml (mua ≥ 12 chai) Giảm 20% Còn £6.40

Anh/Chị tranh thủ sở hữu bộ sưu tập Bold Berry mắt mèo tại VL London! 🐧

🏪 VL London Nails & Beauty Supplies
📍 Địa chỉ: Unit 9, Lombard Trading Estate, 51 Anchor and Hope Ln, London SE7 7SN
☎️ Điện thoại: 020 8556 5623
🕘 Giờ mở cửa: Chủ Nhật–Thứ Năm 9:30–18:30; Thứ Sáu 9:30–17:30
💎 Mời Anh/Chị đăng ký mua hàng online tại MyVL để nhận ưu đãi và tích điểm đổi thưởng

### Bước 5: Áp dụng giọng nói thương hiệu (Khớp với tông chiến dịch công bố)

Tệp `penguin-sale-announcement.md` sử dụng **tông giọng ấm áp, thảo luận, tập trung vào tiếng Việt** với:
- Nói trực tiếp với khách hàng ("Anh/Chị khách hàng thân thương" — khách hàng thân yêu)
- Ngôn ngữ vui nhộn, kể chuyện (Chim Cánh Cụt đến sớm)
- Nhiệt tình với nhấn mạnh (định dạng IN ĐẬM, nhiều biểu tượng cảm xúc)
- Tính khẩn cấp rõ ràng ("tranh thủ chốt đơn sớm" — vội vàng đặt hàng sớm)
- Kết hợp thông báo chính thức và ấm áp bình thường

**Caption của bạn nên phản ánh tông giọng này trong khi vẫn thích hợp với thương hiệu.**

**Ví dụ MBerry (Thời thượng, bóng bẩy, hiện đại) — Tông tiếng Việt:**
- Sử dụng ngôn ngữ thời trang bằng tiếng Việt: "kiểu dáng," "thời thượng," "hiện đại"
- Nhấn mạnh thiết kế và xu hướng bằng ngôn ngữ tập trung vào phong cách
- Nhắm mục tiêu đến các chuyên gia sáng tạo và những người dẫn đầu xu hướng
- Tông ấm áp, khuyến khích
- Ví dụ: "Những màu sắc hình thành nên phong cách của anh/chị"
- Ví dụ: "Cho những nghệ sĩ nails có gu thẩm mỹ cao"

**Ví dụ BlazingStar (Chuyên nghiệp, đáng tin cậy, hiệu suất) — Tông tiếng Việt:**
- Sử dụng ngôn ngữ kỹ thuật bằng tiếng Việt: "độ chính xác," "hiệu suất," "kiểm soát"
- Nhấn mạnh độ bền và kết quả chuyên nghiệp với tôn trọng
- Nhắm mục tiêu những người thực hành nghiêm túc với tông chuyên nghiệp
- Ví dụ: "Hiệu suất mà các chuyên gia tin tưởng"
- Ví dụ: "Chất lượng chuyên nghiệp dành cho những người có trách nhiệm"
- Giữ nhiệt tình nhưng dựa trên năng lực

**Khớp tông từ Thông báo:**
- ✓ Sử dụng nói chuyện cá nhân hóa ("Anh/Chị")
- ✓ Bao gồm nhiệt tình với biểu tượng cảm xúc và nhấn mạnh (nhưng tiết chế)
- ✓ Tạo cảm giác khẩn cấp mà không quá nặng tay ("Tranh thủ," "Số lượng có hạn")
- ✓ Đề cập VL London như điểm đến/cộng đồng
- ✓ Ăn mừng đợt giảm giá như một sự kiện đặc biệt (Chuyến thăm của Chim Cánh Cụt!)
- ✓ Kết thúc bằng CTA rõ ràng, hướng tới hành động

**Ví dụ Boldberry (Khám phá tài liệu thương hiệu):**
- Đọc README.md để biết vị trí cụ thể
- Khớp tông và giá trị trong caption trong khi duy trì ấm áp của thông báo

### Bước 6: Kết hợp tin nhắn bán hàng

**Thứ bậc tin nhắn chính:**
1. **Sự xuất sắc sản phẩm** (những gì làm cho nó đặc biệt)
2. **Giảm giá bán hàng** (ưu đãi Chim Cánh Cụt Sale)
3. **Tiết kiệm kép** (giảm sản phẩm + 10% thêm cho đơn hàng trên £150)
4. **Cảm giác khẩn cấp** (cửa sổ 2 tuần hạn chế)
5. **Nơi mua** (kênh có sẵn)

**Cụm từ bán hàng để sử dụng (bằng tiếng Việt):**
- "Chim Cánh Cụt Sale: Giảm [discount]%"
- "Ưu đãi kép: Giảm [discount]% + thêm 10% cho đơn hàng trên £150"
- "Có hạn thời gian: 16/11 - 30/11"
- "Áp dụng trên tất cả kênh: Facebook, website, điện thoại, showroom VL London"
- "Tranh thủ mua sắm trước khi Chim Cánh Cụt bay đi!"
- "Đây là lần đầu tiên, anh/chị hãy không bỏ lỡ!"

### Bước 7: Bao gồm tất cả các phần tử cần thiết

✓ **Tên sản phẩm** (từ JSON)
✓ **Tên thương hiệu** (xác định từ sản phẩm)
✓ **Lợi ích/tính năng chính** (từ thương hiệu README)
✓ **Giảm giá bán hàng** (từ JSON discountPercentage)
✓ **Tham khảo Chim Cánh Cụt Sale** (hook lễ hội, thời gian giới hạn)
✓ **Nơi mua** (kênh hoặc liên kết cửa hàng)
✓ **Lời kêu gọi hành động** (Mua ngay, Tìm hiểu thêm, v.v.)

---

## Hướng dẫn ngôn ngữ & tông giọng

### Cho VL London (Tiếng Việt) 🐧

- **Chuyên nghiệp nhưng dễ tiếp cận:** Cân bằng chuyên môn với sự thân thiện sử dụng tiếng Việt dễ hiểu
- **Cụ thể hơn cách nói quá đáo:** Chỉ khiếu nại những gì được ghi chép (ví dụ: "giữ màu sắc suốt tuần" ✓ vs. "vĩnh viễn lâu dài" ✗)
- **Quét ngang:** Sử dụng dấu đầu dòng cho tính năng/lợi ích (dễ đọc nhanh)
- **Lễ hội nhưng phù hợp với thương hiệu:** Tham khảo Chim Cánh Cụt (Penguin) một cách vui vẻ, khớp với tông thông báo
- **Ấm áp và cá nhân hóa:** Gọi độc giả là "Anh/Chị," sử dụng tiếng Việt thảo luận
- **Hướng kể chuyện:** Khớp với tường thuật linh vật penguin từ thông báo
- **Bao gồm footer:** Luôn nối footer tiếng Việt (`captions/brand/vllondon-footer.md`)

### Cụm từ tiếng Việt chính cho Chim Cánh Cụt Sale
- "Chim Cánh Cụt" — Penguin (linh vật)
- "Giảm giá" / "GIẢM" — Giảm giá/Bán hàng
- "Ưu đãi đặc biệt" — Ưu đãi đặc biệt
- "Ưu đãi kép" hoặc "BẰNG KỤ ĐÔI" — Giảm giá kép
- "Số lượng có hạn" — Số lượng hạn chế
- "Tranh thủ mua sắm" — Mua sắm vội vàng/Đừng bỏ lỡ
- "Chất lượng chuyên nghiệp" — Chất lượng chuyên nghiệp
- "Kỹ thuật, độ bền" — Kỹ thuật, độ bền

### Cách sử dụng biểu tượng cảm xúc
- Sử dụng tiết chế và có mục đích
- Luôn sử dụng biểu tượng cảm xúc thực, KHÔNG BAO GIỜ các mã biểu tượng cảm xúc (ví dụ: sử dụng 🐧 không phải :penguin:)
- Penguin 🐧 cho hook Chim Cánh Cụt Sale (khớp với linh vật chiến dịch)
- Liên quan đến sản phẩm (💎 cho luxury/polish, 💅 cho nails, ✨ cho ánh sáng)
- Biểu tượng cảm xúc footer: 🏪 (cửa hàng), 📍 (vị trí), ☎️ (điện thoại), 🕘 (thời gian), 💎 (phần thưởng)
- Giữ tông chuyên nghiệp trong khi vui nhộn

### Sắc thái ngôn ngữ tiếng Việt cho VL London

**Ngôn ngữ sáng tạo & dễ nhớ:**
- Sử dụng các phép ẩn dụ có cộng hưởng văn hóa: "pháp sư ngành nail" (pháp sư/nhà thầu nails) thay vì "chuyên gia" chung chung
- Làm cho caption hấp dẫn hơn và dễ nhớ hơn cho khán giả tiếng Việt
- Thêm tính cách trong khi vẫn duy trì tính chuyên nghiệp

**Chiến lược dòng mở đầu:**
- **Phương pháp phân khúc trực tiếp (ưu tiên cho sản phẩm kỹ thuật):** Hook vào nhu cầu/sở thích cụ thể + khuyến khích hành động + linh vật
  - Công thức: "Anh/Chị nào [muốn X / thích Y / cần Z] [hành động khuyến khích] gom hàng CÁNH CỤT." 🐧
  - Ví dụ:
    - "Anh/Chị nào thích vỗ bột thì đợt này tranh thủ gom hàng CÁNH CỤT." 🐧
    - "Reflective biến hình phải cỡ này mới chịu! ✨💎" (tính tư duy + emotion)
  - Ưu điểm: Rõ ràng, cá nhân hóa, dễ nhớ, khác biệt với các hook lấp lửng
  - Có thể dùng xen kẽ: phân khúc hoặc tính tư duy (vui nhộn, playful)
- **Phương pháp tình huống/trải nghiệm (cho dịch vụ, sản phẩm spa, seasonal):** Vẽ tình huống cụ thể + business insight
  - Công thức: "Mùa [X] lại tới, [người cụ thể] đang [hành động cụ thể] - [cơ hội kinh doanh]. [Business insight khách hàng]"
  - Ví dụ:
    - "Mùa staff party lại tới, các chị em ở các công ty đang kéo nhau đi làm đẹp để lên đồ trẩy hội tiệc công ty và Christmas - tiệm nail nếu tận dụng offer được các dịch vụ như Luxury Pedicure, nhấn mạnh vào trải nghiệm khách hàng có thể tăng được doanh thu rất nhiều. Khách đang vui và đi cùng hội bạn rất dễ đồng ý chi thêm ạ!" 🎉✨
    - "Mùa Giáng Sinh khách walk-in đổ về shop như vỡ trận - Anh Chị nào muốn quản lý được dòng khách, ưu tiên những dịch vụ nhanh gọn trước, còn thiết kế phức tạp thì book sang ngày vắng hơn hoặc thời điểm khác. Sắp xếp hợp lý thì mình sẽ ít stress hơn!" 🐧
  - Ưu điểm: Tạo hình ảnh rõ ràng, đưa business context, giúp salon owner thấy cơ hội
  - Hook dài hơn OK nếu mang lại context và insight giá trị
  - Phù hợp với: Dịch vụ trải nghiệm (pedicure spa, group bookings), sản phẩm seasonal
- **Phương pháp khác (nếu phân khúc không phù hợp):**
  - Hook với đề xuất giá trị, tính liên quan theo mùa, câu hỏi chuyên nghiệp, sự phấn khích chiến dịch
  - Ví dụ: "Bột Mùa Đông giá đã tốt nay còn tốt hơn" (theo mùa)
- Tham khảo "CÁNH CỤT" hoặc emoji linh vật trong hook khi thích hợp
- Tạo cảm giác khẩn cấp hoặc phấn khích

**Giọng nói chuyên nghiệp / Định dạng chứng thực:**
- Sử dụng các câu hỏi phản ánh các mối quan tâm thực tế của chủ salon/kỹ thuật viên
- Tập trung vào ROI và tác động kinh doanh: năng suất, sự hài lòng khách hàng, lợi nhuận
- Giải thích "tại sao" những chuyên gia chọn sản phẩm: lợi ích vượt ngoài spécifications
- Ngôn ngữ: "Lựa chọn của những salon nhiều năm trong nghề vì:" (Lựa chọn của các salon có kinh nghiệm vì:)
- Kết nối các tính năng sản phẩm với kết quả kinh doanh
- Sử dụng mũi tên "→" để hiển thị mối quan hệ nguyên nhân-kết quả (ví dụ: "Tiết kiệm thời gian → tăng năng suất")

**Định dạng nội dung giáo dục:**
- Chia sẻ thông tin kỹ thuật hoặc hướng dẫn cùng với quảng cáo sản phẩm
- Đơn giản hóa các quá trình phức tạp: "Quy trình BIAB siêu dễ với Flexibuild X" (Quy trình BIAB rất dễ với Flexibuild X)
- Tập trung vào sức khỏe móng/lợi ích khách hàng: "Bảo vệ móng của khách → khách hài lòng, quay lại nhiều" (Bảo vệ móng của khách → khách hài lòng, quay lại thường xuyên)
- Xóa các số bước nếu nội dung đã ngắn gọn
- Nhấn mạnh lợi ích thực tế so với chi tiết kỹ thuật
- Định vị sản phẩm như giải pháp cho các vấn đề/mối quan tâm phổ biến

**Ngôn ngữ tính năng sản phẩm:**
- Sử dụng tiếng Việt cụ thể, mô tả cho các tính năng sản phẩm:
  - Đối với gel polish: "Mỏng tự nhiên", "Thẩm mỹ cao", "Phù hợp với mọi loại dịch vụ"
  - Đối với bột acrylic: "Tốc độ cứng nhanh", "đắp bột trong thời tiết lạnh"
  - Sử dụng "liquid" thay vì "monomer"—thuật ngữ tiếng Việt dễ tiếp cận hơn
- **Giữ các dấu đầu dòng ngắn gọn, trực tiếp:** Loại bỏ em-dashes và giải thích dài, chỉ nêu tính năng + lợi ích cốt lõi
  - ✓ "Lông cứng, dày phù hợp kỹ thuật vỗ bột truyền thống"
  - ✗ "Lông cứng, dày—kiểm soát tuyệt vời cho kỹ thuật vỗ bột truyền thống"
  - ✓ "Hạt glitter to tạo hiệu ứng reflective bắt ánh sáng từ mọi góc độ"
  - ✗ "Hạt pearl siêu mịn tạo hiệu ứng reflective bắt ánh sáng từ mọi góc độ, tạo sự lung linh siêu ảo"
- **Loại bỏ hoàn toàn các paragraph giải thích dài** nếu đã nêu feature/benefit trong bullets
  - ❌ Không: "Reflective là bảng màu đặc biệt được thiết kế riêng, không có ở bất kỳ thương hiệu nào khác. Hiệu ứng ánh sáng lấp lánh..."
  - ✅ Có: Feature bullet rõ ràng + pricing + banner → footer
- Tránh các phần giải thích không cần thiết nếu tính năng đã làm rõ giá trị
- Để tính năng cốt lõi tự nói cho mình
- Tập trung vào lợi ích thực tế và bối cảnh ứng dụng, không chỉ kỹ thuật

**Nguyên tắc cấu trúc:**
- **Cấu trúc tuần tự:**
  1. Hook (phân khúc trực tiếp hoặc giá trị)
  2. Tên sản phẩm + size/variant
  3. Tính năng (dấu đầu dòng—ngắn gọn, trực tiếp)
  4. Giá cả (TRƯỚC banner sale—không sau)
  5. Banner CÁNH CỤT SALE + thời gian + bonus 10%
  6. CTA (tùy chọn—không bắt buộc)
  7. Footer
- **Loại bỏ phần dự phòng** — Bỏ qua giải thích lợi ích nếu tính năng đã làm rõ
- **Để giá cả/ưu đãi làm việc bán hàng** — Hook mạnh + tính năng rõ ràng + giá hấp dẫn đủ
- **Tin tưởng footer** — Thông tin liên hệ phục vụ như lời kêu gọi hành động ngầm

**Định dạng giá:**
- Hiển thị giá với mũi tên: £40.00 Giảm 10% Còn £36.00
- Rõ ràng, dễ quét, không cần tiêu đề
- Liệt kê các tier cụ thể (mua <5, mua 5+ v.v.) trên từng dòng riêng

**Dấu câu & Dòng chảy:**
- **Tối giản em-dashes trong bullets:** Loại bỏ hoặc dùng sparingly—chỉ khi cần tạo pause tự nhiên
  - Cũ: "Lông cứng, dày—kiểm soát tuyệt vời cho kỹ thuật vỗ bột"
  - Mới: "Lông cứng, dày phù hợp kỹ thuật vỗ bột truyền thống"
- Sử dụng dấu gạch đơn (-) cho phạm vi thời gian/ngày: "9:30-18:30", "Chủ Nhật - Thứ Năm"
- Giữ nó sạch sẽ, quét được, không quá trang trí

**Điều chỉnh tin nhắn Chim Cánh Cụt Sale:**
- Tập trung vào giảm giá BỔ SUNG: "Giảm thêm 10% cho đơn hàng trên £150" (Giảm thêm 10% cho đơn hàng trên £150)
- Không lặp lại giảm giá sản phẩm trong dòng Chim Cánh Cụt Sale—nó đã được liệt kê trong giá cả
- Điều này giữ cho tin nhắn sạch sẽ và tránh dư thừa
- 33% đã được hiển thị trong giá cả, vì vậy nhấn mạnh những gì làm cho Chim Cánh Cụt Sale đặc biệt: 10% bổ sung

**Cải thiện lời kêu gọi hành động:**
- **CTA là tùy chọn—không bắt buộc** nếu mở đầu + tính năng + giá đã rõ ràng và hấp dẫn
- Nếu có CTA: giữ ngắn gọn, hướng tới hành động cụ thể (không lấp lửng)
  - Ví dụ: "Anh/Chị tranh thủ sở hữu bộ cọ Standard BlazingStar để nâng cao kỹ năng! ✨"
- Footer chứa tất cả thông tin liên hệ/hành động cần thiết—tin tưởng nó sẽ thúc đẩy hành động

**Khi quảng cáo myVL.app (Nền tảng mua hàng trực tuyến):**
- Tạo **một section riêng biệt** giữa giá cả và footer để làm nổi bật myVL.app
- Sử dụng **dấu kiểm (✅)** cho từng lợi ích của myVL.app (giao hàng nhanh, đăng ký dễ, ưu đãi, tích điểm)
- Sử dụng ngôn ngữ **ấm áp, thân thiện** cho heading myVL.app: "Mua [Tên sản phẩm] tại myVL.app - Nhanh, Tiện, Tin Tưởng"
- Liệt kê các lợi ích cụ thể:
  - Giao hàng nhanh chóng - Đội riêng biệt chuyên phát từng đơn hàng
  - Đăng ký dễ dàng - Không phức tạp, chỉ vài bước đơn giản
  - Ưu đãi kép - Sản phẩm đã giảm + thêm 10% cho đơn từ £150
  - Tích điểm & Ưu đãi - Mua càng nhiều, nhận thưởng càng lớn
- Sử dụng **"Giá yêu thương"** hoặc **"Giá BlazingStar"** thay vì "Giá gốc & Giảm còn" để tạo tôn ấm hơn
- Kết thúc với CTA ấm áp trước footer: "Anh/Chị tranh thủ đặt [Sản phẩm] tại myVL.app hôm nay để tận hưởng ưu đãi Chim Cánh Cụt Sale!"

---

## Biến thể đa kênh (Tiếng Việt)

### Caption Instagram (Giới hạn ký tự: ~ 2.200)
- Chi tiết đầy đủ, ngôn ngữ tiếng Việt thời thượng, liên kết đến cửa hàng
- Khớp với tông vui nhộn nhưng chuyên nghiệp của thông báo
- Ví dụ: "Kiểu dáng thời thượng trong Chim Cánh Cụt Sale lần đầu tiên! Anh/chị hãy tranh thủ..."

### Bài đăng Facebook (Giới hạn ký tự: không giới hạn)
- Tông thảo luận, lợi ích dài hơn, khuyến khích chia sẻ và bình luận
- Sử dụng cách tiếp cận kể chuyện ấm áp ("Chim Cánh Cụt ghé thăm...")
- Khuyến khích hành động: "Chia sẻ cho bạn bè," "Thích bài viết này"
- Ví dụ: "Anh/chị thân yêu, Chim Cánh Cụt đã mang đến..."

### SMS/WhatsApp (Giới hạn ký tự: 160 ký tự)
- Tiếng Việt cực ngắn gọn, tập trung vào giảm giá, CTA rõ ràng
- Sử dụng "Anh/Chị" để ấm áp ngay cả trong định dạng ngắn
- Ví dụ: "🐧 MBerry Giảm 20% + 10% nữa! 16/11-30/11. Mua ngay tại VL London!"

### Tiêu đề Email (Giới hạn ký tự: 50-70)
- Hook tập trung vào tiếng Việt và cảm giác khẩn cấp bán hàng
- Bao gồm biểu tượng cảm xúc penguin để khớp với chiến dịch
- Ví dụ:
  - "🐧 Chim Cánh Cụt mang đến giảm 20%!"
  - "Tranh thủ: MBerry Giảm 25% - Penguin Sale"
  - "🐧 Ưu đãi kép từ Chim Cánh Cụt lần đầu tiên"

---

## Bảng Dos & Don'ts

### TÓM TẮT CÁC PATTERN CHỦ CHỐT (Learned from User Revisions)

**🎯 Hook Strategy - 5 Preferred Styles:**
1. **Targeting Existing Users:** "Ai dùng quen [brand] không thể nào bỏ qua deal này luôn ạ"
2. **Benefit-Focused:** "Chân ái của tiệm đông khách mùa cao điểm là đây!"
3. **Deal-Focused:** "Deal [brand] chưa bao giờ hấp dẫn hơn"
4. **Playful Vietnamese:** "[Product] 'HOT' lắm, giá lại rất 'mùa đông không lạnh' nữa ạ"
5. **Problem-Solution:** "Tạo điểm nhấn cho dịch vụ tiệm nail không khó, thử ngay [product]"

**❌ AVOID:** "Anh/Chị nào thích X thì..." pattern (overused), generic seasonal statements

**📝 Product Name Format:**
- ✅ "BlazingStar Gel Polish -" (name + dash, NO description after)
- ✅ "Bold Berry French Pearl Cateye" (short name, no dash)
- ❌ "BlazingStar Gel Polish - Autumn Shades Collection" (no subtitle)
- ❌ "BlazingStar Revive Gel Polish - Sơn gel bảo vệ móng" (no tagline)

**🎨 Features - Keep it Ultra Short:**
- 2-3 bullets maximum (80% of captions)
- 1 line per bullet, NO em-dashes
- Playful language: "tua khách", "bánh mì", "HOT", "tiền 'T'"
- Use quotes for slang: 'HOT', 'xịn xò', 'báo' khách

**💰 Pricing Format Revolution:**
- ✅ NEW: £X.XX [CONDITIONS] → £Y.YY
- ✅ "£9.00 SL <12 CHAI → £6.00"
- ✅ "£5.50 15ml SL >= 12 GIẢM THÊM 10% MIX & MATCH → £4.95"
- ❌ OLD: £X.XX Giảm Y% Còn £Z.ZZ
- Use CAPS for deals: "OFF 10%", "MUA 2 TẶNG 1", "TẶNG 2 VỎ"
- Abbreviate quantity: "SL" not "Số lượng"

**🚫 NO CTA in 90% of Captions:**
- Remove: "Anh/Chị tranh thứ sở hữu [product]..."
- Exception: Educational captions with multiple sections
- Let footer do the work

**🗣️ Tone - Ultra Casual & Playful:**
- Use: "Deal này", "bộ này" (not "sản phẩm này")
- Use: "Khô nhanh" → "tăng tốc độ 'tua' khách" (not "tăng năng suất thi công")
- Use: "Chân ái", "chưa bao giờ...hơn", "không thể thiếu"
- Creative expressions: "Bánh mì" (white colors), "tiền 'T'" (tips), "mùa đông không lạnh" (good price)

**✂️ What to Remove:**
- All product explanations after product name
- "Anh Chị ơi" from hooks (too formal → change to "luôn ạ")
- Brand abbreviations like "(BS)", "(BB)", "(MB)"
- Numbered lists for variants/scents → use "Sẵn 8 mùi:" instead
- Formal explanations after pricing
- Business insights that don't add value

**📚 Educational Captions (Special Format):**
- No hook - start with "[Product] là gì?"
- Q&A section format
- Keep educational sections
- Remove formal "Ứng dụng trong salon" headers
- Simplify usage instructions

---

### CHI TIẾT ĐẦY ĐỦ

| ✅ DO | ❌ DON'T |
|--------|----------|
| **Hook - Style 1:** "Ai dùng quen [brand] không thể nào bỏ qua deal này luôn ạ" (targeting existing users) | **Hook:** Quá dài, quá lắt léo, không tạo urgency |
| **Hook - Style 2:** "Chân ái của tiệm đông khách mùa cao điểm là đây!" (benefit-focused, vivid) | **Hook:** Lấp lửng hoặc quá chung chung ("Sản phẩm tuyệt vời...") |
| **Hook - Style 3:** "Deal [brand] chưa bao giờ hấp dẫn hơn" (deal-focused, simple) | **Hook:** Chung chung không vẽ ra tình huống cụ thể |
| **Hook - Style 4:** "[Product] 'HOT' lắm, giá lại rất 'mùa đông không lạnh' nữa ạ" (playful Vietnamese expressions) | **Hook:** Ngắn nhưng không có thông tin giá trị |
| **Hook - Style 5:** "Tạo điểm nhấn cho dịch vụ tiệm nail không khó, thử ngay [product]" (problem-solution) | **Hook:** "Mùa lễ hội đến rồi..." (generic seasonal) |
| **Hook - Mùa cao điểm:** "Mùa staff party lại tới, các chị em đang kéo nhau đi làm đẹp - Anh Chị tranh thủ offer..." | **Hook:** Không có context kinh doanh hoặc tình huống |
| **Hook - Educational:** Không cần hook - bắt đầu ngay với "Top matte là gì?" (for educational captions) | **Hook:** "Anh/Chị nào thích X thì..." (overused pattern) |
| **Product Name:** Chỉ tên sản phẩm + dash - KHÔNG thêm mô tả sau dash | **Product Name:** Thêm mô tả sau dash ("BlazingStar Gel Polish - Autumn Shades Collection") |
| **Product Name:** "BlazingStar Gel Polish -" (kết thúc bằng dash, không text) | **Product Name:** "BlazingStar Gel Polish - Sơn gel bảo vệ móng" |
| **Product Name:** "Bold Berry French Pearl Cateye" (không có dash nếu ngắn) | **Product Name:** Thêm subtitle hoặc tagline ngay sau tên |
| **Features:** Ngắn gọn, trực tiếp — 1 dòng mỗi bullet, KHÔNG có em-dash | **Features:** Dài dòng, có em-dash giải thích quá nhiều |
| **Features:** "Khô nhanh 30-60s → tăng tốc độ 'tua' khách" (dùng → cho cause-effect) | **Features:** "Cure nhanh 30-60s → tăng năng suất thi công" (formal) |
| **Features:** Loại bỏ bullet không cần thiết, giữ 2-3 bullets mạnh nhất | **Features:** Liệt kê 5-7 bullets, nhiều thông tin dư thừa |
| **Features:** Dùng playful language: "tua khách", "bánh mì" (colors), "HOT" | **Features:** Formal business language "năng suất", "thi công" |
| **Features:** "Màu trendy theo xu hướng, trend nào cũng có" (conversational) | **Features:** "Màu trendy theo xu hướng mùa lễ hội → khách thích" (verbose) |
| **Features - Benefit:** "có thêm tiền 'T'" (creative expression for tips) | **Features - Benefit:** "dễ tip" (plain, boring) |
| **Features - Thương hiệu:** "La Palm - thương hiệu nổi tiếng ngành nail ở Mỹ" (add credibility context) | **Features:** Chỉ nêu brand name không có context |
| **Features - Số lượng:** 2-3 bullets tối đa (80% captions) | **Features - Số lượng:** 4+ bullets (quá nhiều) |
| **After Features:** Thêm dòng insight kinh doanh ngắn nếu cần (1 dòng) | **After Features:** Paragraph dài giải thích lặp lại features |
| **After Features:** "Càng mua nhiều càng rẻ" (short, direct benefit) | **After Features:** Giải thích dài về pricing logic |
| **Product Variants:** "Sẵn 8 mùi:" hoặc "8 mùi hương:" (natural language) | **Product Variants:** Numbered list hoặc tiêu đề formal |
| **Pricing Format:** £X.XX [CONDITIONS] → £Y.YY (KHÔNG dùng "Giảm Z% Còn") | **Pricing:** £X.XX Giảm Y% Còn £Z.ZZ (old format) |
| **Pricing Format:** "OFF 10%", "GIẢM THÊM 10%", "MUA 2 TẶNG 1" (caps for deals) | **Pricing:** Lowercase cho deals và promotions |
| **Pricing Example:** "£9.00 SL <12 CHAI → £6.00" | **Pricing:** "£9.00 Lẻ 15ml (SL <12) Giảm 33% Còn £6.00" |
| **Pricing Example:** "£5.50 15ml SL >= 12 GIẢM THÊM 10% MIX & MATCH → £4.95" | **Pricing:** Pricing dài dòng với nhiều từ không cần thiết |
| **Pricing Tier Conditions:** "SL <12", "SL >=12", "SL >= 12" (viết tắt quantity) | **Pricing:** "Số lượng <12", "Số lượng ≥12" (dài dòng) |
| **Pricing - Mix & Match:** "MIX & MATCH" hoặc "mix & match với base và top" | **Pricing:** Không nói rõ mix & match với gì |
| **Pricing - Deal Text:** "TẶNG 2 VỎ", "TẶNG THÊM 6 chai 15ml có gel" (specific, caps) | **Pricing:** "tặng kèm vỏ" (vague, lowercase) |
| **Pricing - Simple:** "OFF 10% → £22.50" (concise) | **Pricing:** "Giảm 10% Còn £22.50" (verbose) |
| **Pricing Title:** Không có title - list pricing trực tiếp sau features | **Pricing:** Thêm title "Giá:" hoặc heading trước pricing |
| **Emoji:** Dùng ký tự thực (🐧 💎 ✨) | **Emoji:** Dùng code (:penguin: :gem:) |
| **Banner:** "🐧 CÁNH CỤT SALE - Giảm thêm 10% cho đơn hàng trên £150!" | **Banner:** Quên "Giảm thêm" - chỉ nói "Giảm 10%" |
| **Banner Time:** "⏳ Chỉ áp dụng trong: 16/11 - 30/11" (keep format) | **Banner Time:** "⏳ Chỉ áp dụng đến hết ngày 30/11" (inconsistent) |
| **CTA:** KHÔNG có CTA trong 90% captions - để footer làm việc | **CTA:** Thêm CTA không cần thiết như "Anh/Chị tranh thủ sở hữu..." |
| **CTA Exception:** CTA OK cho educational captions với nhiều sections | **CTA:** "Mua ngay hôm nay!" (generic, pushy) |
| **Loại bỏ:** Tất cả CTAs dạng "Anh/Chị tranh thủ [action]" | **Giữ:** CTAs lặp đi lặp lại trong mọi caption |
| **Loại bỏ:** Product explanation sau product name | **Giữ:** "BlazingStar Revive Gel Polish - Sơn gel bảo vệ móng" |
| **Loại bỏ:** Đếm số trong lists (1., 2., 3.) cho variants/scents | **Giữ:** Numbered lists cho product variants |
| **Loại bỏ:** Formal explanations sau pricing | **Giữ:** "Giá refill 480ml sau tính toán:" với calculations |
| **Loại bỏ:** "Anh Chị ơi" trong hooks (too formal) | **Giữ:** "Anh Chị ơi" (formal address) |
| **Loại bỏ:** Brand clarification như "(BS)", "(BB)", "(MB)" | **Giữ:** Abbreviations trong product name section |
| **Footer:** Luôn có đầy đủ, dùng emoji thực | **Footer:** Quên emoji, thông tin không đầy đủ |
| **Footer:** Có line "💎 Mời Anh/Chị đăng ký..." (keep consistent) | **Footer:** Quên dòng MyVL registration |
| **Tone:** Ultra casual, playful, dùng slang: "HOT", "xịn xò", "tua khách" | **Tone:** Formal, corporate, "thi công", "năng suất" |
| **Tone:** Dùng quote marks cho slang: 'HOT', 'xịn xò', 'báo' khách | **Tone:** Không dùng quotes, làm mất playful tone |
| **Tone:** "Deal này" "bộ này" (casual demonstrative) | **Tone:** "Sản phẩm này" "bộ sưu tập này" (formal) |
| **Tone Hook:** "Ai dùng quen", "chưa bao giờ...hơn", "không thể thiếu" | **Tone:** Formal product announcement style |
| **Terminology:** Dùng "liquid" không phải "dung dịch" | **Terminology:** Dịch toàn bộ thành tiếng Việt khi nói về liquid |
| **Terminology:** "Đắp bột" cho acrylic, "phủ bột" | **Terminology:** "Thi công bột" (formal) |
| **Terminology:** "Khô nhanh" "cure nhanh" (mix VN/EN) | **Terminology:** All Vietnamese hoặc all English |
| **Terminology - Creative:** "Bánh mì" (cho white powder colors) | **Terminology:** Formal color names only |
| **Terminology - Business:** "'Tua' khách" (service customers quickly) | **Terminology:** "Phục vụ nhiều khách" |
| **Terminology - Benefit:** "Bill tăng", "tiền 'T'" (tips) | **Terminology:** "Doanh thu tăng", "tips" |
| **Vietnamese Expressions:** "Mùa đông không lạnh" (giá tốt) | **Vietnamese Expressions:** Dịch literal "giá ấm áp" |
| **Vietnamese Expressions:** "Không sắm thì lỡ deal tiếc lắm ạ" | **Vietnamese Expressions:** "Đừng bỏ lỡ cơ hội" (formal) |
| **Vietnamese Expressions:** "Double sale luôn Anh Chị ơi" → "Double sale không sắm thì lỡ deal tiếc lắm ạ" | **Vietnamese Expressions:** Keep "Anh Chị ơi" (too formal) |
| **Business Insight:** "Khách đang vui rất dễ đồng ý chi thêm ạ!" (keep where valuable) | **Business Insight:** Insert vào mọi caption kể cả không phù hợp |
| **Business Insight Location:** Hook hoặc after features (1 line max) | **Business Insight:** Paragraph riêng dài dòng |
| **Educational Captions:** Structure khác - sections với Q&A format | **Educational Captions:** Same structure như product captions |
| **Educational Captions:** Remove hook, remove CTA, focus on education | **Educational Captions:** Keep standard caption format |
| **Brand Names in Pricing:** "BlazingStar:", "Bold Berry:", "MBerry:" (no extra text) | **Brand Names:** "BlazingStar (BS):", "Bold Berry (BB):" |
| **Contractions:** "chưa bao giờ", "không thể" (natural speech) | **Contractions:** Avoid contractions, formal grammar |
| **Line breaks:** Dòng trống trước banner, trước footer | **Line breaks:** Không có dòng trống phân tách sections |

---

## Tích hợp Business Tips từ Thực tế

Dựa trên kinh nghiệm của các chủ salon thành công tại UK (từ VL London Livestream - Jenny Vũ & Hồng Lưu), đây là những insights có thể tích hợp vào captions:

### 1. Quản Lý Mùa Cao Điểm (từ business-tips/01-quan-ly-walk-in-mua-giang-sinh.md)

**Insight chính:**
- Mùa Giáng Sinh khách walk-in tăng đột biến, cần có chiến lược quản lý
- Ưu tiên dịch vụ nhanh trước, dịch vụ phức tạp book sang lịch khác
- Thợ có thể làm overtime với lương cao hơn
- Quản lý thời gian tốt = ít stress, tăng doanh thu

**Cách áp dụng vào caption:**
- Hook về tình huống mùa cao điểm: "Mùa Giáng Sinh khách walk-in đổ về như vỡ trận..."
- Gợi ý sản phẩm giúp làm nhanh hơn: "Gel polish này cure nhanh, giúp Anh Chị phục vụ được nhiều khách hơn trong ngày cao điểm"
- Nhấn mạnh lợi ích tiết kiệm thời gian: "Bột acrylic này cứng nhanh → làm được nhiều khách → tăng doanh thu"

**Ví dụ hook:**
- "Mùa Giáng Sinh sắp tới, shop nào cũng đông khách - Anh Chị stock những sản phẩm làm nhanh gọn để phục vụ tối đa khách walk-in nhé!" 🐧

### 2. Tâm Lý Khách Hàng Mùa Lễ (từ business-tips/05-khach-tip-va-tang-qua-giang-sinh.md)

**Insight chính:**
- Có 2 loại khách: tiết kiệm chi phí vì mua quà, hoặc rộng rãi vì vui lễ
- Khách vui và đi nhóm dễ chi tiền hơn
- Khách trung thành không chỉ tip vì lễ, mà vì trân trọng dịch vụ

**Cách áp dụng vào caption:**
- Nhấn mạnh giá trị cho tiền: "Giá sale mà chất lượng không sale - khách hài lòng, tip tự nhiên theo"
- Gợi ý upsell cho nhóm khách: "Khách đi nhóm đến làm đẹp cho tiệc công ty, rất dễ đồng ý thêm dịch vụ ạ!"
- Tạo cảm xúc kết nối: "Dịch vụ tốt tạo khách trung thành, không chỉ trong mùa lễ"

**Ví dụ hook:**
- "Mùa staff party các chị em kéo nhau đi làm nail - Anh Chị tận dụng được lúc khách vui, offer thêm design đặc biệt, doanh thu x2 luôn!" 🎉

### 3. Trang Trí Shop Thu Hút Khách (từ business-tips/04-trang-tri-shop-mua-le-hoi.md)

**Insight chính:**
- Trang trí shop theo mùa tạo không khí vui, khách tip nhiều hơn
- Không cần cầu kỳ, đơn giản vẫn bắt mắt
- Trang trí tốt = khách vui mắt, thợ phấn khởi làm việc

**Cách áp dụng vào caption:**
- Liên kết sản phẩm với concept trang trí: "Màu Giáng Sinh này perfect cho shop đã trang trí theme đỏ-xanh-vàng gold"
- Gợi ý tạo trải nghiệm: "Bộ sưu tập màu mùa đông này không chỉ đẹp trên móng, mà còn tạo vibe lễ hội cho cả shop"

**Ví dụ hook:**
- "Shop nào trang trí Giáng Sinh rồi thì stock luôn bộ màu này - khách thấy màu match với decor, dễ chốt design hơn!" 🎄✨

### 4. Xây Dựng Mối Quan Hệ Lâu Dài (từ business-tips/06-cau-chuyen-khach-hang-cam-dong.md)

**Insight chính:**
- Nghề nails không chỉ làm đẹp, mà còn lắng nghe và kết nối
- Khách hàng trung thành tạo từ dịch vụ chân thành, không chỉ tay nghề
- Khách quý mình sẽ ủng hộ lâu dài, giới thiệu thêm nhiều khách

**Cách áp dụng vào caption:**
- Nhấn mạnh chất lượng bền vững: "Dùng sản phẩm chất lượng tốt → khách hài lòng → khách quay lại → khách giới thiệu thêm"
- Tạo cảm xúc: "Mỗi bộ nails đẹp là một kỷ niệm đẹp cho khách - đầu tư vào chất lượng là đầu tư vào tương lai"

**Ví dụ hook:**
- "15 năm trước, một khách hàng đầu tiên đã tin tưởng tay nghề non kém của mình - giờ cả gia đình cô ấy vẫn trung thành. Chất lượng tốt tạo khách trung thành, Anh Chị nhé!" 💎

### 5. Quản Lý Khách Khó (từ business-tips/02-khach-hang-kho-tinh-case-study.md)

**Insight chính:**
- Giữ thái độ chuyên nghiệp, nhẹ nhàng ngay cả với khách khó
- Khách khó sau khi trải nghiệm chỗ khác thường quay lại trở thành trung thành
- Không vì một khách mà ảnh hưởng cả doanh nghiệp

**Cách áp dụng vào caption:**
- Nhấn mạnh sự khác biệt dịch vụ: "Chất lượng và thái độ chuyên nghiệp làm nên sự khác biệt - khách sẽ biết quý"
- Tạo niềm tin: "Dùng sản phẩm cao cấp cho thấy Anh Chị tôn trọng khách, khách cũng sẽ tôn trọng lại"

### Cách Tích Hợp Business Tips Vào Caption:

**Bước 1:** Xác định sản phẩm phù hợp với tip nào
- Sản phẩm làm nhanh → Tip quản lý mùa cao điểm
- Sản phẩm cao cấp → Tip xây dựng mối quan hệ lâu dài
- Sản phẩm seasonal → Tip tâm lý khách mùa lễ

**Bước 2:** Chọn 1-2 insights phù hợp nhất để tích hợp
- Không nhồi nhét quá nhiều tips vào một caption
- Chọn insight có liên quan trực tiếp đến sản phẩm

**Bước 3:** Viết hook hoặc paragraph ngắn với insight
- Đặt ở đầu caption (hook) hoặc sau features (context paragraph)
- Giữ ngắn gọn, 2-3 câu tối đa

**Bước 4:** Kết nối insight với lợi ích sản phẩm
- Dùng mũi tên (→) để thể hiện quan hệ nhân quả
- Ví dụ: "Bột cứng nhanh → phục vụ nhiều khách hơn → tăng doanh thu mùa cao điểm"

**Ví dụ caption tích hợp business tip:**

```
Mùa Giáng Sinh khách walk-in tăng gấp đôi, Anh Chị nào muốn tối ưu doanh thu thì stock ngay gel polish cure nhanh này! 🐧

MBerry Ultra Speed Gel Polish - Bộ 36 màu
- Cure nhanh chỉ 30 giây, tiết kiệm 50% thời gian
- Màu chuẩn, không lem, không chảy
- 36 màu trendy phù hợp mọi phong cách

Cure nhanh → Làm nhiều khách hơn → Tăng doanh thu mùa cao điểm!

🐧 CÁNH CỤT SALE - Giảm thêm 10% cho đơn hàng trên £150!
⏳ Chỉ áp dụng trong: 16/11 - 30/11

£288.00 Set 36 màu 15ml Giảm 25% Còn £216.00

[Footer]
```

### Lưu Ý Khi Dùng Business Tips:

✅ **DO:**
- Dùng insights thực tế, có thể áp dụng được
- Liên kết trực tiếp với sản phẩm đang bán
- Giữ tông chuyên nghiệp nhưng ấm áp
- Tạo giá trị cho salon owner/thợ, không chỉ bán hàng

❌ **DON'T:**
- Dùng quá nhiều tips, làm caption rối
- Nói chung chung không cụ thể
- Làm mất focus vào sản phẩm
- Quá dài dòng, giảm tính quét nhanh

---

## Những sai lầm thường gặp cần tránh

❌ **Hook quá chung chung** — Không phân khúc (dùng "Anh/Chị nào thích X" thay vì chỉ "Sản phẩm tuyệt vời")
❌ **Hook không vẽ tình huống** — Nói chung chung "Mùa lễ hội đến" thay vì "Mùa staff party lại tới, các chị em đang kéo nhau đi làm đẹp"
❌ **Hook quá ngắn mà không có giá trị** — Ngắn gọn tốt, nhưng phải có context/insight, không phải ngắn rỗng
❌ **Feature bullets quá dài** — Dùng em-dashes để giải thích quá nhiều thay vì trực tiếp
❌ **Feature bullets quá nhiều** — Liệt kê 5-7 bullets khi chỉ cần 3-4 bullets mạnh nhất
❌ **Lặp lại thông tin** — Paragraph giải thích lặp lại những gì đã nói trong hook
❌ **Giá sau banner sale** — Cấu trúc sai (phải: pricing → banner → CTA → footer)
❌ **Quên bonus 10%** — Luôn nhắc "giảm thêm 10% cho đơn hàng trên £150"
❌ **Quên cửa sổ bán hàng** — Luôn đề cập 16/11 - 30/11
❌ **Dùng emoji code** — Sử dụng ký tự thực (:penguin: ❌ → 🐧 ✅)
❌ **Phần giải thích dài** — Loại bỏ paragraph "Tại sao..." nếu feature đã làm rõ giá trị
❌ **CTA khô khan** — "Mua ngay hôm nay" thay vì "Anh/Chị tranh thủ stock hàng ạ - làm giàu bốn mùa hihi!"
❌ **Thiếu business insight** — Không đưa ra lời khuyên kinh doanh cụ thể cho salon owner
❌ **Lạm dụng biểu tượng cảm xúc** — Giữ tối thiểu, có mục đích, không quá trang trí

---

## Ví dụ: Quy trình Caption hoàn chỉnh

### Sản phẩm được chọn:
`productName: "BlazingStar Maxx Perform"`, `discountPercentage: 25`

### Thông tin thương hiệu:
Vị trí BlazingStar: "Chuyên nghiệp, đáng tin cậy, tập trung vào hiệu suất"
Tính năng chính: Hiệu suất chính xác cho các nghệ sĩ nails
Tông mục tiêu: Sự xuất sắc kỹ thuật, tôn trọng các chuyên gia

### Dự thảo Caption (Tiếng Việt với tông thông báo):

```
Bột acrylic chính xác mà các chuyên gia tin tưởng. ✨

BlazingStar Maxx Perform
• Kiểm soát vượt trội và độ nhất quán cao
• Hiệu suất đáng tin cậy cho mỗi ứng dụng
• Kết quả cấp độ chuyên nghiệp

🐧 Giảm 25% trong Chim Cánh Cụt Sale lần đầu tiên!
⏳ Có hạn: 16/11 - 30/11
+ Giảm thêm 10% cho đơn hàng trên £150

Anh/chị tranh thủ mua sắm tại VL London ngay hôm nay! 🛍️
```

### Ghi chú về tông:
- Mở đầu với khiếu nại chuyên nghiệp ("chuyên gia tin tưởng" — các chuyên gia tin tưởng)
- Sử dụng thuật ngữ tiếng Việt kỹ thuật ("kiểm soát vượt trội," "độ nhất quán")
- Duy trì tông ấm áp với cách xưng "Anh/chị"
- Nhấn mạnh cảm giác khẩn cấp thời gian hạn chế ("lần đầu tiên," "có hạn")
- Khớp với tham khảo penguin lễ hội của thông báo (🐧)
- Kết thúc bằng CTA ấm áp ("tranh thủ" — đừng bỏ lỡ)

#### Caption Ví dụ (BlazingStar Strong Build HF Refill) — Tiếng Việt:

BlazingStar Strong Build HF đã 'xịn xò' còn có chai refill (đối với các màu HF101, 102, 103) ♻️💪

BlazingStar Strong Build HF - Refill 240ml
- Không có HEMA & TPO - An toàn cho khách hàng nhạy cảm, không nóng tay khách
- 'Last', bền chắc đến hơn 4 tuần, dễ tháo, đứng gel - dễ build

Refill giúp Anh Chị mua đúng màu cần thiết, best-seller, tiết kiệm chi phí & không lãng phí.

🐧 CÁNH CỤT SALE - Giảm 10% + Mua 2 Tặng 1 + Tặng 2 Vỏ + Giảm thêm 10% cho đơn hàng trên £150!
⏳ Chỉ áp dụng trong: 16/11 - 30/11

£90.00 Strong Build HF Refill 240ml (lẻ) Giảm 10% Còn £81.00
£90.00 Strong Build HF Refill 240ml (mua 2 tặng 1 + 2 vỏ, Mix & Match) Giảm 40% Còn £54.00

Anh/Chị tranh thủ đặt refill Strong Build HF yêu thích tại VL London! ♻️

🏪 VL London Nails & Beauty Supplies
📍 Địa chỉ: Unit 9, Lombard Trading Estate, 51 Anchor and Hope Ln, London SE7 7SN
☎️ Điện thoại: 020 8556 5623
🕘 Giờ mở cửa: Chủ Nhật–Thứ Năm 9:30–18:30; Thứ Sáu 9:30–17:30
💎 Mời Anh/Chị đăng ký mua hàng online tại MyVL để nhận ưu đãi và tích điểm đổi thưởng

### Ghi chú về tông:
- Hook vui nhộn với 'xịn xò' - ngôn ngữ thân thiện, casual
- Nhấn mạnh lợi ích refill: mua đúng màu cần thiết, tiết kiệm chi phí
- Sử dụng 'best-seller' để tạo tín cậy
- Highlight tính năng an toàn (HEMA & TPO-free) - đặc tính chính
- Pricing rõ ràng: lẻ vs mua 2 tặng 1 (tạo incentive)
- CTA "tranh thủ" phù hợp với tông vui nhộn của campaign
- Emoji ♻️ tăng tính chất lượng bền vững của refill

---

## Danh sách kiểm tra trước khi xuất bản

**Độ chính xác nội dung:**
- [ ] Tên sản phẩm khớp JSON chính xác
- [ ] Giọng nói thương hiệu khớp vị trí README.md
- [ ] Phần trăm giảm giá chính xác (từ JSON)
- [ ] Con số giá cả chính xác
- [ ] Ngày Chim Cánh Cụt Sale được đưa vào (16/11 - 30/11)
- [ ] Cấu trúc bán hàng kép được giải thích (sản phẩm + 10% cho đơn hàng trên £150)

**Phong cách & Tông giọng (theo hướng dẫn WRITE-PENGUIN-SALE-CAPTIONS.md):**
- [ ] Dòng mở đầu có hook với giá trị, tính thời vụ hoặc câu hỏi chuyên nghiệp
- [ ] Các tính năng thương hiệu chính được làm nổi bật bằng ngôn ngữ tiếng Việt mô tả
- [ ] Các dấu đầu dòng ngắn gọn và tập trung vào lợi ích
- [ ] Định dạng "Giá gốc & Giảm còn" được sử dụng cho giá với ký hiệu mũi tên
- [ ] Thông tin liên hệ footer khớp chi tiết hiện tại
- [ ] Tông là chuyên nghiệp, ấm áp, và phù hợp với thương hiệu
- [ ] Không có khiếu nại không được hỗ trợ hoặc jargon kỹ thuật

**Đặc điểm Chim Cánh Cụt Sale:**
- [ ] Tập trung vào giảm giá 10% bổ sung trong dòng Chim Cánh Cụt Sale (không phải giảm sản phẩm)
- [ ] Đối với định dạng chứng thực: Cấu trúc "Lựa chọn của những salon nhiều năm trong nghề vì:" được sử dụng
- [ ] Lợi ích kinh doanh được giải thích (ROI, năng suất, sự hài lòng khách hàng, lợi nhuận)
- [ ] Mũi tên nguyên nhân-kết quả (→) được sử dụng khi thích hợp

**Kỹ thuật:**
- [ ] Em-dashes (—) được sử dụng trong mô tả tính năng
- [ ] Dấu gạch đơn đơn giản (-) được sử dụng trong phạm vi thời gian/ngày footer
- [ ] Việc sử dụng biểu tượng cảm xúc là tối thiểu và có mục đích
- [ ] Liên kết/kênh là hiện tại

---

## Tài nguyên

- **Chi tiết Chim Cánh Cụt Sale:** `penguin-sale-announcement.md`
- **Dữ liệu sản phẩm:** `products-generated.json`
- **Hướng dẫn thương hiệu:** `brands/<brand-name>/README.md`
- **Hướng dẫn Caption chung:** `CAPTIONS-GUIDELINES.md`
- **Liên hệ VL London:** Unit 9, Lombard Trading Estate, London SE7 7SN | 020 8556 5623

---

## Các bước tiếp theo

1. Chọn một sản phẩm từ `products-generated.json`
2. Tìm và đọc README thương hiệu tương ứng
3. **Tạo một tệp MD mới** với tên: `captions/[BRAND-PRODUCT-NAME]-CAPTION.md`
4. Dự thảo caption của bạn sử dụng mẫu được cung cấp trong tệp MD
5. Xác minh tất cả chi tiết so với JSON và hướng dẫn
6. Kiểm tra tông so với giọng nói thương hiệu
7. Kiểm tra CTA và đảm bảo liên kết/kênh chính xác
8. **Lưu và kiểm tra lại tệp MD** trước khi xuất bản
9. Xuất bản caption từ tệp MD trên các kênh đã chọn

**Ví dụ:** Để viết caption cho "Bold Berry French Pearl Cateye", tạo tệp `captions/BOLDBERRY-FRENCH-CATEYE-CAPTION.md`

Chúc bạn thành công với caption Chim Cánh Cụt Sale! 🐧✨
