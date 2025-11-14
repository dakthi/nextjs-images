'use client';

import { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  selectedProduct: Product | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductList({
  products,
  selectedProduct,
  searchTerm,
  onSearchChange,
  onSelectProduct,
}: ProductListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="divide-y max-h-96 overflow-y-auto">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${
              selectedProduct?.id === product.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="font-medium text-sm">{product.productName}</div>
            <div className="text-xs text-gray-500">{product.id}</div>
          </button>
        ))}
      </div>

      <div className="p-4 text-xs text-gray-500 border-t">
        {products.length} products found
      </div>
    </div>
  );
}
