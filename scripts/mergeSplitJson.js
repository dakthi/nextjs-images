const fs = require('fs');
const path = require('path');

const splitDir = path.join(__dirname, '../data/split');
const outputFile = path.join(__dirname, '../data/products-merged.json');

// Read all JSON files from the split directory
const files = fs.readdirSync(splitDir).filter(file => file.endsWith('.json'));

let mergedData = { products: [] };

// Read and merge each JSON file
files.forEach(file => {
  const filePath = path.join(splitDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Assuming each file has a "products" array
  if (content.products && Array.isArray(content.products)) {
    mergedData.products.push(...content.products);
  }
});

// Write merged data to output file
fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2));
console.log(`✅ Merged ${files.length} JSON files into ${outputFile}`);
console.log(`📊 Total products: ${mergedData.products.length}`);
