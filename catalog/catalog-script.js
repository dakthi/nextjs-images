// Load product data
let productsData = [];
let currentFilter = {
    withImages: true,
    category: 'all'
};

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('../data/products-generated.json');
        const data = await response.json();
        productsData = data.products;
        populateCategoryFilter();
        generateCatalog();
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('catalog-products').innerHTML =
            '<div class="page"><p style="text-align: center; padding: 50px;">Error loading products. Please check console.</p></div>';
    }
}

// Populate category dropdown
function populateCategoryFilter() {
    const categories = [...new Set(productsData.map(p => p.category))].sort();
    const select = document.getElementById('category-filter');

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        currentFilter.category = e.target.value;
        generateCatalog();
    });

    document.getElementById('filter-with-images').addEventListener('change', (e) => {
        currentFilter.withImages = e.target.checked;
        generateCatalog();
    });
}

// Check if product has placeholder images
function hasPlaceholderImages(product) {
    return product.images.topLeft === '/vllondon-logo.jpeg' ||
           product.images.topRight === '/vllondon-logo.jpeg' ||
           product.images.bottomLeft === '/vllondon-logo.jpeg';
}

// Filter products based on current filter
function filterProducts() {
    let filtered = productsData;

    // Filter by images
    if (currentFilter.withImages) {
        filtered = filtered.filter(p => !hasPlaceholderImages(p));
    }

    // Filter by category
    if (currentFilter.category !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter.category);
    }

    return filtered;
}

// Group products by category
function groupByCategory(products) {
    const grouped = {};
    products.forEach(product => {
        if (!grouped[product.category]) {
            grouped[product.category] = [];
        }
        grouped[product.category].push(product);
    });
    return grouped;
}

// Generate product HTML
function generateProductHTML(product) {
    const scentsHTML = product.scents ? `
        <div class="product-scents">
            ${product.scents.map(scent => `<span class="scent-badge">${scent}</span>`).join('')}
        </div>
    ` : '';

    const discountBadgeHTML = product.discountPercentage > 0 ?
        `<span class="product-discount-badge">-${product.discountPercentage}% OFF</span>` : '';

    return `
        <div class="product-item">
            <div class="product-header">
                <div class="product-images">
                    <img src="../public${product.images.topLeft}" alt="${product.productName}" onerror="this.src='../public/vllondon-logo.jpeg'">
                    <img src="../public${product.images.topRight}" alt="${product.productName}" onerror="this.src='../public/vllondon-logo.jpeg'">
                    <img src="../public${product.images.bottomLeft}" alt="${product.productName}" onerror="this.src='../public/vllondon-logo.jpeg'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.productName}</h3>
                    <p class="product-promotion">${product.promotionText}</p>
                    ${discountBadgeHTML}
                    ${scentsHTML}
                </div>
            </div>

            <table class="pricing-table">
                <thead>
                    <tr>
                        ${product.pricingTable[0].size ? '<th>Size</th>' : ''}
                        <th>Price</th>
                        ${product.pricingTable[0].condition ? '<th>Condition</th>' : ''}
                        <th>Sale Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${product.pricingTable.map(row => `
                        <tr>
                            ${row.size ? `<td>${row.size}</td>` : ''}
                            <td class="price-original">${row.price}</td>
                            ${row.condition ? `<td>${row.condition}</td>` : ''}
                            <td class="price-discount">${row.discount}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generate catalog pages
function generateCatalog() {
    const container = document.getElementById('catalog-products');
    const filteredProducts = filterProducts();
    const groupedProducts = groupByCategory(filteredProducts);

    let html = '';
    const categories = Object.keys(groupedProducts).sort();

    categories.forEach((category, categoryIndex) => {
        const products = groupedProducts[category];

        // Create a new page for each category
        html += `
            <div class="page product-page">
                <div class="category-header">${category}</div>
                ${products.map(product => generateProductHTML(product)).join('')}
            </div>
        `;
    });

    container.innerHTML = html;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', loadProducts);
