'use client';

import { useState } from 'react';
import { Product, PricingRow } from '@/types/product';
import PricingTableEditor from './PricingTableEditor';

interface ProductEditorProps {
  product: Product;
  onSave: (product: Product) => void;
  isSaving: boolean;
}

export default function ProductEditor({
  product,
  onSave,
  isSaving,
}: ProductEditorProps) {
  const [formData, setFormData] = useState<Product>(product);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePricingTableChange = (newPricingTable: PricingRow[]) => {
    setFormData((prev) => ({
      ...prev,
      pricingTable: newPricingTable,
    }));
  };

  const handleScentsChange = (newScents: string[]) => {
    setFormData((prev) => ({
      ...prev,
      scents: newScents,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{formData.productName}</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div>
          <label className="block text-sm font-medium mb-1">Product ID</label>
          <input
            type="text"
            value={formData.id}
            disabled
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Discount Percentage
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage || 0}
              onChange={(e) =>
                handleNumberChange('discountPercentage', Number(e.target.value))
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Promotion Text
          </label>
          <input
            type="text"
            name="promotionText"
            value={formData.promotionText || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Display Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Display Settings</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Badge Position
            </label>
            <select
              name="badgePosition"
              value={formData.badgePosition || 'bottom-right'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="middle-right">Middle Right</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Table Text Size
            </label>
            <select
              name="tableTextSize"
              value={formData.tableTextSize || 'xs'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="xxs">XXS</option>
              <option value="xs">XS</option>
              <option value="sm">Small</option>
              <option value="base">Base</option>
              <option value="lg">Large</option>
              <option value="xl">XL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scents */}
      {formData.scents && formData.scents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Scents/Variants</h3>
          <ScentsEditor
            scents={formData.scents}
            onChange={handleScentsChange}
          />
        </div>
      )}

      {/* Pricing Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing Table</h3>
        <PricingTableEditor
          pricingTable={formData.pricingTable}
          onChange={handlePricingTableChange}
        />
      </div>
    </div>
  );
}

interface ScentsEditorProps {
  scents: string[];
  onChange: (scents: string[]) => void;
}

function ScentsEditor({ scents, onChange }: ScentsEditorProps) {
  const handleScentChange = (index: number, value: string) => {
    const newScents = [...scents];
    newScents[index] = value;
    onChange(newScents);
  };

  const handleAddScent = () => {
    onChange([...scents, '']);
  };

  const handleRemoveScent = (index: number) => {
    onChange(scents.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {scents.map((scent, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={scent}
            onChange={(e) => handleScentChange(index, e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Scent name"
          />
          <button
            onClick={() => handleRemoveScent(index)}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={handleAddScent}
        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Add Scent
      </button>
    </div>
  );
}
