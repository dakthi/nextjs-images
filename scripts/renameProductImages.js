const fs = require('fs');
const path = require('path');

// Read the products JSON
const productsPath = path.join(__dirname, '../data/products-generated.json');
const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const products = data.products || data;

// Create mapping of old names to new names
const imageMapping = {};
const publicDir = path.join(__dirname, '../public');

// Extract all unique images from products
const allImages = new Set();

products.forEach(product => {
  if (product.images) {
    if (product.images.topLeft) allImages.add(product.images.topLeft);
    if (product.images.topRight) allImages.add(product.images.topRight);
    if (product.images.bottomLeft) allImages.add(product.images.bottomLeft);
  }
});

console.log(`Found ${allImages.size} unique images to process\n`);

// Generate mapping
products.forEach(product => {
  const productId = product.id.replace('product-', '');

  if (product.images) {
    if (product.images.topLeft && product.images.topLeft !== '/vllondon-logo.jpeg') {
      const oldName = product.images.topLeft.replace(/^\//, '');
      const ext = path.extname(oldName);
      const newName = `/product-${productId}-topLeft${ext}`;
      imageMapping[oldName] = newName;
      product.images.topLeft = newName;
    }

    if (product.images.topRight && product.images.topRight !== '/vllondon-logo.jpeg') {
      const oldName = product.images.topRight.replace(/^\//, '');
      const ext = path.extname(oldName);
      const newName = `/product-${productId}-topRight${ext}`;
      imageMapping[oldName] = newName;
      product.images.topRight = newName;
    }

    if (product.images.bottomLeft && product.images.bottomLeft !== '/vllondon-logo.jpeg') {
      const oldName = product.images.bottomLeft.replace(/^\//, '');
      const ext = path.extname(oldName);
      const newName = `/product-${productId}-bottomLeft${ext}`;
      imageMapping[oldName] = newName;
      product.images.bottomLeft = newName;
    }
  }
});

// Save mapping to file for review
const mappingPath = path.join(__dirname, '../image-mapping.json');
fs.writeFileSync(mappingPath, JSON.stringify(imageMapping, null, 2));

console.log(`✅ Mapping saved to: image-mapping.json`);
console.log(`\nImage Mapping Summary:`);
console.log(`Total images to rename: ${Object.keys(imageMapping).length}`);
console.log('\nSample mappings:');
Object.entries(imageMapping).slice(0, 5).forEach(([old, newName]) => {
  console.log(`  ${old} → ${newName}`);
});

// Update products JSON with new image names
fs.writeFileSync(productsPath, JSON.stringify(data, null, 2));
console.log(`\n✅ Updated products-generated.json with new image references`);

console.log(`\n📋 NEXT STEPS:`);
console.log(`1. Review image-mapping.json to verify the mappings`);
console.log(`2. Run: node scripts/applyImageRenames.js (to rename actual files)`);
console.log(`3. Run: node scripts/convertToWebP.js (to convert to WebP)`);
