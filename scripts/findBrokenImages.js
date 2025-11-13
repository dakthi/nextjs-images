const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products-generated.json'), 'utf8'));
const products = data.products || data;
const publicDir = path.join(__dirname, '../public');

const broken = [];

products.forEach(product => {
  if (product.images) {
    const images = [product.images.topLeft, product.images.topRight, product.images.bottomLeft];
    images.forEach(img => {
      if (img && img !== '/vllondon-logo.jpeg') {
        const filePath = path.join(publicDir, img.replace(/^\//, ''));
        if (!fs.existsSync(filePath)) {
          broken.push({ productId: product.id, image: img });
        }
      }
    });
  }
});

console.log(`Found ${broken.length} broken image references:\n`);
broken.forEach(b => {
  console.log(`  ${b.productId}: ${b.image}`);
});
