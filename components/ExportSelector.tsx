'use client';

interface ExportSelectorProps {
  selectedCount: number;
  totalCount: number;
  onExportPNGs: () => void;
  onExportZip: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  isExporting: boolean;
}

export default function ExportSelector({
  selectedCount,
  totalCount,
  onExportPNGs,
  onExportZip,
  onExportPDF,
  onExportCSV,
  isExporting,
}: ExportSelectorProps) {
  const exportOptions = [
    {
      id: 'png',
      label: 'PNGs',
      onClick: onExportPNGs,
    },
    {
      id: 'zip',
      label: 'ZIP',
      onClick: onExportZip,
    },
    {
      id: 'pdf',
      label: 'PDF',
      onClick: onExportPDF,
    },
    {
      id: 'csv',
      label: 'CSV',
      onClick: onExportCSV,
    },
  ];

  const handleExport = (callback: () => void) => {
    if (selectedCount === 0) {
      alert('Please select at least one product to export');
      return;
    }
    callback();
  };

  return (
    <div className="max-w-6xl mx-auto mb-6 bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{selectedCount}</span> / {totalCount} selected
        </div>
        <div className="flex gap-2 flex-wrap">
          {exportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleExport(option.onClick)}
              disabled={isExporting || selectedCount === 0}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                isExporting || selectedCount === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Export {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
