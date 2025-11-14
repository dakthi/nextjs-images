'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import ProductPreview from './ProductPreview';
import ImageUploader from './ImageUploader';

interface ProductFormProps {
  product: Product;
  onSave: (product: Product) => void;
}

export default function ProductForm({ product, onSave }: ProductFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<Product>(product);
  const [isSaving, setIsSaving] = useState(false);
  const [tableFilter, setTableFilter] = useState<'all' | number>('all');
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
      >
        <div className="flex-1 text-left">
          <h3 className="font-semibold !text-gray-900">{formData.productName}</h3>
          <p className="text-sm !text-gray-600">{formData.id}</p>
        </div>
        <span className="text-gray-400">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {/* Expandable Form */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Tabs */}
          <div className="flex gap-4 px-6 pt-4 border-b border-gray-200">
            <button
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                !showPreview
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                showPreview
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Edit Tab */}
          {!showPreview && (
            <div className="px-6 py-4 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount %
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Text
              </label>
              <input
                type="text"
                name="promotionText"
                value={formData.promotionText || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Product Images (R2 CDN)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImageUploader
                productId={formData.id}
                position="topLeft"
                currentImageUrl={formData.images?.topLeft}
                onUploadSuccess={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: {
                      ...(prev.images || {}),
                      topLeft: url,
                    },
                  }));
                }}
              />
              <ImageUploader
                productId={formData.id}
                position="topRight"
                currentImageUrl={formData.images?.topRight}
                onUploadSuccess={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: {
                      ...(prev.images || {}),
                      topRight: url,
                    },
                  }));
                }}
              />
              <ImageUploader
                productId={formData.id}
                position="bottomLeft"
                currentImageUrl={formData.images?.bottomLeft}
                onUploadSuccess={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: {
                      ...(prev.images || {}),
                      bottomLeft: url,
                    },
                  }));
                }}
              />
            </div>
          </div>

          {/* Display Settings */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Display Settings</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Badge Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Position
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="badgePosition"
                      value="bottom-right"
                      checked={(formData.badgePosition || 'bottom-right') === 'bottom-right'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Bottom Right</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="badgePosition"
                      value="middle-right"
                      checked={formData.badgePosition === 'middle-right'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Middle Right</span>
                  </label>
                </div>
              </div>

              {/* Table Text Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Text Size
                </label>
                <select
                  name="tableTextSize"
                  value={formData.tableTextSize || 'xs'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="xxs">XXS (Extra Small)</option>
                  <option value="xs">XS (Very Small)</option>
                  <option value="sm">SM (Small)</option>
                  <option value="base">Base (Default)</option>
                  <option value="lg">LG (Large)</option>
                  <option value="xl">XL (Extra Large)</option>
                </select>
              </div>
            </div>

            {/* Other Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  name="showOnlyPriceColumn"
                  checked={formData.showOnlyPriceColumn || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showOnlyPriceColumn: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                Show Only Price Column
              </label>

              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  name="showSizeAndConditionColumnsOnly"
                  checked={formData.showSizeAndConditionColumnsOnly || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showSizeAndConditionColumnsOnly: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                Show Size & Condition Only
              </label>
            </div>
          </div>

          {/* Scents */}
          {formData.scents && formData.scents.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Scents/Variants</h4>
              <div className="space-y-2">
                {formData.scents.map((scent, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={scent}
                      onChange={(e) => {
                        const newScents = [...formData.scents!];
                        newScents[index] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          scents: newScents,
                        }));
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Scent name"
                    />
                    <button
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          scents: prev.scents?.filter((_, i) => i !== index),
                        }));
                      }}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Table */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Pricing Table</h4>

            {/* Table Filter Radio Buttons */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">View rows:</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center text-sm">
                  <input
                    type="radio"
                    checked={tableFilter === 'all'}
                    onChange={() => setTableFilter('all')}
                    className="mr-2"
                  />
                  All Rows
                </label>
                {formData.pricingTable.map((row, index) => (
                  <label key={index} className="flex items-center text-sm">
                    <input
                      type="radio"
                      checked={tableFilter === index}
                      onChange={() => setTableFilter(index)}
                      className="mr-2"
                    />
                    Row {index + 1}
                  </label>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-2 text-left">Size</th>
                    <th className="border px-2 py-2 text-left">Price</th>
                    <th className="border px-2 py-2 text-left">Condition</th>
                    <th className="border px-2 py-2 text-left">Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.pricingTable.map((row, index) => {
                    // Show all rows or only the selected row
                    if (tableFilter !== 'all' && tableFilter !== index) {
                      return null;
                    }
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border px-2 py-2">
                          <input
                            type="text"
                            value={row.size}
                            onChange={(e) => {
                              const newTable = [...formData.pricingTable];
                              newTable[index].size = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pricingTable: newTable,
                              }));
                            }}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          />
                        </td>
                        <td className="border px-2 py-2">
                          <input
                            type="text"
                            value={row.price}
                            onChange={(e) => {
                              const newTable = [...formData.pricingTable];
                              newTable[index].price = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pricingTable: newTable,
                              }));
                            }}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          />
                        </td>
                        <td className="border px-2 py-2">
                          <input
                            type="text"
                            value={row.condition}
                            onChange={(e) => {
                              const newTable = [...formData.pricingTable];
                              newTable[index].condition = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pricingTable: newTable,
                              }));
                            }}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          />
                        </td>
                        <td className="border px-2 py-2">
                          <input
                            type="text"
                            value={row.discount}
                            onChange={(e) => {
                              const newTable = [...formData.pricingTable];
                              newTable[index].discount = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pricingTable: newTable,
                              }));
                            }}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-4 flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
            </div>
          )}

          {/* Preview Tab */}
          {showPreview && (
            <div className="px-6 py-4">
              <ProductPreview product={formData} onSave={(updatedProduct) => {
                setFormData(updatedProduct);
              }} />
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
