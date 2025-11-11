const fs = require('fs');
const Papa = require('papaparse');

// Read the CSV file
const csvData = fs.readFileSync('./public/Penguine Sales 2025 - Sheet2.csv', 'utf8');

// Parse CSV
const parsed = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true,
});

// Filter out header rows and convert to product format
const products = [];
let productId = 1;

parsed.data.forEach((row) => {
  // Skip header rows and empty categories
  if (!row.CATEGORIES || row.CATEGORIES === 'x' || row.CATEGORIES === 'CATEGORIES') {
    return;
  }

  // Only process rows with valid sale prices
  if (!row['Sale Price'] || !row['Org Price']) {
    return;
  }

  // Calculate discount percentage
  const orgPrice = parseFloat(row['Org Price'].replace(/[£,]/g, ''));
  const salePrice = parseFloat(row['Sale Price'].replace(/[£,]/g, ''));
  const discountPercentage = Math.round(((orgPrice - salePrice) / orgPrice) * 100);

  // Skip if no discount
  if (discountPercentage <= 0) {
    return;
  }

  // Create product entry
  const product = {
    id: `product-${productId++}`,
    category: row.CATEGORIES,
    productName: row['Product Name'],
    promotionText: "ÁP DỤNG TỪ NGÀY 14/11 ĐẾN HẾT NGÀY 30/11",
    discountPercentage: discountPercentage,
    images: {
      topLeft: "/vllondon-logo.jpeg",
      topRight: "/vllondon-logo.jpeg",
      bottomLeft: "/vllondon-logo.jpeg"
    },
    pricingTable: [
      {
        size: row['Packing Size'] || 'Standard',
        price: row['Org Price'],
        condition: row['CANH CUT SALE'] || `GIẢM ${discountPercentage}%`,
        discount: row['Sale Price']
      }
    ]
  };

  products.push(product);
});

// Create final JSON structure
const output = {
  products: products
};

// Write to file
fs.writeFileSync('./data/products-generated.json', JSON.stringify(output, null, 2));

console.log(`✅ Converted ${products.length} products from CSV to JSON`);
console.log(`📁 Output: data/products-generated.json`);
