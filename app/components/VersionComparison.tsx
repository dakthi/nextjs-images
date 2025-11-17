'use client';

import { useState, useEffect } from 'react';

interface Version {
  id: string;
  versionNumber: number;
  versionName: string | null;
  isCurrent: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  contentsCount: number;
  imagesCount: number;
  propertiesCount: number;
  pricingCount: number;
}

interface VersionData {
  id: string;
  versionNumber: number;
  versionName: string | null;
  isCurrent: boolean;
  description: string | null;
  contents: Array<{ id: string; contentType: string; content: string; language: string }>;
  images: Array<{ id: string; imageUrl: string; position: string; displayOrder: number }>;
  properties: Array<{ id: string; key: string; value: string }>;
  pricing: Array<{ id: string; size: string; price: number; discountPrice?: number; condition: string }>;
}

interface Props {
  productCode: string;
}

export default function VersionComparison({ productCode }: Props) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedV1, setSelectedV1] = useState<string>('');
  const [selectedV2, setSelectedV2] = useState<string>('');
  const [comparison, setComparison] = useState<{ version1: VersionData; version2: VersionData } | null>(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [productCode]);

  const fetchVersions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/versions?productCode=${productCode}`);
      if (!response.ok) throw new Error('Failed to fetch versions');
      const data = await response.json();
      setVersions(data.versions);
      if (data.versions.length >= 2) {
        setSelectedV1(data.versions[0].id);
        setSelectedV2(data.versions[1].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch versions');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!selectedV1 || !selectedV2) {
      setError('Please select two versions to compare');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/products/versions?productCode=${productCode}&action=compare&v1=${selectedV1}&v2=${selectedV2}`
      );
      if (!response.ok) throw new Error('Failed to compare versions');
      const data = await response.json();
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compare versions');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (versionId: string) => {
    if (!confirm('Are you sure you want to rollback to this version? This will create a new version with the same content.')) {
      return;
    }

    setRolling(true);
    setError(null);
    try {
      const response = await fetch('/api/products/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode,
          versionId,
        }),
      });
      if (!response.ok) throw new Error('Failed to rollback version');
      const data = await response.json();
      // Refresh versions
      fetchVersions();
      setError(null);
      alert(`Successfully rolled back to version ${versionId}. New version created: v${data.newVersion.versionNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rollback version');
    } finally {
      setRolling(false);
    }
  };

  if (loading && !versions.length) {
    return <div className="text-center py-8 text-black font-medium">Loading versions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Version List */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-black mb-4">All Versions</h3>
        {versions.length === 0 ? (
          <p className="text-black">No versions available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-4 rounded-lg border-2 ${
                  version.isCurrent
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-lg font-bold text-black">Version {version.versionNumber}</p>
                    {version.versionName && (
                      <p className="text-sm text-gray-600">{version.versionName}</p>
                    )}
                  </div>
                  {version.isCurrent && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Current
                    </span>
                  )}
                </div>

                {version.description && (
                  <p className="text-sm text-black mb-3">{version.description}</p>
                )}

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="text-black">
                    <span className="font-bold">{version.contentsCount}</span> content items
                  </div>
                  <div className="text-black">
                    <span className="font-bold">{version.imagesCount}</span> images
                  </div>
                  <div className="text-black">
                    <span className="font-bold">{version.propertiesCount}</span> properties
                  </div>
                  <div className="text-black">
                    <span className="font-bold">{version.pricingCount}</span> pricing tiers
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3">
                  {new Date(version.updatedAt).toLocaleDateString()} {new Date(version.updatedAt).toLocaleTimeString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedV1(version.id);
                      setSelectedV2('');
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-blue-700 transition"
                  >
                    Compare From
                  </button>
                  {!version.isCurrent && (
                    <button
                      onClick={() => handleRollback(version.id)}
                      disabled={rolling}
                      className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-yellow-700 transition disabled:opacity-50"
                    >
                      Rollback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Version Comparison */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-black mb-4">Compare Versions</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-black mb-2">Version 1</label>
            <select
              value={selectedV1}
              onChange={(e) => setSelectedV1(e.target.value)}
              className="w-full border-2 border-gray-400 rounded px-3 py-2 text-black font-medium"
            >
              <option value="">Select version...</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.versionNumber} {v.versionName ? `- ${v.versionName}` : ''}
                  {v.isCurrent ? ' (Current)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Version 2</label>
            <select
              value={selectedV2}
              onChange={(e) => setSelectedV2(e.target.value)}
              className="w-full border-2 border-gray-400 rounded px-3 py-2 text-black font-medium"
            >
              <option value="">Select version...</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.versionNumber} {v.versionName ? `- ${v.versionName}` : ''}
                  {v.isCurrent ? ' (Current)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading || !selectedV1 || !selectedV2}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          Compare Versions
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-2 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-black">Comparison Results</h3>

          {/* Contents Comparison */}
          {(comparison.version1.contents.length > 0 || comparison.version2.contents.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                <h4 className="font-bold text-blue-900 mb-3">
                  v{comparison.version1.versionNumber} Content
                </h4>
                <div className="space-y-2">
                  {comparison.version1.contents.map((content) => (
                    <div key={content.id} className="bg-white p-2 rounded border border-blue-200">
                      <p className="text-xs font-bold text-black">{content.contentType}</p>
                      <p className="text-sm text-black line-clamp-2">{content.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                <h4 className="font-bold text-green-900 mb-3">
                  v{comparison.version2.versionNumber} Content
                </h4>
                <div className="space-y-2">
                  {comparison.version2.contents.map((content) => (
                    <div key={content.id} className="bg-white p-2 rounded border border-green-200">
                      <p className="text-xs font-bold text-black">{content.contentType}</p>
                      <p className="text-sm text-black line-clamp-2">{content.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Properties Comparison */}
          {(comparison.version1.properties.length > 0 || comparison.version2.properties.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                <h4 className="font-bold text-blue-900 mb-3">
                  v{comparison.version1.versionNumber} Properties
                </h4>
                <div className="space-y-2">
                  {comparison.version1.properties.map((prop) => (
                    <div key={prop.id} className="bg-white p-2 rounded border border-blue-200">
                      <p className="text-xs font-bold text-black">{prop.key}</p>
                      <p className="text-sm text-black">{prop.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                <h4 className="font-bold text-green-900 mb-3">
                  v{comparison.version2.versionNumber} Properties
                </h4>
                <div className="space-y-2">
                  {comparison.version2.properties.map((prop) => (
                    <div key={prop.id} className="bg-white p-2 rounded border border-green-200">
                      <p className="text-xs font-bold text-black">{prop.key}</p>
                      <p className="text-sm text-black">{prop.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pricing Comparison */}
          {(comparison.version1.pricing.length > 0 || comparison.version2.pricing.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                <h4 className="font-bold text-blue-900 mb-3">
                  v{comparison.version1.versionNumber} Pricing
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="text-left font-bold text-black">Size</th>
                      <th className="text-right font-bold text-black">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.version1.pricing.map((price) => (
                      <tr key={price.id} className="border-b border-blue-100">
                        <td className="text-black">{price.size}</td>
                        <td className="text-right text-black font-bold">${price.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                <h4 className="font-bold text-green-900 mb-3">
                  v{comparison.version2.versionNumber} Pricing
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-green-200">
                      <th className="text-left font-bold text-black">Size</th>
                      <th className="text-right font-bold text-black">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.version2.pricing.map((price) => (
                      <tr key={price.id} className="border-b border-green-100">
                        <td className="text-black">{price.size}</td>
                        <td className="text-right text-black font-bold">${price.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
