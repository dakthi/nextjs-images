'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import ImageManager from '../components/ImageManager';
import CSVImport from '../components/CSVImport';
import VersionComparison from '../components/VersionComparison';
import TiptapEditor from '../components/TiptapEditor';

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
  _count?: {
    versions: number;
  };
  hasImages?: boolean;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandIds, setSelectedBrandIds] = useState<Set<string>>(new Set());
  const [showWithImages, setShowWithImages] = useState(false);
  const [showWithoutImages, setShowWithoutImages] = useState(false);
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
  const [activeTab, setActiveTab] = useState<'brands' | 'products'>('brands');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showVersionComparison, setShowVersionComparison] = useState(false);

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

  // Handle Escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showProductModal) {
          setShowProductModal(false);
          setSelectedProduct(null);
          setIsEditingProduct(false);
          setShowVersionComparison(false);
        } else if (showBrandDetailsModal) {
          setShowBrandDetailsModal(false);
          setSelectedBrand(null);
        } else if (showEditBrandModal) {
          setShowEditBrandModal(false);
          setSelectedBrand(null);
          setBrandForm({ name: '', slug: '', description: '', logoUrl: '' });
        } else if (showCreateBrandModal) {
          setShowCreateBrandModal(false);
          setBrandForm({ name: '', slug: '', description: '', logoUrl: '' });
        } else if (showImportModal) {
          setShowImportModal(false);
        } else if (showVersionComparison) {
          setShowVersionComparison(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showProductModal, showBrandDetailsModal, showEditBrandModal, showCreateBrandModal, showImportModal, showVersionComparison]);

  // Brand color mapping
  const getBrandColor = (brandName: string) => {
    const name = brandName.toLowerCase();
    if (name.includes('bold berry')) return 'bg-pink-500 text-white';
    if (name.includes('mberry')) return 'bg-pink-400 text-white';
    if (name.includes('blazingstar')) return 'bg-black text-white';
    if (name.includes('la palm')) return 'bg-green-500 text-white';
    if (name.includes('kds')) return 'bg-red-600 text-white';
    if (name.includes('vl london')) return 'bg-[#0A1128] text-white';
    if (name.includes('dnd')) return 'bg-[#800020] text-white'; // burgundy red
    if (name.includes('opi')) return 'bg-white text-black border-2 border-gray-300'; // white with border
    return 'bg-[#0A1128]/10 text-[#0A1128]'; // default
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.productCode.toLowerCase().includes(search) ||
      product.brand?.name.toLowerCase().includes(search);

    // Brand filter logic: if none selected, show all
    const matchesBrand =
      selectedBrandIds.size === 0 || selectedBrandIds.has(product.brandId);

    // Image filter logic: if both unchecked, show all
    const matchesImageFilter =
      (!showWithImages && !showWithoutImages) ||
      (showWithImages && product.hasImages) ||
      (showWithoutImages && !product.hasImages);

    return matchesSearch && matchesBrand && matchesImageFilter;
  });

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Products</h1>
        <p className="text-xl text-black font-semibold">Manage products and brands</p>
      </div>

      <div>
        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b-2 border-[#0A1128]/20">
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-6 py-3 font-bold text-lg transition-colors ${
              activeTab === 'brands'
                ? 'border-b-4 border-[#C5A572] text-[#0A1128]'
                : 'text-[#0A1128]/70 hover:text-[#0A1128]'
            }`}
          >
            Brands ({brands.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-bold text-lg transition-colors ${
              activeTab === 'products'
                ? 'border-b-4 border-[#0A1128] text-[#C5A572]'
                : 'text-[#0A1128]/70 hover:text-[#C5A572]'
            }`}
          >
            Products ({products.length})
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-[#0A1128]/10 border-2 border-[#0A1128] text-black font-medium rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-[#C5A572]/10 border-2 border-[#C5A572] text-black font-medium rounded">
            {success}
          </div>
        )}

        {/* BRANDS TAB */}
        {activeTab === 'brands' && (
          <>
            <div className="bg-white rounded-lg shadow-md border-2 border-[#0A1128]/20 overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0A1128] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-base font-bold">Brand Name</th>
                    <th className="px-6 py-4 text-left text-base font-bold">Description</th>
                    <th className="px-6 py-4 text-center text-base font-bold">Products</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#0A1128]/10">
                  {brands.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-black text-base font-medium">
                        No brands yet. Create your first brand!
                      </td>
                    </tr>
                  ) : (
                    brands.map((brand: any) => (
                      <tr
                        key={brand.id}
                        onClick={() => fetchBrandDetails(brand.id)}
                        className="hover:bg-[#C5A572]/10 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-black font-bold text-base">
                          {brand.name}
                        </td>
                        <td className="px-6 py-4 text-black text-base max-w-md truncate">
                          {brand.description || '—'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-[#0A1128]/10 text-[#0A1128] px-3 py-1 rounded-full font-bold">
                            {brand._count?.products || 0}
                          </span>
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

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#0A1128]/20 mb-6">
          <div className="mb-4">
            <label className="block text-base font-bold mb-2 text-black">Search Products</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, code, or brand..."
              className="w-full border-2 border-[#0A1128]/30 rounded-md px-4 py-3 text-base text-black font-medium focus:border-[#0A1128] focus:ring-2 focus:ring-[#C5A572] outline-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer bg-[#0A1128]/5 px-3 py-2 rounded-md hover:bg-[#0A1128]/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedBrandIds.has(brand.id)}
                    onChange={(e) => {
                      const newSet = new Set(selectedBrandIds);
                      if (e.target.checked) {
                        newSet.add(brand.id);
                      } else {
                        newSet.delete(brand.id);
                      }
                      setSelectedBrandIds(newSet);
                    }}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-black">
                    {brand.name}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t-2 border-[#0A1128]/10">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-[#0A1128]/5 px-3 py-2 rounded-md hover:bg-[#0A1128]/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={showWithImages}
                    onChange={(e) => setShowWithImages(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-black">With Images</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-[#0A1128]/5 px-3 py-2 rounded-md hover:bg-[#0A1128]/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={showWithoutImages}
                    onChange={(e) => setShowWithoutImages(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-black">Without Images</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = '/editor'}
                  className="bg-[#0A1128] text-white font-bold px-4 py-2 rounded-md hover:bg-[#C5A572] hover:text-[#0A1128] transition-colors text-sm border-2 border-[#C5A572]"
                >
                  Image Editor
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="bg-[#C5A572] text-white font-bold px-4 py-2 rounded-md hover:bg-[#0A1128] transition-colors text-sm"
                >
                  Import CSV
                </button>
                <button
                  onClick={() => setShowCreateBrandModal(true)}
                  className="bg-[#C5A572] text-white font-bold px-4 py-2 rounded-md hover:bg-[#0A1128] transition-colors text-sm"
                >
                  Create Brand
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProductIds.size > 0 && (
            <div className="flex gap-3 items-center p-4 bg-[#0A1128]/5 rounded-lg border-2 border-[#0A1128]/20">
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
                className="bg-[#C5A572] text-white font-bold px-4 py-2 rounded hover:bg-[#0A1128] text-sm"
              >
                Export Info Pack (ZIP)
              </button>
              <button
                onClick={() => setSelectedProductIds(new Set())}
                className="bg-[#0A1128]/40 text-white font-bold px-4 py-2 rounded hover:bg-white0 text-sm"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#0A1128]/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0A1128] text-white">
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
                <th className="px-6 py-4 text-left text-base font-bold">Brand</th>
                <th className="px-6 py-4 text-left text-base font-bold">Product Name</th>
                <th className="px-6 py-4 text-center text-base font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#0A1128]/10">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-black text-base font-medium">
                    {searchTerm || selectedBrandIds.size > 0 || showWithImages || showWithoutImages
                      ? 'No products found matching your filters'
                      : 'No products yet. Import or create your first product!'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#0A1128]/5 transition-colors"
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
                      className="px-6 py-4 text-black font-medium text-base cursor-pointer"
                    >
                      <span className={`${getBrandColor(product.brand?.name || '')} px-3 py-1 rounded-full font-bold`}>
                        {product.brand?.name || 'Unknown'}
                      </span>
                    </td>
                    <td
                      onClick={() => fetchProductDetails(product.productCode)}
                      className="px-6 py-4 text-black font-medium text-base cursor-pointer"
                    >
                      {product.name}
                    </td>
                    <td
                      onClick={() => fetchProductDetails(product.productCode)}
                      className="px-6 py-4 text-center cursor-pointer"
                    >
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-sm ${
                          product.isActive
                            ? 'bg-[#C5A572]/10 text-[#0A1128]'
                            : 'bg-[#0A1128]/10 text-[#0A1128]'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
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

        {/* All Modals - Outside tab sections so they work on any tab */}
        {/* Create Brand Modal */}
        {showCreateBrandModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowCreateBrandModal(false);
              setBrandForm({ name: '', slug: '', description: '', logoUrl: '' });
            }}
          >
            <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-[#C5A572] max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-3xl font-bold text-black mb-6">Create New Brand</h2>
              <form onSubmit={handleCreateBrand} className="space-y-5">
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Name *</label>
                  <input
                    type="text"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full border-2 border-[#0A1128]/30 rounded-md px-4 py-3 text-base text-black font-medium focus:border-[#0A1128] focus:ring-2 focus:ring-[#C5A572] outline-none"
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
                    className="w-full border-2 border-[#0A1128]/30 rounded-md px-4 py-3 text-base text-black font-medium focus:border-[#0A1128] focus:ring-2 focus:ring-[#C5A572] outline-none"
                    required
                    placeholder="e.g., blazing-star"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Description</label>
                  <textarea
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    className="w-full border-2 border-[#0A1128]/30 rounded-md px-4 py-3 text-base text-black font-medium focus:border-[#0A1128] focus:ring-2 focus:ring-[#C5A572] outline-none"
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
                    className="w-full border-2 border-[#0A1128]/30 rounded-md px-4 py-3 text-base text-black font-medium focus:border-[#0A1128] focus:ring-2 focus:ring-[#C5A572] outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#C5A572] text-white font-bold py-4 rounded-md hover:bg-[#0A1128] disabled:opacity-50 transition-colors text-lg"
                  >
                    {loading ? 'Creating...' : 'Create Brand'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateBrandModal(false);
                      setBrandForm({ name: '', slug: '', description: '', logoUrl: '' });
                    }}
                    className="px-8 bg-[#0A1128]/40 text-white font-bold py-4 rounded-md hover:bg-white0 transition-colors text-lg"
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowEditBrandModal(false);
              setSelectedBrand(null);
              setBrandForm({ name: '', slug: '', description: '', logoUrl: '' });
            }}
          >
            <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-[#C5A572] max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-3xl font-bold text-black mb-6">Edit Brand</h2>
              <form onSubmit={handleUpdateBrand} className="space-y-5">
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Name *</label>
                  <input
                    type="text"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full border-2 border-[#0A1128]/30 rounded-md px-4 py-3 text-base text-black font-medium focus:border-[#0A1128] focus:ring-2 focus:ring-[#C5A572] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Slug *</label>
                  <input
                    type="text"
                    value={brandForm.slug}
                    onChange={(e) => setBrandForm({ ...brandForm, slug: e.target.value })}
                    className="w-full border-2 border-[#0A1128]/30 rounded-md px-4 py-3 text-base text-black font-medium focus:border-[#0A1128] focus:ring-2 focus:ring-[#C5A572] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Description</label>
                  <textarea
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    className="w-full border-2 border-[#0A1128]/30 rounded-md px-4 py-3 text-base text-black font-medium focus:border-[#0A1128] focus:ring-2 focus:ring-[#C5A572] outline-none"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-2 text-black">Logo URL</label>
                  <input
                    type="url"
                    value={brandForm.logoUrl}
                    onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                    className="w-full border-2 border-[#0A1128]/30 rounded-md px-4 py-3 text-base text-black font-medium focus:border-[#0A1128] focus:ring-2 focus:ring-[#C5A572] outline-none"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#C5A572] text-white font-bold py-4 rounded-md hover:bg-[#0A1128] disabled:opacity-50 transition-colors text-lg"
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
                    className="px-8 bg-[#0A1128]/40 text-white font-bold py-4 rounded-md hover:bg-white0 transition-colors text-lg"
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowBrandDetailsModal(false);
              setSelectedBrand(null);
            }}
          >
            <div className="bg-white rounded-xl shadow-2xl border-4 border-[#C5A572] max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                    className="text-[#0A1128]/50 hover:text-black text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Description */}
                {selectedBrand.description && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">Description</h3>
                    <p className="text-black bg-[#0A1128]/5 p-4 rounded-lg">{selectedBrand.description}</p>
                  </div>
                )}

                {/* Logo */}
                {selectedBrand.logoUrl && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">Logo</h3>
                    <img
                      src={selectedBrand.logoUrl}
                      alt={`${selectedBrand.name} logo`}
                      className="max-w-xs border-2 border-[#0A1128]/20 rounded-lg"
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
                        <div
                          key={product.id}
                          onClick={() => {
                            setShowBrandDetailsModal(false);
                            fetchProductDetails(product.productCode);
                          }}
                          className="bg-[#0A1128]/5 p-4 rounded-lg border-2 border-[#0A1128]/20 hover:bg-[#C5A572]/10 hover:border-[#C5A572] transition-colors cursor-pointer"
                        >
                          <p className="text-base font-bold text-black">{product.name}</p>
                          <p className="text-sm text-black font-medium">Code: {product.productCode}</p>
                          <p className="text-sm text-black">
                            Status: <span className={product.isActive ? 'text-[#0A1128]' : 'text-[#0A1128]'}>
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
                  <div className="bg-[#0A1128]/5 p-4 rounded-lg">
                    <p className="text-black font-medium">Created: {new Date(selectedBrand.createdAt).toLocaleString()}</p>
                    <p className="text-black font-medium">Updated: {new Date(selectedBrand.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t-2 border-[#0A1128]/20">
                  <button
                    onClick={() => {
                      setShowBrandDetailsModal(false);
                      setSelectedBrand(null);
                    }}
                    className="bg-[#0A1128]/40 text-white font-bold px-6 py-3 rounded-md hover:bg-white0 transition-colors text-base"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowBrandDetailsModal(false);
                      openEditBrandModal(selectedBrand);
                    }}
                    className="flex-1 bg-[#C5A572] text-white font-bold py-3 rounded-md hover:bg-[#0A1128] transition-colors text-base"
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowProductModal(false);
              setSelectedProduct(null);
              setIsEditingProduct(false);
              setShowVersionComparison(false);
            }}
          >
            <div className="bg-white rounded-xl shadow-2xl border-4 border-[#0A1128] max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                    className="text-[#0A1128]/50 hover:text-black text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Version Info */}
                {selectedProduct.versions && selectedProduct.versions.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-black">Current Version</h3>
                      {selectedProduct.versions.length > 1 && (
                        <button
                          onClick={() => setShowVersionComparison(true)}
                          className="text-sm bg-[#C5A572] text-white px-4 py-2 rounded hover:bg-[#0A1128] font-bold"
                        >
                          Compare Versions
                        </button>
                      )}
                    </div>
                    <div className="bg-[#0A1128]/5 p-4 rounded-lg">
                      <p className="text-black font-medium">
                        Version {selectedProduct.versions[0].versionNumber}
                        {selectedProduct.versions[0].versionName && ` - ${selectedProduct.versions[0].versionName}`}
                      </p>
                      {selectedProduct.versions[0].description && (
                        <p className="text-black mt-2">{selectedProduct.versions[0].description}</p>
                      )}
                      <p className="text-xs text-[#0A1128]/70 mt-2">
                        {selectedProduct.versions.length} total version{selectedProduct.versions.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Content */}
                {selectedProduct.versions?.[0] && (
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
                          className="ml-4 text-sm bg-[#C5A572] text-white px-3 py-1 rounded hover:bg-[#0A1128]"
                        >
                          + Add Content
                        </button>
                      )}
                    </h3>
                    {selectedProduct.versions[0].contents && selectedProduct.versions[0].contents.length > 0 ? (
                      <div className="space-y-3">
                        {selectedProduct.versions[0].contents.map((content: any, index: number) => (
                          <div key={content.id} className="bg-[#0A1128]/5 p-4 rounded-lg">
                            <p className="text-sm font-bold text-black mb-2">
                              {content.contentType} ({content.language})
                            </p>
                            {isEditingProduct ? (
                              <TiptapEditor
                                content={productForm.contents[index]?.content || content.content}
                                onChange={(html) => {
                                  const newContents = [...productForm.contents];
                                  newContents[index] = { ...content, content: html };
                                  setProductForm({ ...productForm, contents: newContents });
                                }}
                                onBlur={() => handleUpdateProductContent(content.id, productForm.contents[index]?.content || content.content)}
                              />
                            ) : (
                              <div className="text-black prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content.content.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>') }} />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#0A1128]/5 p-4 rounded-lg text-center">
                        <p className="text-black/60 font-medium">No content yet. Click "+ Add Content" to add content for this product.</p>
                      </div>
                    )}
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
                        <div key={prop.id} className="bg-[#0A1128]/5 p-3 rounded-lg">
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
                              className="w-full border-2 border-[#0A1128]/30 rounded px-2 py-1 text-black font-medium"
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
                      <table className="w-full border-2 border-[#0A1128]/20">
                        <thead className="bg-[#0A1128] text-white">
                          <tr>
                            <th className="px-4 py-2 text-left font-bold">Size</th>
                            <th className="px-4 py-2 text-left font-bold">Price</th>
                            <th className="px-4 py-2 text-left font-bold">Discount</th>
                            <th className="px-4 py-2 text-left font-bold">Condition</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#0A1128]/10">
                          {selectedProduct.versions[0].pricing.map((price: any) => (
                            <tr key={price.id}>
                              <td className="px-4 py-2 text-black font-medium">{price.size}</td>
                              <td className="px-4 py-2 text-black font-bold">
                                {price.currency} {price.price}
                              </td>
                              <td className="px-4 py-2 text-black font-bold text-[#0A1128]">
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

                {/* Nail Art Showcase */}
                {(() => {
                  const nailWorks = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('nail_portfolio_works') || '[]') : [];
                  const linkedWorks = nailWorks.filter((work: any) => work.productCode === selectedProduct.productCode);

                  return linkedWorks.length > 0 ? (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-black mb-3">Nail art showcase ({linkedWorks.length})</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {linkedWorks.map((work: any) => (
                          <div key={work.id} className="bg-[#F9FAFA] rounded-lg border-2 border-[#0A1128]/20 overflow-hidden hover:border-[#C5A572] transition-all">
                            <img
                              src={work.imageUrl}
                              alt={work.description}
                              className="w-full h-40 object-cover"
                            />
                            <div className="p-3">
                              <p className="text-xs font-bold text-[#C5A572] mb-1">By {work.artist}</p>
                              <p className="text-xs text-black/70 line-clamp-2">{work.description}</p>
                              <p className="text-xs text-black/60 mt-1">{new Date(work.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t-2 border-[#0A1128]/20">
                  <button
                    onClick={() => {
                      setShowProductModal(false);
                      setSelectedProduct(null);
                      setIsEditingProduct(false);
                      setShowVersionComparison(false);
                    }}
                    className="bg-[#0A1128]/40 text-white font-bold px-6 py-3 rounded-md hover:bg-white0 transition-colors text-base"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditingProduct(!isEditingProduct)}
                    className={`flex-1 font-bold py-3 rounded-md transition-colors text-base ${
                      isEditingProduct
                        ? 'bg-[#C5A572] text-white hover:bg-[#0A1128]'
                        : 'bg-[#0A1128] text-white hover:bg-[#C5A572]'
                    }`}
                  >
                    {isEditingProduct ? 'Done Editing' : 'Edit Product'}
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
                    className="bg-[#C5A572] text-white font-bold px-6 py-3 rounded-md hover:bg-[#0A1128] transition-colors text-base"
                  >
                    Export Info Pack
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Version Comparison Modal */}
        {showVersionComparison && selectedProduct && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVersionComparison(false)}
          >
            <div className="bg-white rounded-xl shadow-2xl border-4 border-[#C5A572] max-w-6xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-black mb-2">{selectedProduct.name}</h2>
                    <p className="text-base text-black font-medium">Version Comparison & Rollback</p>
                  </div>
                  <button
                    onClick={() => setShowVersionComparison(false)}
                    className="text-[#0A1128]/50 hover:text-black text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <VersionComparison productCode={selectedProduct.productCode} />

                <div className="flex gap-3 pt-6 mt-6 border-t-2 border-[#0A1128]/20">
                  <button
                    onClick={() => setShowVersionComparison(false)}
                    className="flex-1 bg-[#0A1128]/40 text-white font-bold px-6 py-3 rounded-md hover:bg-white0 transition-colors text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSV Import Modal */}
        {showImportModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImportModal(false)}
          >
            <div className="bg-white rounded-xl shadow-2xl border-4 border-[#C5A572] max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-black">Import CSV</h2>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="text-[#0A1128]/50 hover:text-black text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <CSVImport />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
