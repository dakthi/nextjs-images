const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/products-generated.json');
let content = fs.readFileSync(filePath, 'utf8');

const broken = [
  '/product-191-topLeft.webp',
  '/product-191-topRight.webp',
  '/product-191-bottomLeft.webp',
  '/product-213-topLeft.webp',
  '/product-213-topRight.webp',
  '/product-213-bottomLeft.webp',
  '/product-258-topLeft.webp',
  '/product-258-topRight.webp',
  '/product-258-bottomLeft.webp',
  '/product-304-topLeft.webp',
  '/product-304-topRight.webp',
  '/product-297-1-topLeft.webp',
  '/product-297-1-topRight.webp',
  '/product-297-1-bottomLeft.webp',
  '/product-297-2-topLeft.webp',
  '/product-297-2-topRight.webp',
  '/product-297-2-bottomLeft.webp',
  '/product-378-topLeft.webp',
  '/product-386-bottomLeft.webp'
];

let count = 0;
broken.forEach(img => {
  const pattern = `"${img}"`;
  while (content.includes(pattern)) {
    content = content.replace(pattern, '"/vllondon-logo.jpeg"');
    count++;
  }
});

fs.writeFileSync(filePath, content);
console.log(`✅ Replaced ${count} broken image references with placeholder`);
