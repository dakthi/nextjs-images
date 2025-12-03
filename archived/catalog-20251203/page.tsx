'use client';

import { useState, useEffect } from 'react';
import PDFButton from './PDFButton';
import { getImageUrl } from '@/utils/imageUrl';
import './catalog.css';

interface PricingRow {
  size?: string;
  price: string;
  condition?: string;
  discount: string;
}

interface Product {
  id: string;
  productName: string;
  category: string;
  promotionText?: string;
  discountPercentage?: number;
  images: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
  };
  pricingTable: PricingRow[];
  scents?: string[];
  [key: string]: any;
}

export default function CatalogPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterWithImages, setFilterWithImages] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setAllProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(allProducts.map(p => p.category))].sort();

  const hasPlaceholderImages = (product: any) => {
    return product.images.topLeft === '/vllondon-logo.jpeg' ||
           product.images.topRight === '/vllondon-logo.jpeg' ||
           product.images.bottomLeft === '/vllondon-logo.jpeg';
  };

  useEffect(() => {
    let filtered = allProducts;

    if (filterWithImages) {
      filtered = filtered.filter(p => !hasPlaceholderImages(p));
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [filterWithImages, selectedCategory, allProducts]);

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="catalog-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading catalog...</p>
      </div>
    );
  }

  return (
    <>
      <div className="catalog-container">
        {/* Cover Page */}
        <div className="page cover-page">
          <div className="cover-content">
            <h1 className="catalog-title">VL LONDON</h1>
            <h2 className="catalog-subtitle">Winter Sale 2025</h2>
            <p className="catalog-dates">Áp dụng từ ngày 16/11 đến hết ngày 30/11</p>
          </div>
        </div>

        {/* Product Pages by Category */}
        {Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} className="page product-page">
            <div className="category-header">{category}</div>
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-info">
                  <h3 className="product-name">{product.productName}</h3>
                  <p className="product-promotion">{product.promotionText}</p>
                  {product.discountPercentage != null && product.discountPercentage > 0 && (
                    <span className="product-discount-badge">
                      -{product.discountPercentage}% OFF
                    </span>
                  )}
                  {(product as any).scents && (
                    <div className="product-scents">
                      {(product as any).scents.map((scent: string, idx: number) => (
                        <span key={idx} className="scent-badge">{scent}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="product-images">
                  <img src={getImageUrl(product.images.topLeft)} alt={product.productName} />
                  <img src={getImageUrl(product.images.topRight)} alt={product.productName} />
                  <img src={getImageUrl(product.images.bottomLeft)} alt={product.productName} />
                </div>

                <table className="pricing-table">
                  <thead>
                    <tr>
                      {product.pricingTable[0].size && <th>Size</th>}
                      <th>Price</th>
                      {product.pricingTable[0].condition && <th>Condition</th>}
                      <th>Sale Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.pricingTable.map((row, idx) => (
                      <tr key={idx}>
                        {row.size && <td>{row.size}</td>}
                        <td className="price-original">{row.price}</td>
                        {row.condition && <td>{row.condition}</td>}
                        <td className="price-discount">{row.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}

        {/* Back Cover */}
        <div className="page back-cover">
          <div className="back-cover-content">
            <h2>Contact Information</h2>
            <div className="contact-info">
              <p>VL London</p>
              <p>Email: contact@vllondon.com</p>
              <p>Phone: +44 XXX XXX XXXX</p>
            </div>
            <p className="catalog-footer">© 2025 VL London. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls no-print">
        <PDFButton products={filteredProducts} />
        <button onClick={handlePrint} className="btn-primary">
          Print Catalog
        </button>
        <div className="filter-controls">
          <label>
            <input
              type="checkbox"
              checked={filterWithImages}
              onChange={(e) => setFilterWithImages(e.target.checked)}
            />
            Only products with images
          </label>
          <label>
            Category:
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
