import mongoose from 'mongoose';
import Category from './src/models/category.model.js';
import Brand from './src/models/brand.model.js';
import Product from './src/models/product.model.js';
import configs from './src/configs.js';

// Helper: Generate placeholder image URL
const getImageUrl = (category, id) => {
  const baseUrl = 'https://images.unsplash.com/photo-';
  const imageMap = {
    phone: ['1511707767522-2f041c0d48c7', '1610945415295-d9bbf067e59f', '1592286927505-fb5a7c5cf128'],
    laptop: ['1496181133206-80ce9b88a853', '1593642632823-8f785ba67e45', '1517336714731-489689fd1ca8'],
    tablet: ['1544244015-0df4b3ffc6b0', '1585790050230-5dd28404ccaa', '1611532736579-6b16e2b50449'],
    smartwatch: ['1579586337278-3befd40fd17a', '1434494878577-86c23bcb06b9', '1557438159-51eec7a6c9e8'],
    charger: ['1625739218-fcb2e3a81e42', '1583394838336-acd977736f90', '1619683597354-d60c2c79e25f'],
  };

  const ids = imageMap[category] || imageMap.phone;
  const photoId = ids[id % ids.length];
  return `${baseUrl}${photoId}?w=500&h=500&fit=crop`;
};

// Connect to MongoDB
await mongoose.connect(configs.mongoUri);
console.log('✅ Connected to MongoDB\n');

// Clear existing products only
console.log('🗑️  Clearing existing products...');
await Product.deleteMany({});
console.log('✅ Products cleared\n');

// Get existing categories and brands
console.log('📋 Getting existing categories and brands...');
const categories = await Category.find({});
const brands = await Brand.find({});

const categoryMap = {};
categories.forEach(cat => {
  categoryMap[cat.slug] = cat._id;
});

const brandMap = {};
brands.forEach(brand => {
  brandMap[brand.slug] = brand._id;
});

console.log(`✅ Found ${categories.length} categories and ${brands.length} brands\n`);

// Product data
console.log('📱 Seeding products...\n');

