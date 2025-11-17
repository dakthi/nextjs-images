'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import ImageManager from '../components/ImageManager';

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
  const [showEditBrandModal, setShowEditBrandModal] = useState(false);
  const [showBrandDetailsModal, setShowBrandDetailsModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<any>({});
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'products' | 'brands'>('products');

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

  // Fetch single product details
  const fetchProductDetails = async (productCode: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/crud?id=${productCode}`);
      if (!response.ok) throw new Error('Failed to fetch product details');
      const data = await response.json();
      setSelectedProduct(data);

      // Initialize form with current data
      if (data.versions && data.versions[0]) {
        const currentVersion = data.versions[0];
        setProductForm({
          name: data.name,
          description: currentVersion.description || '',
          contents: currentVersion.contents || [],
          properties: currentVersion.properties || [],
          images: currentVersion.images || [],
          pricing: currentVersion.pricing || [],
        });
      }

      setShowProductModal(true);
      setIsEditingProduct(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  // Update product content
  const handleUpdateProductContent = async (contentId: string, newContent: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/product-content/crud', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contentId,
          content: newContent,
        }),
      });
      if (!response.ok) throw new Error('Failed to update content');
      setSuccess('Content updated successfully');
      if (selectedProduct) {
        fetchProductDetails(selectedProduct.productCode);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  // Add new content
  const handleAddContent = async (contentType: string, content: string) => {
    if (!selectedProduct || !selectedProduct.versions?.[0]) return;

    setLoading(true);
    try {
      const response = await fetch('/api/product-content/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId: selectedProduct.versions[0].id,
          contentType,
          content,
          language: 'en',
        }),
      });
      if (!response.ok) throw new Error('Failed to add content');
      setSuccess('Content added successfully');
      fetchProductDetails(selectedProduct.productCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add content');
    } finally {
      setLoading(false);
    }
  };

  // Update property
  const handleUpdateProperty = async (propertyId: string, key: string, value: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/product-properties/crud', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: propertyId,
          propertyKey: key,
          propertyValue: value,
        }),
      });
      if (!response.ok) throw new Error('Failed to update property');
      setSuccess('Property updated successfully');
      if (selectedProduct) {
        fetchProductDetails(selectedProduct.productCode);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single brand details
  const fetchBrandDetails = async (brandId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/brands/crud?id=${brandId}`);
      if (!response.ok) throw new Error('Failed to fetch brand details');
      const data = await response.json();
      setSelectedBrand(data);
      setShowBrandDetailsModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brand details');
    } finally {
      setLoading(false);
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

  // Update brand
  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/brands/crud', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBrand.id,
          ...brandForm,
        }),
      });
      if (!response.ok) throw new Error('Failed to update brand');
      setSuccess('Brand updated successfully');
      setShowEditBrandModal(false);
      setSelectedBrand(null);
      setBrandForm({ name: '', slug: '', description: '', logoUrl: '' });
      fetchBrands();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update brand');
    } finally {
      setLoading(false);
    }
  };

  // Delete brand
  const handleDeleteBrand = async (brandId: string, brandName: string) => {
    if (!confirm(`Are you sure you want to delete "${brandName}"? This action cannot be undone and will affect all related products.`)) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/brands/crud?id=${brandId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete brand');
      setSuccess('Brand deleted successfully');
      fetchBrands();
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete brand');
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditBrandModal = (brand: any) => {
    setSelectedBrand(brand);
    setBrandForm({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logoUrl: brand.logoUrl || '',
    });
    setShowEditBrandModal(true);
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
    <MainLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Products</h1>
          <p className="text-xl text-black font-semibold">Manage products and brands</p>
        </div>
        <button
          onClick={() => setShowCreateBrandModal(true)}
          className="bg-green-600 text-white font-bold px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-base"
        >
          + Create Brand
        </button>
      </div>

      <div>
        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b-2 border-gray-300">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-bold text-lg transition-colors ${
              activeTab === 'products'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-6 py-3 font-bold text-lg transition-colors ${
              activeTab === 'brands'
                ? 'border-b-4 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Brands ({brands.length})
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

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-300 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
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

          {/* Bulk Actions */}
          {selectedProductIds.size > 0 && (
            <div className="flex gap-3 items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <span className="text-black font-bold">
                {selectedProductIds.size} product{selectedProductIds.size > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/export/info-pack', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        productIds: Array.from(selectedProductIds),
                        format: 'zip',
                        includeImages: true,
                        includeProperties: true,
                        includePricing: true,
                        includeVersions: true,
                      }),
                    });
                    if (!response.ok) throw new Error('Export failed');
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `products-info-pack-${selectedProductIds.size}-items.zip`;
                    a.click();
                    setSuccess(`Exported ${selectedProductIds.size} products as ZIP!`);
                  } catch (err) {
                    setError('Failed to export info pack');
                  }
                }}
                className="bg-purple-600 text-white font-bold px-4 py-2 rounded hover:bg-purple-700 text-sm"
              >
                📦 Export Info Pack (ZIP)
              </button>
              <button
                onClick={() => setSelectedProductIds(new Set())}
                className="bg-gray-400 text-white font-bold px-4 py-2 rounded hover:bg-gray-500 text-sm"
              >
                Clear Selection
              </button>
            </div>
          )}
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

        {/* Edit Brand Modal */}
        {showEditBrandModal && selectedBrand && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-yellow-600 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-black mb-6">Edit Brand</h2>
              <form onSubmit={handleUpdateBrand} className="space-y-5">
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Name *</label>
                  <input
                    type="text"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full border-2 border-gray-400 rounded-md px-4 py-3 text-base text-black font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none"
                    required
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
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Description</label>
                  <textarea
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    className="w-full border-2 border-gray-400 rounded-md px-4 py-3 text-base text-black font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Logo URL</label>
                  <input
                    type="url"
                    value={brandForm.logoUrl}
                    onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                    className="w-full border-2 border-gray-400 rounded-md px-4 py-3 text-base text-black font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-yellow-600 text-white font-bold py-4 rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors text-lg"
                  >
                    {loading ? 'Updating...' : 'Update Brand'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditBrandModal(false);
                      setSelectedBrand(null);
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

        {/* Brand Details Modal */}
        {showBrandDetailsModal && selectedBrand && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl border-4 border-green-600 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-black mb-2">{selectedBrand.name}</h2>
                    <p className="text-base text-black font-medium">Slug: {selectedBrand.slug}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowBrandDetailsModal(false);
                      setSelectedBrand(null);
                    }}
                    className="text-gray-500 hover:text-black text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Description */}
                {selectedBrand.description && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">Description</h3>
                    <p className="text-black bg-gray-100 p-4 rounded-lg">{selectedBrand.description}</p>
                  </div>
                )}

                {/* Logo */}
                {selectedBrand.logoUrl && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">Logo</h3>
                    <img
                      src={selectedBrand.logoUrl}
                      alt={`${selectedBrand.name} logo`}
                      className="max-w-xs border-2 border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                {/* Products */}
                {selectedBrand.products && selectedBrand.products.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">
                      Products ({selectedBrand.products.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedBrand.products.map((product: any) => (
                        <div key={product.id} className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                          <p className="text-base font-bold text-black">{product.name}</p>
                          <p className="text-sm text-black font-medium">Code: {product.productCode}</p>
                          <p className="text-sm text-black">
                            Status: <span className={product.isActive ? 'text-green-700' : 'text-red-700'}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-black mb-3">Metadata</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-black font-medium">Created: {new Date(selectedBrand.createdAt).toLocaleString()}</p>
                    <p className="text-black font-medium">Updated: {new Date(selectedBrand.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t-2 border-gray-300">
                  <button
                    onClick={() => {
                      setShowBrandDetailsModal(false);
                      setSelectedBrand(null);
                    }}
                    className="bg-gray-400 text-white font-bold px-6 py-3 rounded-md hover:bg-gray-500 transition-colors text-base"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowBrandDetailsModal(false);
                      openEditBrandModal(selectedBrand);
                    }}
                    className="flex-1 bg-yellow-600 text-white font-bold py-3 rounded-md hover:bg-yellow-700 transition-colors text-base"
                  >
                    Edit Brand
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl border-4 border-blue-600 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-black mb-2">{selectedProduct.name}</h2>
                    <p className="text-base text-black font-medium">
                      Code: {selectedProduct.productCode} | Brand: {selectedProduct.brand?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProductModal(false);
                      setSelectedProduct(null);
                    }}
                    className="text-gray-500 hover:text-black text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Version Info */}
                {selectedProduct.versions && selectedProduct.versions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">Current Version</h3>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-black font-medium">
                        Version {selectedProduct.versions[0].versionNumber}
                        {selectedProduct.versions[0].versionName && ` - ${selectedProduct.versions[0].versionName}`}
                      </p>
                      {selectedProduct.versions[0].description && (
                        <p className="text-black mt-2">{selectedProduct.versions[0].description}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                {selectedProduct.versions?.[0]?.contents && selectedProduct.versions[0].contents.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">
                      Content
                      {isEditingProduct && (
                        <button
                          onClick={() => {
                            const contentType = prompt('Enter content type (e.g., short_description, long_description):');
                            const content = prompt('Enter content:');
                            if (contentType && content) {
                              handleAddContent(contentType, content);
                            }
                          }}
                          className="ml-4 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          + Add Content
                        </button>
                      )}
                    </h3>
                    <div className="space-y-3">
                      {selectedProduct.versions[0].contents.map((content: any, index: number) => (
                        <div key={content.id} className="bg-gray-100 p-4 rounded-lg">
                          <p className="text-sm font-bold text-black mb-2">
                            {content.contentType} ({content.language})
                          </p>
                          {isEditingProduct ? (
                            <textarea
                              value={productForm.contents[index]?.content || content.content}
                              onChange={(e) => {
                                const newContents = [...productForm.contents];
                                newContents[index] = { ...content, content: e.target.value };
                                setProductForm({ ...productForm, contents: newContents });
                              }}
                              onBlur={() => handleUpdateProductContent(content.id, productForm.contents[index]?.content || content.content)}
                              className="w-full border-2 border-gray-400 rounded px-3 py-2 text-black font-medium min-h-24"
                            />
                          ) : (
                            <p className="text-black">{content.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images Manager */}
                {selectedProduct.versions?.[0] && (
                  <div className="mb-6">
                    <ImageManager
                      versionId={selectedProduct.versions[0].id}
                      images={productForm.images || selectedProduct.versions[0].images || []}
                      onImagesUpdated={(images) => {
                        setProductForm({ ...productForm, images });
                        if (selectedProduct && selectedProduct.versions?.[0]) {
                          setSelectedProduct({
                            ...selectedProduct,
                            versions: [{ ...selectedProduct.versions[0], images }],
                          });
                        }
                      }}
                    />
                  </div>
                )}

                {/* Properties */}
                {selectedProduct.versions?.[0]?.properties && selectedProduct.versions[0].properties.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">Properties</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProduct.versions[0].properties.map((prop: any, index: number) => (
                        <div key={prop.id} className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-sm font-bold text-black mb-1">{prop.propertyKey}</p>
                          {isEditingProduct ? (
                            <input
                              type="text"
                              value={productForm.properties[index]?.propertyValue || prop.propertyValue}
                              onChange={(e) => {
                                const newProps = [...productForm.properties];
                                newProps[index] = { ...prop, propertyValue: e.target.value };
                                setProductForm({ ...productForm, properties: newProps });
                              }}
                              onBlur={() => handleUpdateProperty(prop.id, prop.propertyKey, productForm.properties[index]?.propertyValue || prop.propertyValue)}
                              className="w-full border-2 border-gray-400 rounded px-2 py-1 text-black font-medium"
                            />
                          ) : (
                            <p className="text-black">{prop.propertyValue}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                {selectedProduct.versions?.[0]?.pricing && selectedProduct.versions[0].pricing.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">Pricing</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-2 border-gray-300">
                        <thead className="bg-gray-800 text-white">
                          <tr>
                            <th className="px-4 py-2 text-left font-bold">Size</th>
                            <th className="px-4 py-2 text-left font-bold">Price</th>
                            <th className="px-4 py-2 text-left font-bold">Discount</th>
                            <th className="px-4 py-2 text-left font-bold">Condition</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-200">
                          {selectedProduct.versions[0].pricing.map((price: any) => (
                            <tr key={price.id}>
                              <td className="px-4 py-2 text-black font-medium">{price.size}</td>
                              <td className="px-4 py-2 text-black font-bold">
                                {price.currency} {price.price}
                              </td>
                              <td className="px-4 py-2 text-black font-bold text-green-700">
                                {price.discountPrice ? `${price.currency} ${price.discountPrice}` : '—'}
                              </td>
                              <td className="px-4 py-2 text-black text-sm">{price.condition || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t-2 border-gray-300">
                  <button
                    onClick={() => {
                      setShowProductModal(false);
                      setSelectedProduct(null);
                      setIsEditingProduct(false);
                    }}
                    className="bg-gray-400 text-white font-bold px-6 py-3 rounded-md hover:bg-gray-500 transition-colors text-base"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditingProduct(!isEditingProduct)}
                    className={`flex-1 font-bold py-3 rounded-md transition-colors text-base ${
                      isEditingProduct
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isEditingProduct ? '✓ Done Editing' : 'Edit Product'}
                  </button>
                  <button
                    onClick={async () => {
                      if (!selectedProduct) return;
                      try {
                        const response = await fetch('/api/export/info-pack', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            productIds: [selectedProduct.productCode],
                            format: 'zip',
                            includeImages: true,
                            includeProperties: true,
                            includePricing: true,
                            includeVersions: true,
                          }),
                        });
                        if (!response.ok) throw new Error('Export failed');
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedProduct.productCode}-info-pack.zip`;
                        a.click();
                        setSuccess('Info pack downloaded as ZIP!');
                      } catch (err) {
                        setError('Failed to export info pack');
                      }
                    }}
                    className="bg-purple-600 text-white font-bold px-6 py-3 rounded-md hover:bg-purple-700 transition-colors text-base"
                  >
                    📦 Export Info Pack
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-4 text-center text-base font-bold w-12">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && filteredProducts.every(p => selectedProductIds.has(p.productCode))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProductIds(new Set(filteredProducts.map(p => p.productCode)));
                      } else {
                        setSelectedProductIds(new Set());
                      }
                    }}
                    className="w-5 h-5 cursor-pointer"
                  />
                </th>
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
                  <td colSpan={7} className="px-6 py-8 text-center text-black text-base font-medium">
                    {searchTerm || brandFilter !== 'all'
                      ? 'No products found matching your filters'
                      : 'No products yet. Import or create your first product!'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.has(product.productCode)}
                        onChange={(e) => {
                          const newSet = new Set(selectedProductIds);
                          if (e.target.checked) {
                            newSet.add(product.productCode);
                          } else {
                            newSet.delete(product.productCode);
                          }
                          setSelectedProductIds(newSet);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </td>
                    <td
                      onClick={() => fetchProductDetails(product.productCode)}
                      className="px-6 py-4 text-black font-bold text-base cursor-pointer"
                    >
                      {product.productCode}
                    </td>
                    <td
                      onClick={() => fetchProductDetails(product.productCode)}
                      className="px-6 py-4 text-black font-medium text-base cursor-pointer"
                    >
                      {product.name}
                    </td>
                    <td
                      onClick={() => fetchProductDetails(product.productCode)}
                      className="px-6 py-4 text-black font-medium text-base cursor-pointer"
                    >
                      <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-bold">
                        {product.brand?.name || 'Unknown'}
                      </span>
                    </td>
                    <td
                      onClick={() => fetchProductDetails(product.productCode)}
                      className="px-6 py-4 text-center cursor-pointer"
                    >
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
                    <td
                      onClick={() => fetchProductDetails(product.productCode)}
                      className="px-6 py-4 text-center text-black font-medium text-base cursor-pointer"
                    >
                      {product.versions?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => fetchProductDetails(product.productCode)}
                          className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
                        >
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
          </>
        )}

        {/* BRANDS TAB */}
        {activeTab === 'brands' && (
          <>
            <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-base font-bold">Brand Name</th>
                    <th className="px-6 py-4 text-left text-base font-bold">Slug</th>
                    <th className="px-6 py-4 text-left text-base font-bold">Description</th>
                    <th className="px-6 py-4 text-center text-base font-bold">Products</th>
                    <th className="px-6 py-4 text-right text-base font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {brands.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-black text-base font-medium">
                        No brands yet. Create your first brand!
                      </td>
                    </tr>
                  ) : (
                    brands.map((brand: any) => (
                      <tr
                        key={brand.id}
                        className="hover:bg-green-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-black font-bold text-base">
                          {brand.name}
                        </td>
                        <td className="px-6 py-4 text-black font-medium text-base">
                          {brand.slug}
                        </td>
                        <td className="px-6 py-4 text-black text-base max-w-md truncate">
                          {brand.description || '—'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-bold">
                            {brand._count?.products || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => fetchBrandDetails(brand.id)}
                              className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditBrandModal(brand)}
                              className="bg-yellow-600 text-white font-bold px-4 py-2 rounded hover:bg-yellow-700 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(brand.id, brand.name)}
                              className="bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
                            >
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
              Showing {brands.length} brand{brands.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
