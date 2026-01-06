# 📱 SEED DỮ LIỆU ĐIỆN THOẠI

Script này sẽ tạo dữ liệu giả về điện thoại để test ứng dụng.

## 🎯 Dữ liệu được tạo

### **Categories (3):**
- Điện thoại
- Tablet
- Phụ kiện

### **Brands (6):**
- Apple
- Samsung
- Xiaomi
- OPPO
- Vivo
- Realme

### **Products (6+ sản phẩm điện thoại):**

#### **Flagship:**
1. **iPhone 15 Pro Max** (Apple)
   - 2 variants: 256GB, 512GB
   - Giá: 29.99 - 34.99 triệu
   - Chip A17 Pro, Camera 48MP

2. **Samsung Galaxy S24 Ultra**
   - 2 variants: 256GB, 512GB
   - Giá: 27.99 - 31.99 triệu
   - Snapdragon 8 Gen 3, Camera 200MP

3. **Xiaomi 14 Ultra**
   - 1 variant: 512GB
   - Giá: 24.99 triệu
   - Camera Leica, Sạc nhanh 90W

4. **OPPO Find X7 Ultra**
   - 1 variant: 512GB
   - Giá: 22.99 triệu
   - Camera Hasselblad, Sạc nhanh 100W

#### **Mid-range:**
5. **Samsung Galaxy A55 5G**
   - 2 variants: 128GB, 256GB
   - Giá: 9.49 - 10.49 triệu
   - Camera 50MP OIS

6. **Xiaomi Redmi Note 13 Pro**
   - 1 variant: 256GB
   - Giá: 7.49 triệu
   - Camera 200MP, Sạc nhanh 67W

---

## 🚀 CÁCH SỬ DỤNG

### **Bước 1: Đảm bảo MongoDB đang chạy**
```bash
# Kiểm tra MongoDB
mongosh
```

### **Bước 2: Cấu hình .env**
Đảm bảo `MONGO_URI` trong file `.env` đã đúng:
```env
MONGO_URI=mongodb://localhost:27017/your-database-name
```

### **Bước 3: Chạy seed script**
```bash
cd server
npm run seed
```

### **Output mong đợi:**
```
✅ Connected to MongoDB
🗑️  Clearing existing data...
✅ Data cleared
📁 Seeding categories...
✅ Created 3 categories
🏷️  Seeding brands...
✅ Created 6 brands
📱 Seeding products...
✅ Created 6 products

🎉 SEED COMPLETED SUCCESSFULLY!
📊 Summary:
   - Categories: 3
   - Brands: 6
   - Products: 6

👋 Disconnected from MongoDB
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### **1. Script sẽ XÓA toàn bộ dữ liệu cũ!**
```javascript
await Category.deleteMany({});
await Brand.deleteMany({});
await Product.deleteMany({});
```
⚠️ **CẢNH BÁO:** Script này sẽ xóa TOÀN BỘ categories, brands, và products hiện có!

### **2. Hình ảnh là placeholder**
Các URL hình ảnh trong seed data là placeholder:
- `/public/uploads/products/iphone-15-pro-max.jpg`
- `/public/uploads/brands/apple.jpg`

Bạn cần:
- Upload ảnh thật vào thư mục `server/public/uploads/`
- Hoặc thay URL bằng ảnh online
- Hoặc sử dụng tool upload ảnh trong admin

### **3. Không ảnh hưởng đến Users và Orders**
Script này chỉ seed:
- Categories
- Brands
- Products

Không ảnh hưởng đến:
- Users (Admin, Staff, Customers)
- Orders
- Comments
- Discounts

---

## 🛠️ TÙY CHỈNH DỮ LIỆU

### **Thêm sản phẩm mới:**
Mở file `server/seed.js` và thêm vào array `products`:

```javascript
{
  name: 'Tên sản phẩm',
  desc: 'Mô tả HTML',
  category: phoneCategory._id,
  brand: appleBrand._id,
  tags: ['tag1', 'tag2'],
  overSpecs: [...],
  variants: [
    {
      sku: 'SKU-CODE',
      variantName: 'Variant name',
      price: 10000000,
      marketPrice: 12000000,
      quantity: 100,
      sold: 0
    }
  ]
}
```

### **Thêm brand mới:**
```javascript
{
  name: 'OnePlus',
  slug: 'oneplus',
  image: '/public/uploads/brands/oneplus.jpg',
  isHide: false,
  countProduct: 0
}
```

---

## 📊 KIỂM TRA DỮ LIỆU

### **Sử dụng MongoDB Compass:**
1. Mở MongoDB Compass
2. Connect đến database
3. Xem collections: `categories`, `brands`, `products`

### **Sử dụng CLI:**
```bash
mongosh
use your-database-name
db.products.find().pretty()
db.brands.find()
db.categories.find()
```

### **Kiểm tra trên Admin Panel:**
1. Mở `http://localhost:3000/admin`
2. Vào **Products** → Xem danh sách sản phẩm
3. Vào **Brands** → Xem danh sách thương hiệu
4. Vào **Categories** → Xem danh sách danh mục

---

## 🔄 RESET DỮ LIỆU

Nếu muốn reset và seed lại:
```bash
npm run seed
```

Script sẽ tự động xóa dữ liệu cũ và tạo mới.

---

## 💡 TIPS

### **1. Thêm nhiều variants cho mỗi sản phẩm:**
```javascript
variants: [
  { sku: 'IP15-128-BLK', variantName: '128GB - Đen', ... },
  { sku: 'IP15-256-BLK', variantName: '256GB - Đen', ... },
  { sku: 'IP15-128-WHT', variantName: '128GB - Trắng', ... },
]
```

### **2. Cập nhật số lượng sold để test bestseller:**
```javascript
sold: 100  // Sản phẩm bán chạy
```

### **3. Test giá khuyến mãi:**
```javascript
price: 15000000,       // Giá sau giảm
marketPrice: 20000000  // Giá gốc
// => Giảm 25%
```

---

## 🆘 TROUBLESHOOTING

### **Lỗi: Cannot connect to MongoDB**
```
✅ Kiểm tra MongoDB đang chạy: mongosh
✅ Kiểm tra MONGO_URI trong .env
✅ Kiểm tra port 27017 đang được sử dụng
```

### **Lỗi: ValidationError**
```
✅ Kiểm tra schema model có thay đổi không
✅ Đảm bảo tất cả required fields có giá trị
```

### **Lỗi: Duplicate key**
```
✅ Xóa database và chạy lại
✅ Hoặc thay đổi SKU/slug để unique
```

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, check:
1. MongoDB logs
2. Script output
3. Model schemas trong `server/src/models/`

Happy seeding! 🌱
