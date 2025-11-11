'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExportSelectorProps {
  selectedCount: number;
  totalCount: number;
  onExportPNGs: () => void;
  onExportZip: () => void;
  onExportPDF: () => void;
  isExporting: boolean;
}

export default function ExportSelector({
  selectedCount,
  totalCount,
  onExportPNGs,
  onExportZip,
  onExportPDF,
  isExporting,
}: ExportSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const exportOptions = [
    {
      id: 'png',
      label: 'Export Individual PNGs',
      description: 'Download each card as a separate PNG file',
      onClick: onExportPNGs,
      icon: '🖼️',
      color: 'green',
    },
    {
      id: 'zip',
      label: 'Export All as ZIP',
      description: 'Bundle all cards into a single ZIP file',
      onClick: onExportZip,
      icon: '📦',
      color: 'blue',
    },
    {
      id: 'pdf',
      label: 'Export to PDF',
      description: 'Create a PDF document with all cards',
      onClick: onExportPDF,
      icon: '📄',
      color: 'red',
    },
  ];

  const handleExport = (callback: () => void) => {
    if (selectedCount === 0) {
      alert('Please select at least one product to export');
      return;
    }
    callback();
    setIsExpanded(false);
  };

  return (
    <div className="flex justify-center mb-4">
      <div className="relative inline-block w-full max-w-md">
        {/* Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isExporting}
          className={`w-full flex items-center justify-between gap-3 px-6 py-4 rounded-lg shadow-lg font-bold text-white transition-all duration-200 ${
            isExpanded ? 'rounded-b-none' : ''
          } ${
            isExporting
              ? 'bg-gray-400 opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:shadow-inner'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">📤</span>
            Export Options
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Expanded Menu */}
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-b-lg shadow-lg overflow-hidden z-10 border border-t-0 border-gray-200">
            {exportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleExport(option.onClick)}
                disabled={isExporting || selectedCount === 0}
                className={`w-full text-left px-6 py-4 border-b last:border-b-0 transition-colors ${
                  isExporting || selectedCount === 0
                    ? 'opacity-50 cursor-not-allowed bg-gray-50'
                    : 'hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">{option.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{option.label}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}

            {/* Footer Info */}
            <div className="px-6 py-3 bg-gray-50 border-t">
              <p className="text-xs text-gray-600">
                Selected: <span className="font-bold text-gray-900">{selectedCount}/{totalCount}</span> products
              </p>
            </div>
          </div>
        )}

        {/* Summary when collapsed */}
        {!isExpanded && selectedCount > 0 && (
          <p className="text-xs text-gray-600 mt-2 text-center">
            {selectedCount} of {totalCount} products selected
          </p>
        )}
      </div>
    </div>
  );
}