const productData = [
  // ĐIỆN THOẠI - APPLE
  {
    name: 'iPhone 15 Pro Max',
    desc: '<h3>Titan cao cấp - Chip A17 Pro</h3><p>Màn hình Super Retina XDR 6.7 inch với ProMotion 120Hz, Camera chính 48MP với Telephoto 5x, chip A17 Pro 3nm mạnh mẽ</p>',
    category: categoryMap['dien-thoai'],
    brand: brandMap['apple-store'],
    tags: ['flagship', '5G', 'titan', 'pro'],
    warrantyPeriod: 12,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Màn hình', values: ['6.7 inch', 'Super Retina XDR', '120Hz'] },
      { name: 'Camera', values: ['48MP', 'Telephoto 5x 12MP'] },
      { name: 'Chip', values: ['Apple A17 Pro'] },
      { name: 'Pin', values: ['4422 mAh', 'Sạc nhanh 27W'] }
    ],
    variants: [
      { sku: 'IP15PM-256', variantName: '256GB Titan Tự Nhiên', price: 29990000, marketPrice: 34990000, quantity: 50, sold: 15, thumbnail: getImageUrl('phone', 0), pictures: [] }
    ],
    views: 1250,
    isHide: false
  },
  // ĐIỆN THOẠI - SAMSUNG
  {
    name: 'Samsung Galaxy S24 Ultra',
    desc: '<h3>AI thông minh - Camera 200MP</h3><p>Màn hình Dynamic AMOLED 2X 6.8 inch, Camera 200MP với AI, Snapdragon 8 Gen 3, S Pen</p>',
    category: categoryMap['dien-thoai'],
    brand: brandMap['samsung'],
    tags: ['flagship', '5G', 'AI', 's-pen'],
    warrantyPeriod: 12,
    origin: 'Việt Nam',
    overSpecs: [
      { name: 'Màn hình', values: ['6.8 inch', 'Dynamic AMOLED 2X', '120Hz'] },
      { name: 'Camera', values: ['200MP', 'Telephoto 10x'] },
      { name: 'Chip', values: ['Snapdragon 8 Gen 3'] }
    ],
    variants: [
      { sku: 'S24U-256', variantName: '256GB Đen', price: 27990000, marketPrice: 31990000, quantity: 60, sold: 25, thumbnail: getImageUrl('phone', 1), pictures: [] }
    ],
    views: 980,
    isHide: false
  },
  {
    name: 'Samsung Galaxy A55 5G',
    desc: '<h3>Tầm trung cao cấp</h3><p>Màn hình Super AMOLED 6.6 inch, Camera 50MP OIS, pin 5000mAh</p>',
    category: categoryMap['dien-thoai'],
    brand: brandMap['samsung'],
    tags: ['mid-range', '5G'],
    warrantyPeriod: 12,
    origin: 'Việt Nam',
    overSpecs: [
      { name: 'Màn hình', values: ['6.6 inch', 'Super AMOLED', '120Hz'] },
      { name: 'Camera', values: ['50MP OIS'] }
    ],
    variants: [
      { sku: 'A55-128', variantName: '128GB Xanh', price: 9490000, marketPrice: 10990000, quantity: 100, sold: 45, thumbnail: getImageUrl('phone', 2), pictures: [] }
    ],
    views: 1580,
    isHide: false
  },
  // ĐIỆN THOẠI - XIAOMI
  {
    name: 'Xiaomi 14',
    desc: '<h3>Camera Leica - Snapdragon 8 Gen 3</h3><p>Camera Leica 50MP, Snapdragon 8 Gen 3, sạc 90W</p>',
    category: categoryMap['dien-thoai'],
    brand: brandMap['xiaomi'],
    tags: ['flagship', '5G', 'leica'],
    warrantyPeriod: 18,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Camera', values: ['Leica 50MP'] },
      { name: 'Chip', values: ['Snapdragon 8 Gen 3'] }
    ],
    variants: [
      { sku: 'MI14-256', variantName: '256GB Đen', price: 19990000, marketPrice: 22990000, quantity: 55, sold: 22, thumbnail: getImageUrl('phone', 0), pictures: [] }
    ],
    views: 680,
    isHide: false
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro',
    desc: '<h3>Camera 200MP - Sạc 67W</h3><p>Camera 200MP, sạc nhanh 67W, pin 5100mAh</p>',
    category: categoryMap['dien-thoai'],
    brand: brandMap['xiaomi'],
    tags: ['mid-range', '5G'],
    warrantyPeriod: 18,
    origin: 'Việt Nam',
    overSpecs: [
      { name: 'Camera', values: ['200MP'] },
      { name: 'Pin', values: ['5100 mAh', 'Sạc 67W'] }
    ],
    variants: [
      { sku: 'RN13P-256', variantName: '256GB Tím', price: 7490000, marketPrice: 8990000, quantity: 150, sold: 78, thumbnail: getImageUrl('phone', 1), pictures: [] }
    ],
    views: 2150,
    isHide: false
  },
  // ĐIỆN THOẠI - OPPO
  {
    name: 'OPPO A79 5G',
    desc: '<h3>5G giá rẻ - Pin 5000mAh</h3><p>5G giá tốt, pin 5000mAh, sạc 33W</p>',
    category: categoryMap['dien-thoai'],
    brand: brandMap['oppo'],
    tags: ['budget', '5G'],
    warrantyPeriod: 12,
    origin: 'Việt Nam',
    overSpecs: [
      { name: 'Pin', values: ['5000 mAh'] }
    ],
    variants: [
      { sku: 'A79-128', variantName: '128GB Xanh', price: 5990000, marketPrice: 6990000, quantity: 100, sold: 48, thumbnail: getImageUrl('phone', 2), pictures: [] }
    ],
    views: 1240,
    isHide: false
  },
  // ĐIỆN THOẠI - REALME
  {
    name: 'Realme C55',
    desc: '<h3>Pin trâu - Sạc 33W</h3><p>Pin 5000mAh, sạc nhanh 33W, camera 64MP</p>',
    category: categoryMap['dien-thoai'],
    brand: brandMap['realme'],
    tags: ['entry', 'budget'],
    warrantyPeriod: 12,
    origin: 'Việt Nam',
    overSpecs: [
      { name: 'Camera', values: ['64MP'] },
      { name: 'Pin', values: ['5000 mAh'] }
    ],
    variants: [
      { sku: 'RMC55-128', variantName: '128GB Đen', price: 4490000, marketPrice: 5490000, quantity: 200, sold: 120, thumbnail: getImageUrl('phone', 0), pictures: [] }
    ],
    views: 3120,
    isHide: false
  },
  // MÁY TÍNH BẢNG - APPLE
  {
    name: 'iPad Pro M2 11 inch',
    desc: '<h3>Chip M2 - Liquid Retina</h3><p>Chip M2, ProMotion 120Hz, Apple Pencil 2</p>',
    category: categoryMap['may-tinh-bang'],
    brand: brandMap['apple-store'],
    tags: ['flagship', 'tablet', 'm2'],
    warrantyPeriod: 12,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Màn hình', values: ['11 inch', 'Liquid Retina', '120Hz'] },
      { name: 'Chip', values: ['Apple M2'] }
    ],
    variants: [
      { sku: 'IPADP-128', variantName: '128GB WiFi', price: 21990000, marketPrice: 24990000, quantity: 30, sold: 8, thumbnail: getImageUrl('tablet', 0), pictures: [] }
    ],
    views: 520,
    isHide: false
  },
  // MÁY TÍNH BẢNG - SAMSUNG
  {
    name: 'Samsung Galaxy Tab S9',
    desc: '<h3>Dynamic AMOLED 2X - S Pen</h3><p>AMOLED 11 inch 120Hz, S Pen, pin 8400mAh</p>',
    category: categoryMap['may-tinh-bang'],
    brand: brandMap['samsung'],
    tags: ['flagship', 'tablet'],
    warrantyPeriod: 12,
    origin: 'Việt Nam',
    overSpecs: [
      { name: 'Màn hình', values: ['11 inch', 'AMOLED', '120Hz'] }
    ],
    variants: [
      { sku: 'TABS9-128', variantName: '128GB Beige', price: 16990000, marketPrice: 18990000, quantity: 25, sold: 6, thumbnail: getImageUrl('tablet', 1), pictures: [] }
    ],
    views: 380,
    isHide: false
  },
  // MÁY TÍNH BẢNG - XIAOMI
  {
    name: 'Xiaomi Pad 6',
    desc: '<h3>Giải trí - 144Hz</h3><p>Màn hình 144Hz, Snapdragon 870, pin 8840mAh</p>',
    category: categoryMap['may-tinh-bang'],
    brand: brandMap['xiaomi'],
    tags: ['mid-range', 'tablet'],
    warrantyPeriod: 18,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Màn hình', values: ['11 inch', '144Hz'] }
    ],
    variants: [
      { sku: 'MIPAD6-128', variantName: '128GB Vàng', price: 7990000, marketPrice: 9490000, quantity: 40, sold: 12, thumbnail: getImageUrl('tablet', 2), pictures: [] }
    ],
    views: 560,
    isHide: false
  },
  // LAPTOP - APPLE
  {
    name: 'MacBook Air M2 13 inch',
    desc: '<h3>Mỏng nhẹ - Chip M2</h3><p>Chip M2, Liquid Retina 13.6 inch, pin dài</p>',
    category: categoryMap['laptop'],
    brand: brandMap['apple-store'],
    tags: ['laptop', 'thin'],
    warrantyPeriod: 12,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Màn hình', values: ['13.6 inch', 'Liquid Retina'] },
      { name: 'Chip', values: ['Apple M2', '8 nhân'] },
      { name: 'RAM', values: ['8GB'] },
      { name: 'Ổ cứng', values: ['256GB SSD'] }
    ],
    variants: [
      { sku: 'MBA-M2-256', variantName: '256GB Bạc', price: 26990000, marketPrice: 29990000, quantity: 35, sold: 12, thumbnail: getImageUrl('laptop', 0), pictures: [] }
    ],
    views: 890,
    isHide: false
  },
  // LAPTOP - DELL
  {
    name: 'Dell XPS 13 Plus',
    desc: '<h3>Cao cấp - Intel Core i7</h3><p>OLED 13.4 inch, i7 Gen 13, RAM 16GB</p>',
    category: categoryMap['laptop'],
    brand: brandMap['dell'],
    tags: ['laptop', 'premium'],
    warrantyPeriod: 12,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Màn hình', values: ['13.4 inch', 'OLED 3.5K'] },
      { name: 'CPU', values: ['Intel Core i7-1360P'] },
      { name: 'RAM', values: ['16GB'] }
    ],
    variants: [
      { sku: 'XPS13-512', variantName: '512GB Đen', price: 42990000, marketPrice: 47990000, quantity: 20, sold: 5, thumbnail: getImageUrl('laptop', 1), pictures: [] }
    ],
    views: 420,
    isHide: false
  },
  // LAPTOP - LENOVO
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    desc: '<h3>Doanh nhân - Bền bỉ</h3><p>14 inch 2.8K, i7 Gen 13, carbon fiber</p>',
    category: categoryMap['laptop'],
    brand: brandMap['lenovo'],
    tags: ['laptop', 'business'],
    warrantyPeriod: 12,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Màn hình', values: ['14 inch', '2.8K', '90Hz'] },
      { name: 'CPU', values: ['Intel Core i7-1355U'] }
    ],
    variants: [
      { sku: 'TP-X1C11-512', variantName: '512GB Đen', price: 38990000, marketPrice: 43990000, quantity: 18, sold: 4, thumbnail: getImageUrl('laptop', 2), pictures: [] }
    ],
    views: 350,
    isHide: false
  },
  // LAPTOP - MSI
  {
    name: 'MSI Gaming GF63 Thin',
    desc: '<h3>Gaming - Giá tốt</h3><p>15.6 inch 144Hz, i5 Gen 11, GTX 1650</p>',
    category: categoryMap['laptop'],
    brand: brandMap['msi'],
    tags: ['laptop', 'gaming'],
    warrantyPeriod: 24,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Màn hình', values: ['15.6 inch', '144Hz'] },
      { name: 'CPU', values: ['Intel Core i5-11400H'] },
      { name: 'GPU', values: ['GTX 1650'] }
    ],
    variants: [
      { sku: 'MSI-GF63-512', variantName: '512GB', price: 16990000, marketPrice: 19990000, quantity: 30, sold: 10, thumbnail: getImageUrl('laptop', 0), pictures: [] }
    ],
    views: 680,
    isHide: false
  },
  // LAPTOP - ACER
  {
    name: 'Acer Aspire 5',
    desc: '<h3>Văn phòng - Đa năng</h3><p>15.6 inch FHD, i5 Gen 12, học tập làm việc</p>',
    category: categoryMap['laptop'],
    brand: brandMap['acer'],
    tags: ['laptop', 'office'],
    warrantyPeriod: 12,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Màn hình', values: ['15.6 inch', 'FHD'] },
      { name: 'CPU', values: ['Intel Core i5-1235U'] }
    ],
    variants: [
      { sku: 'ASP5-512', variantName: '512GB Bạc', price: 13990000, marketPrice: 15990000, quantity: 40, sold: 15, thumbnail: getImageUrl('laptop', 1), pictures: [] }
    ],
    views: 580,
    isHide: false
  },
  // PHỤ KIỆN - ANKER
  {
    name: 'Anker PowerPort III 20W',
    desc: '<h3>Sạc nhanh - PD 3.0</h3><p>20W, PD 3.0, nhỏ gọn, an toàn</p>',
    category: categoryMap['phu-kien'],
    brand: brandMap['anker'],
    tags: ['charger', 'fast-charge'],
    warrantyPeriod: 18,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Công suất', values: ['20W'] },
      { name: 'Tính năng', values: ['PD 3.0'] }
    ],
    variants: [
      { sku: 'ANK-20W', variantName: 'Trắng', price: 390000, marketPrice: 490000, quantity: 200, sold: 85, thumbnail: getImageUrl('charger', 0), pictures: [] }
    ],
    views: 1580,
    isHide: false
  },
  {
    name: 'Cáp Anker USB-C to Lightning',
    desc: '<h3>MFi - Bền bỉ</h3><p>Chứng nhận MFi, độ bền cao, 1m</p>',
    category: categoryMap['phu-kien'],
    brand: brandMap['anker'],
    tags: ['cable', 'mfi'],
    warrantyPeriod: 18,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Độ dài', values: ['1m'] }
    ],
    variants: [
      { sku: 'ANK-C2L', variantName: '1m', price: 290000, marketPrice: 390000, quantity: 300, sold: 145, thumbnail: getImageUrl('charger', 1), pictures: [] }
    ],
    views: 2240,
    isHide: false
  },
  // ĐỒNG HỒ THÔNG MINH - APPLE
  {
    name: 'Apple Watch Series 9 GPS',
    desc: '<h3>Chip S9 - Always-On</h3><p>Always-On Retina, S9, theo dõi sức khỏe</p>',
    category: categoryMap['dong-ho-thong-minh'],
    brand: brandMap['apple-store'],
    tags: ['smartwatch', 'fitness'],
    warrantyPeriod: 12,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Màn hình', values: ['Always-On Retina'] },
      { name: 'Chip', values: ['S9 SiP'] },
      { name: 'Tính năng', values: ['ECG', 'Crash Detection'] }
    ],
    variants: [
      { sku: 'AW9-41', variantName: '41mm Midnight', price: 10990000, marketPrice: 12990000, quantity: 40, sold: 15, thumbnail: getImageUrl('smartwatch', 0), pictures: [] }
    ],
    views: 780,
    isHide: false
  },
  // ĐỒNG HỒ THÔNG MINH - SAMSUNG
  {
    name: 'Samsung Galaxy Watch6',
    desc: '<h3>Sức khỏe - ECG</h3><p>Super AMOLED, ECG, đo huyết áp</p>',
    category: categoryMap['dong-ho-thong-minh'],
    brand: brandMap['samsung'],
    tags: ['smartwatch', 'health'],
    warrantyPeriod: 12,
    origin: 'Việt Nam',
    overSpecs: [
      { name: 'Tính năng', values: ['ECG', 'Huyết áp'] }
    ],
    variants: [
      { sku: 'GW6-40', variantName: '40mm Đen', price: 5990000, marketPrice: 7490000, quantity: 35, sold: 10, thumbnail: getImageUrl('smartwatch', 1), pictures: [] }
    ],
    views: 520,
    isHide: false
  },
  // ĐỒNG HỒ THÔNG MINH - XIAOMI
  {
    name: 'Xiaomi Watch 2 Pro',
    desc: '<h3>Wear OS - Pin khủng</h3><p>AMOLED 1.43 inch, Wear OS, pin 5 ngày</p>',
    category: categoryMap['dong-ho-thong-minh'],
    brand: brandMap['xiaomi'],
    tags: ['smartwatch', 'wearos'],
    warrantyPeriod: 18,
    origin: 'Trung Quốc',
    overSpecs: [
      { name: 'Pin', values: ['5 ngày'] }
    ],
    variants: [
      { sku: 'MIWATCH2P', variantName: 'Đen', price: 6990000, marketPrice: 8490000, quantity: 25, sold: 8, thumbnail: getImageUrl('smartwatch', 2), pictures: [] }
    ],
    views: 380,
    isHide: false
  }
];

