'use client';

import { Product } from '@/types/product';
import SaleCard from '@/components/SaleCard';

interface ProductPreviewProps {
  product: Product;
}

export default function ProductPreview({ product }: ProductPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>

      {/* Product Card Preview */}
      <div className="flex justify-center p-8 bg-gray-100 rounded-lg">
        <div className="w-64">
          <SaleCard
            id={product.id}
            category={product.category}
            productName={product.productName}
            promotionText={product.promotionText}
            discountPercentage={product.discountPercentage || 0}
            images={product.images}
            pricingTable={product.pricingTable}
            badgePosition={product.badgePosition}
            tableTextSize={product.tableTextSize}
            scents={product.scents}
            showOnlyPriceColumn={product.showOnlyPriceColumn}
            showSizeAndConditionColumnsOnly={product.showSizeAndConditionColumnsOnly}
          />
        </div>
      </div>

      {/* JSON Preview */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">JSON Data</h4>
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-words">
            {JSON.stringify(product, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
