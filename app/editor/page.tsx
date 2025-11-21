'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/editor/ProductForm';

interface Product {
  id: string;
  category: string;
  productName: string;
  promotionText?: string;
  discountPercentage?: number;
  images?: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
  };
  pricingTable: Array<{
    size: string;
    price: string;
    condition: string;
    discount: string;
  }>;
  badgePosition?: string;
  tableTextSize?: string;
  scents?: string[];
  [key: string]: any;
}

export default function EditorPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [fileLocked, setFileLocked] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products);
        setFileLocked(data.locked);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      const updatedProducts = products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      setProducts(updatedProducts);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedProducts }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Save failed: ${error.error}`);
        return;
      }

      alert('Product saved successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save product');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">VL London - Product Editor</h1>
        <p className="text-gray-700 mb-6">{filteredProducts.length} products found</p>

        {fileLocked && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
            WARNING: File is currently locked. Someone may be editing. Please try again in a few moments.
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by product name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* Product Forms */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <ProductForm
              key={product.id}
              product={product}
              onSave={handleSaveProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
