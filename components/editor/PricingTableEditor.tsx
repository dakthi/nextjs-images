'use client';

import { PricingRow } from '@/types/product';

interface PricingTableEditorProps {
  pricingTable: PricingRow[];
  onChange: (pricingTable: PricingRow[]) => void;
}

export default function PricingTableEditor({
  pricingTable,
  onChange,
}: PricingTableEditorProps) {
  const handleRowChange = (
    index: number,
    field: keyof PricingRow,
    value: string
  ) => {
    const newTable = [...pricingTable];
    newTable[index] = {
      ...newTable[index],
      [field]: value,
    };
    onChange(newTable);
  };

  const handleAddRow = () => {
    onChange([
      ...pricingTable,
      {
        size: '',
        price: '',
        condition: '',
        discount: '',
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    onChange(pricingTable.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left text-sm font-medium">
                Size
              </th>
              <th className="border px-3 py-2 text-left text-sm font-medium">
                Price
              </th>
              <th className="border px-3 py-2 text-left text-sm font-medium">
                Condition
              </th>
              <th className="border px-3 py-2 text-left text-sm font-medium">
                Discount
              </th>
              <th className="border px-3 py-2 w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {pricingTable.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  <input
                    type="text"
                    value={row.size}
                    onChange={(e) =>
                      handleRowChange(index, 'size', e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g., Lẻ 15ml"
                  />
                </td>
                <td className="border px-3 py-2">
                  <input
                    type="text"
                    value={row.price}
                    onChange={(e) =>
                      handleRowChange(index, 'price', e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g., £9.00"
                  />
                </td>
                <td className="border px-3 py-2">
                  <input
                    type="text"
                    value={row.condition}
                    onChange={(e) =>
                      handleRowChange(index, 'condition', e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g., OFF 10%"
                  />
                </td>
                <td className="border px-3 py-2">
                  <input
                    type="text"
                    value={row.discount}
                    onChange={(e) =>
                      handleRowChange(index, 'discount', e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g., £8.10"
                  />
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAddRow}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Add Pricing Row
      </button>
    </div>
  );
}
