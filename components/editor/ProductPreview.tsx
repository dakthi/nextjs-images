'use client';

import { Product } from '@/types/product';
import SaleCard from '@/components/SaleCard';
import { useState } from 'react';

interface ProductPreviewProps {
  product: Product;
  onSave?: (product: Product) => void;
}

export default function ProductPreview({ product, onSave }: ProductPreviewProps) {
  const [jsonText, setJsonText] = useState(JSON.stringify(product, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // Convert product images object to array format for SaleCard
  const productImages = product.images
    ? [
        product.images.topLeft || '/vllondon-logo.jpeg',
        product.images.topRight || '/vllondon-logo.jpeg',
        product.images.bottomLeft || '/vllondon-logo.jpeg',
      ]
    : ['/vllondon-logo.jpeg', '/vllondon-logo.jpeg', '/vllondon-logo.jpeg'];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-8">Live Preview</h3>

      {/* Product Card - Same layout as main page */}
      <div className="mb-8">
        <SaleCard
          productImages={productImages}
          resultImage={productImages[0]}
          productName={product.productName}
          promotionText={product.promotionText || ''}
          discountPercentage={product.discountPercentage || 0}
          pricingTable={product.pricingTable}
          productId={product.id}
          badgePosition={product.badgePosition as 'middle-right' | 'bottom-right'}
          tableTextSize={product.tableTextSize as 'xxs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl'}
          scents={product.scents}
          showOnlyPriceColumn={product.showOnlyPriceColumn}
          showSizeAndConditionColumnsOnly={product.showSizeAndConditionColumnsOnly}
        />
      </div>

      {/* JSON Editor */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">JSON Data - Edit & Save</h4>

        {jsonError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded-lg text-sm">
            {jsonError}
          </div>
        )}

        <textarea
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setJsonError(null);
          }}
          className="w-full h-96 p-4 font-mono text-xs border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          spellCheck="false"
        />

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              try {
                const parsed = JSON.parse(jsonText);
                setJsonError(null);
                if (onSave) {
                  setIsSaving(true);
                  setTimeout(() => {
                    onSave(parsed);
                    setIsSaving(false);
                  }, 300);
                }
              } catch (error) {
                setJsonError(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium text-sm"
          >
            {isSaving ? 'Saving...' : 'Save JSON'}
          </button>

          <button
            onClick={() => {
              setJsonText(JSON.stringify(product, null, 2));
              setJsonError(null);
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
