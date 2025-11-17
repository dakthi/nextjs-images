'use client';

import { useState, useRef } from 'react';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  skipped: number;
  created: Array<{ code: string; name: string }>;
  updated: Array<{ code: string; name: string }>;
  errors: Array<{ row: number; error: string }>;
}

export default function CSVImport() {
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported');
      return;
    }

    setImporting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Import failed');
      }

      const data = await response.json();
      setResult(data);

      if (data.failed > 0) {
        setError(`${data.failed} rows failed to import. Check the details below.`);
      } else {
        setError(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import failed';
      setError(message);
      console.error('Import error:', err);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const downloadTemplate = () => {
    const headers = ['Product Code', 'Product Name', 'Brand', 'Category', 'Description', 'Price', 'Size', 'Scents', 'Active'];
    const exampleRow = ['PROD001', 'Sample Product', 'Brand A', 'Category 1', 'Product description', '29.99', 'Standard', 'Lavender, Rose', 'true'];

    const csv = [headers, exampleRow].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-black mb-2">Bulk Import Products</h2>
        <p className="text-sm text-gray-700 mb-4">
          Upload a CSV file to import multiple products at once. Required columns: Product Code, Product Name.
        </p>
        <button
          onClick={downloadTemplate}
          className="text-sm text-blue-600 hover:text-blue-700 font-bold underline"
        >
          Download CSV Template
        </button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-400 hover:border-gray-500'
        } ${importing ? 'opacity-75' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={importing}
        />

        {importing ? (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <p className="mt-2 text-sm text-black font-medium">Importing products...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-black">
              Drop CSV file here or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-bold underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              CSV format only • Required: Product Code, Product Name
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-700 font-semibold">TOTAL</p>
              <p className="text-2xl font-bold text-blue-600">{result.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-gray-700 font-semibold">SUCCESS</p>
              <p className="text-2xl font-bold text-green-600">{result.success}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-xs text-gray-700 font-semibold">CREATED</p>
              <p className="text-2xl font-bold text-yellow-600">{result.created.length}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-700 font-semibold">UPDATED</p>
              <p className="text-2xl font-bold text-orange-600">{result.updated.length}</p>
            </div>
          </div>

          {result.created.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">Created Products ({result.created.length})</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {result.created.map((product, idx) => (
                  <p key={idx} className="text-sm text-green-800">
                    {product.code} - {product.name}
                  </p>
                ))}
              </div>
            </div>
          )}

          {result.updated.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">Updated Products ({result.updated.length})</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {result.updated.map((product, idx) => (
                  <p key={idx} className="text-sm text-blue-800">
                    {product.code} - {product.name}
                  </p>
                ))}
              </div>
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-bold text-red-900 mb-2">Errors ({result.errors.length})</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((err, idx) => (
                  <p key={idx} className="text-sm text-red-800">
                    Row {err.row}: {err.error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
