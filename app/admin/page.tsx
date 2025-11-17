'use client';

import { useState, useEffect } from 'react';

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  isActive: boolean;
  brandId: string;
  brand: Brand;
  createdAt: string;
  versions?: any[];
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateBrandModal, setShowCreateBrandModal] = useState(false);

  // Brand form state
  const [brandForm, setBrandForm] = useState({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
  });

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products/crud');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands/crud');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brands');
    }
  };

  // Create brand
  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/brands/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandForm),
      });
      if (!response.ok) throw new Error('Failed to create brand');
      setSuccess('Brand created successfully');
      setBrandForm({ name: '', slug: '', description: '', logoUrl: '' });
      setShowCreateBrandModal(false);
      fetchBrands();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create brand');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.productCode.toLowerCase().includes(search) ||
      product.brand?.name.toLowerCase().includes(search);

    const matchesBrand =
      brandFilter === 'all' || product.brandId === brandFilter;

    return matchesSearch && matchesBrand;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Product Management</h1>
            <p className="text-xl text-black font-semibold">Manage products and brands</p>
          </div>
          <button
            onClick={() => setShowCreateBrandModal(true)}
            className="bg-green-600 text-white font-bold px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-base"
          >
            + Create Brand
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-600 text-black font-medium rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border-2 border-green-600 text-black font-medium rounded">
            {success}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-300 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold mb-2 text-black">Search Products</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name, code, or brand..."
                className="w-full border-2 border-gray-400 rounded-md px-4 py-3 text-base text-black font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-base font-bold mb-2 text-black">Filter by Brand</label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full border-2 border-gray-400 rounded-md px-4 py-3 text-base text-black font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none"
              >
                <option value="all">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Create Brand Modal */}
        {showCreateBrandModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-green-600 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-black mb-6">Create New Brand</h2>
              <form onSubmit={handleCreateBrand} className="space-y-5">
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Name *</label>
                  <input
                    type="text"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full border-2 border-gray-400 rounded-md px-4 py-3 text-base text-black font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none"
                    required
                    placeholder="e.g., Blazing Star"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Slug *</label>
                  <input
                    type="text"
                    value={brandForm.slug}
                    onChange={(e) => setBrandForm({ ...brandForm, slug: e.target.value })}
                    className="w-full border-2 border-gray-400 rounded-md px-4 py-3 text-base text-black font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none"
                    required
                    placeholder="e.g., blazing-star"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Description</label>
                  <textarea
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    className="w-full border-2 border-gray-400 rounded-md px-4 py-3 text-base text-black font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none"
                    rows={4}
                    placeholder="Brand description and positioning..."
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Logo URL</label>
                  <input
                    type="url"
                    value={brandForm.logoUrl}
                    onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                    className="w-full border-2 border-gray-400 rounded-md px-4 py-3 text-base text-black font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white font-bold py-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-lg"
                  >
                    {loading ? 'Creating...' : 'Create Brand'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateBrandModal(false);
                      setBrandForm({ name: '', slug: '', description: '', logoUrl: '' });
                    }}
                    className="px-8 bg-gray-400 text-white font-bold py-4 rounded-md hover:bg-gray-500 transition-colors text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-base font-bold">Product Code</th>
                <th className="px-6 py-4 text-left text-base font-bold">Product Name</th>
                <th className="px-6 py-4 text-left text-base font-bold">Brand</th>
                <th className="px-6 py-4 text-center text-base font-bold">Status</th>
                <th className="px-6 py-4 text-center text-base font-bold">Versions</th>
                <th className="px-6 py-4 text-right text-base font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-black text-base font-medium">
                    {searchTerm || brandFilter !== 'all'
                      ? 'No products found matching your filters'
                      : 'No products yet. Import or create your first product!'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-black font-bold text-base">{product.productCode}</td>
                    <td className="px-6 py-4 text-black font-medium text-base">{product.name}</td>
                    <td className="px-6 py-4 text-black font-medium text-base">
                      <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-bold">
                        {product.brand?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-sm ${
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-black font-medium text-base">
                      {product.versions?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                          Edit
                        </button>
                        <button className="bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-black text-base font-bold">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}