// Insert products
const products = [];
for (const data of productData) {
  const product = await Product.create(data);
  products.push(product);
  console.log(`✅ Created: ${product.name}`);
}
console.log(`\n✅ Created ${products.length} products\n`);

// Update counts
console.log('🔄 Updating counts...');
const categoryCounts = {};
const brandCounts = {};

products.forEach(p => {
  const catId = p.category.toString();
  const brandId = p.brand.toString();
  categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
  brandCounts[brandId] = (brandCounts[brandId] || 0) + 1;
});

for (const [catId, count] of Object.entries(categoryCounts)) {
  await Category.findByIdAndUpdate(catId, { countProduct: count });
}

for (const [brandId, count] of Object.entries(brandCounts)) {
  await Brand.findByIdAndUpdate(brandId, { countProduct: count });
}

console.log('');
console.log('═'.repeat(70));
console.log('🎉 SEED COMPLETED!');
console.log('═'.repeat(70));
console.log(`📱 Products: ${products.length}`);
console.log('');
console.log('📱 Products by category:');
for (const cat of categories) {
  const count = categoryCounts[cat._id.toString()] || 0;
  if (count > 0) {
    console.log(`   - ${cat.name.padEnd(25)} : ${count} products`);
  }
}
console.log('');
console.log('🏷️  Products by brand:');
for (const brand of brands) {
  const count = brandCounts[brand._id.toString()] || 0;
  if (count > 0) {
    console.log(`   - ${brand.name.padEnd(15)} : ${count} products`);
  }
}
console.log('═'.repeat(70));

await mongoose.connection.close();
console.log('\n👋 Disconnected from MongoDB');
process.exit(0);
