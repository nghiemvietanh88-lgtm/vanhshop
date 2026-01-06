# 💳 Hướng dẫn Setup VNPay

## 1️⃣ Môi trường TEST (Sandbox) - Cho Developer

### Bước 1: Truy cập Sandbox VNPay
1. Mở trình duyệt và vào: **https://sandbox.vnpayment.vn/**
2. Click vào **"Đăng ký Sandbox"** hoặc **"Demo"**

### Bước 2: Đăng ký tài khoản Sandbox
1. Điền thông tin cá nhân:
   - Email
   - Số điện thoại
   - Tên đăng nhập
   - Mật khẩu
2. Xác nhận email
3. Đăng nhập vào tài khoản Sandbox

### Bước 3: Lấy thông tin Test
Sau khi đăng nhập vào Sandbox, bạn sẽ thấy:

1. **Truy cập "Thông tin tích hợp"** hoặc **"Integration Info"**
2. Lấy các thông tin sau:
   - **Terminal Code (TMN Code)**: Mã website
   - **Secret Key (Hash Secret)**: Khóa bí mật để mã hóa
   - **API URL**: URL thanh toán

### Thông tin TEST mặc định VNPay Sandbox:
```env
# VNPay Test Configuration (Sandbox)
VNPAY_TMN_CODE=DEMOMERCH  # Hoặc mã bạn nhận được sau khi đăng ký
VNPAY_SECRET=DEMO_SECRET_KEY  # Hoặc secret key bạn nhận được
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### Tài khoản TEST để thanh toán:
VNPay cung cấp thẻ test để bạn thử nghiệm:

**Thẻ ATM nội địa:**
- Số thẻ: `9704198526191432198`
- Tên chủ thẻ: `NGUYEN VAN A`
- Ngày phát hành: `07/15`
- Mật khẩu OTP: `123456`

**Thẻ quốc tế (Visa/Master):**
- Số thẻ: `4456530000001096`
- Tên chủ thẻ: `NGUYEN VAN A`
- Ngày hết hạn: `12/25`
- CVV: `123`

---

## 2️⃣ Môi trường PRODUCTION (Thật) - Cho doanh nghiệp

### ⚠️ YÊU CẦU:
- ✅ Giấy phép kinh doanh
- ✅ Tài khoản ngân hàng doanh nghiệp
- ✅ Website đã hoàn thiện
- ✅ Hồ sơ pháp lý đầy đủ

### Bước 1: Đăng ký Merchant
1. Truy cập: **https://vnpay.vn/**
2. Click **"Đăng ký"** → **"Đăng ký merchant"**
3. Điền form đăng ký merchant (doanh nghiệp)

### Bước 2: Chuẩn bị hồ sơ
VNPay sẽ yêu cầu:
- Giấy phép kinh doanh
- CMND/CCCD người đại diện
- Giấy ủy quyền (nếu có)
- Thông tin tài khoản ngân hàng nhận tiền
- Thông tin website/app

### Bước 3: Ký hợp đồng
- VNPay sẽ liên hệ qua email/điện thoại
- Gửi hợp đồng hợp tác
- Ký hợp đồng và đóng dấu

### Bước 4: VNPay cung cấp thông tin
Sau khi xét duyệt, VNPay sẽ gửi cho bạn:
- **Terminal Code (TMN Code)**: Mã merchant của bạn
- **Secret Key**: Khóa bí mật
- **URL Production**: https://vnpay.vn/paymentv2/vpcpay.html

### Cập nhật vào `.env`:
```env
# VNPay Production (Thật)
VNPAY_TMN_CODE=YOUR_MERCHANT_CODE  # Mã VNPay gửi cho bạn
VNPAY_SECRET=YOUR_SECRET_KEY        # Secret key VNPay gửi
VNPAY_URL=https://vnpay.vn/paymentv2/vpcpay.html
```

---

## 🧪 KHUYẾN NGHỊ cho Developer

### Trong quá trình phát triển:
1. ✅ **Dùng Sandbox** - Miễn phí, không cần giấy tờ
2. ✅ Test đầy đủ các tính năng thanh toán
3. ✅ Test các trường hợp lỗi (hết tiền, hủy giao dịch, v.v.)

### Khi deploy Production:
1. ⚠️ **Đăng ký Merchant thật** với VNPay (mất 3-7 ngày làm việc)
2. ⚠️ Thay `VNPAY_TMN_CODE` và `VNPAY_SECRET` thật vào `.env`
3. ⚠️ Đổi `VNPAY_URL` thành production URL

---

## 📞 Liên hệ VNPay

**Hotline hỗ trợ:**
- ☎️ **1900 55 55 77**
- 📧 **support@vnpay.vn**

**Website:**
- 🌐 **https://vnpay.vn/**
- 🧪 **Sandbox: https://sandbox.vnpayment.vn/**

**Tài liệu API:**
- 📚 **https://sandbox.vnpayment.vn/apis/docs/**

---

## ✅ Checklist Setup VNPay

### Môi trường Development (Test):
- [ ] Đăng ký tài khoản Sandbox
- [ ] Lấy TMN Code và Secret Key từ Sandbox
- [ ] Cập nhật vào file `.env`
- [ ] Test thanh toán với thẻ test
- [ ] Kiểm tra callback/webhook

### Môi trường Production (Thật):
- [ ] Chuẩn bị hồ sơ pháp lý
- [ ] Đăng ký Merchant với VNPay
- [ ] Ký hợp đồng
- [ ] Nhận thông tin từ VNPay
- [ ] Cập nhật credentials vào `.env`
- [ ] Test kỹ trước khi go-live

---

## 🔐 Bảo mật

**QUAN TRỌNG:**
- ✅ **KHÔNG** commit file `.env` lên Git
- ✅ **KHÔNG** share Secret Key với ai
- ✅ Secret Key phải được giữ bí mật tuyệt đối
- ✅ Chỉ lưu Secret Key trên server backend
- ❌ **KHÔNG BAO GIỜ** đưa Secret Key lên frontend/client
