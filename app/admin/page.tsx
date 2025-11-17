'use client';

import { useState, useEffect } from 'react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  productCount?: number;
}

interface Product {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  isActive: boolean;
  brandId: string;
  brand?: Brand;
  versions?: ProductVersion[];
}

interface ProductVersion {
  id: string;
  versionNumber: number;
  versionName?: string;
  isCurrent: boolean;
  description?: string;
  createdBy: string;
  createdAt: string;
  content?: ProductContent[];
  images?: ProductImage[];
  properties?: ProductProperty[];
  pricing?: Pricing[];
}

interface ProductContent {
  id: string;
  contentType: string;
  content: string;
  language: string;
}

interface ProductImage {
  id: string;
  imageUrl: string;
  imageType: string;
  position?: string;
  displayOrder: number;
  altText?: string;
  label?: string;
}

interface ProductProperty {
  id: string;
  propertyKey: string;
  propertyValue: string;
  displayOrder: number;
}

interface Pricing {
  id: string;
  size: string;
  price: string;
  currency: string;
  condition?: string;
  discountPrice?: string;
  discountLabel?: string;
  displayOrder: number;
}

type Tab = 'brands' | 'products' | 'content';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('brands');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [brandForm, setBrandForm] = useState({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
  });

  const [productForm, setProductForm] = useState({
    brandId: '',
    productCode: '',
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  // Fetch brands
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/brands/crud');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for selected brand
  const fetchProductsForBrand = async (brandId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/crud?brandId=${brandId}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
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
      fetchBrands();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create brand');
    } finally {
      setLoading(false);
    }
  };

  // Create product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });
      if (!response.ok) throw new Error('Failed to create product');
      setSuccess('Product created successfully');
      setProductForm({
        brandId: selectedBrand?.id || '',
        productCode: '',
        name: '',
        slug: '',
        description: '',
        isActive: true,
      });
      if (selectedBrand) {
        fetchProductsForBrand(selectedBrand.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // Delete brand
  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/brands/crud?id=${brandId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete brand');
      setSuccess('Brand deleted successfully');
      fetchBrands();
      setSelectedBrand(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete brand');
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productCode: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/products/crud?id=${productCode}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setSuccess('Product deleted successfully');
      if (selectedBrand) {
        fetchProductsForBrand(selectedBrand.id);
      }
      setSelectedProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'brands') {
      fetchBrands();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedBrand && (activeTab === 'products' || activeTab === 'content')) {
      fetchProductsForBrand(selectedBrand.id);
    }
  }, [selectedBrand, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'brands'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Brands
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'content'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Content
          </button>
        </div>

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div className="grid grid-cols-2 gap-8">
            {/* Create Brand Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Create Brand</h2>
              <form onSubmit={handleCreateBrand} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={brandForm.name}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, name: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={brandForm.slug}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, slug: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={brandForm.description}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, description: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={brandForm.logoUrl}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, logoUrl: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Brand'}
                </button>
              </form>
            </div>

            {/* Brands List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Brands</h2>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedBrand(brand)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{brand.name}</h3>
                        <p className="text-sm text-gray-600">
                          {brand.productCount || 0} products
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBrand(brand.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {selectedBrand ? (
              <div className="grid grid-cols-2 gap-8">
                {/* Create Product Form */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">
                    Create Product in {selectedBrand.name}
                  </h2>
                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Product Code
                      </label>
                      <input
                        type="text"
                        value={productForm.productCode}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            productCode: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({ ...productForm, name: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Product'}
                    </button>
                  </form>
                </div>

                {/* Products List */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">
                    Products ({products.length})
                  </h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-xs text-gray-500">
                              {product.productCode}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.productCode);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Select a brand to manage its products</p>
              </div>
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div>
            {selectedProduct ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedProduct.name} - Content Management
                </h2>
                <p className="text-gray-600 mb-6">
                  Edit product descriptions, images, properties, and pricing here.
                </p>
                {/* Content management UI would go here */}
                <p className="text-center py-8 text-gray-500">
                  Content editor coming soon...
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Select a brand and product to manage its content
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
