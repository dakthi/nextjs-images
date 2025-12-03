'use client';

import { useState, useEffect } from 'react';

interface NailWork {
  id: string;
  imageUrl: string;
  description: string;
  artist: string;
  products: ProductUsed[];
  createdAt: string;
  productId?: number;
  productName?: string;
  productCode?: string;
  brandName?: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  productCode: string;
  brand: {
    id: string;
    name: string;
  };
}

interface ProductUsed {
  brand: string;
  productName: string;
  color?: string;
}

export default function NailPortfolioUploadPage() {
  const [artistName, setArtistName] = useState('');
  const [uploadedWorks, setUploadedWorks] = useState<NailWork[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Upload form state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [productsUsed, setProductsUsed] = useState<ProductUsed[]>([]);
  const [currentProduct, setCurrentProduct] = useState<{ brand: string; productName: string; color: string }>({
    brand: '',
    productName: '',
    color: ''
  });
  const [primaryProduct, setPrimaryProduct] = useState<Product | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Load works and brands on mount
  useEffect(() => {
    loadWorks();
    loadBrands();
  }, []);

  // Load products after brands are loaded
  useEffect(() => {
    if (brands.length > 0) {
      loadProducts();
    }
  }, [brands]);

  const loadBrands = async () => {
    try {
      const response = await fetch('/api/brands/crud');
      if (response.ok) {
        const data = await response.json();
        // Filter to only show the three allowed brands
        const allowedBrands = data.filter((b: Brand) =>
          ['BlazingStar', 'Bold Berry', 'MBerry'].includes(b.name)
        );
        setBrands(allowedBrands);
      }
    } catch (error) {
      console.error('Failed to load brands:', error);
    }
  };

  const loadProducts = async () => {
    try {
      // Load products for all three brands (increased limit to get more products)
      const allProductsData: Product[] = [];

      for (const brand of brands) {
        const response = await fetch(`/api/products/search?brand=${brand.id}&limit=2000&active=true`);
        if (response.ok) {
          const data = await response.json();
          allProductsData.push(...(data.data || []));
          console.log(`Loaded ${data.data?.length || 0} products for ${brand.name}`);
        }
      }

      console.log('Total products loaded:', allProductsData.length);
      setAllProducts(allProductsData);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const addProduct = () => {
    if (currentProduct.brand && currentProduct.productName) {
      setProductsUsed([...productsUsed, {
        brand: currentProduct.brand,
        productName: currentProduct.productName,
        color: currentProduct.color
      }]);
      setCurrentProduct({ brand: '', productName: '', color: '' });
    }
  };

  const removeProduct = (index: number) => {
    setProductsUsed(productsUsed.filter((_, i) => i !== index));
  };

  const getFilteredProducts = () => {
    if (!currentProduct.brand) return [];
    const filtered = allProducts.filter(p => p.brand?.name === currentProduct.brand);
    console.log('Filtered products for', currentProduct.brand, ':', filtered.length);
    return filtered;
  };

  const loadWorks = () => {
    const works = localStorage.getItem('nail_portfolio_works');
    if (works) {
      setUploadedWorks(JSON.parse(works));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages(files);

      // Generate previews for all selected images
      const previews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedImages.length === 0 || !description.trim() || !artistName.trim()) {
      setUploadError('Please provide your name, a description, and select at least one image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError('');
    setUploadSuccess('');

    try {
      // Upload each image
      const uploadedImageUrls: string[] = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const formData = new FormData();
        formData.append('image', selectedImages[i]);
        formData.append('description', description);
        formData.append('artist', artistName);
        formData.append('products', JSON.stringify(productsUsed));

        const response = await fetch('/api/nail-portfolio/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for image ${i + 1}`);
        }

        const data = await response.json();
        uploadedImageUrls.push(data.imageUrl);

        // Update progress
        setUploadProgress(Math.round(((i + 1) / selectedImages.length) * 100));
      }

      // Add to local works (one entry per image)
      const newWorks: NailWork[] = uploadedImageUrls.map((imageUrl, index) => ({
        id: `${Date.now()}-${index}`,
        imageUrl,
        description,
        artist: artistName,
        products: productsUsed,
        createdAt: new Date().toISOString(),
        productId: primaryProduct ? parseInt(primaryProduct.id) : undefined,
        productName: primaryProduct?.name,
        productCode: primaryProduct?.productCode,
        brandName: primaryProduct?.brand?.name,
      }));

      const updatedWorks = [...newWorks, ...uploadedWorks];
      setUploadedWorks(updatedWorks);
      localStorage.setItem('nail_portfolio_works', JSON.stringify(updatedWorks));

      setUploadSuccess(`${selectedImages.length} image(s) uploaded successfully!`);
      setSelectedImages([]);
      setImagePreviews([]);
      setDescription('');
      setArtistName('');
      setProductsUsed([]);
      setCurrentProduct({ brand: '', productName: '', color: '' });
      setPrimaryProduct(null);

      setTimeout(() => {
        setUploadSuccess('');
        setUploadProgress(0);
      }, 3000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/vllondon-logo.jpeg"
            alt="VL London"
            className="h-20 mx-auto mb-4"
          />
          <p className="text-lg text-black/70">Upload your nail art work</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 border-2 border-[#0A1128]/20">
          <h2 className="text-2xl font-bold text-black mb-6">Upload new work</h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Artist Name */}
            <div>
              <label className="block text-base font-bold text-black mb-2">
                Your name
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border-2 border-[#0A1128]/20 rounded-md focus:border-[#C5A572] focus:outline-none text-black"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-base font-bold text-black mb-2">
                Select images (multiple allowed)
              </label>
              <div className="space-y-4">
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border-2 border-[#C5A572] shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <label className="w-full h-48 border-2 border-dashed border-[#0A1128]/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#C5A572] transition-colors bg-[#F9FAFA]">
                  <svg className="w-16 h-16 text-[#C5A572] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[#0A1128] font-semibold">Click to upload images</span>
                  <span className="text-black/60 text-sm mt-2">PNG, JPG, HEIC up to 10MB each</span>
                  <span className="text-black/60 text-xs mt-1">Select multiple files</span>
                  <input
                    type="file"
                    accept="image/*,.heic,.HEIC"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Primary Product for Info Pack */}
            <div>
              <label className="block text-base font-bold text-black mb-2">
                Main product for info pack download
              </label>
              <p className="text-sm text-black/60 mb-3">
                Select the main product you used. This will allow viewers to download a complete information pack about this product.
              </p>
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#C5A572]/5 rounded-md border-2 border-[#C5A572]/30">
                <div>
                  <label className="block text-xs font-semibold text-black/70 mb-1">Brand</label>
                  <select
                    value={primaryProduct?.brand?.id || ''}
                    onChange={(e) => {
                      setPrimaryProduct(null);
                      const brand = brands.find(b => b.id === e.target.value);
                      if (brand) {
                        const firstProduct = allProducts.find(p => p.brand?.id === brand.id);
                        if (firstProduct) {
                          setPrimaryProduct({ ...firstProduct, brand });
                        }
                      }
                    }}
                    className="w-full p-2 border-2 border-[#C5A572]/30 rounded text-sm focus:border-[#C5A572] focus:outline-none"
                  >
                    <option value="">Select brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black/70 mb-1">Product</label>
                  <select
                    value={primaryProduct?.id || ''}
                    onChange={(e) => {
                      const product = allProducts.find(p => p.id === e.target.value);
                      setPrimaryProduct(product || null);
                    }}
                    disabled={!primaryProduct?.brand?.id}
                    className="w-full p-2 border-2 border-[#C5A572]/30 rounded text-sm focus:border-[#C5A572] focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select product</option>
                    {allProducts.filter(p => p.brand?.id === primaryProduct?.brand?.id).map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.productCode})</option>
                    ))}
                  </select>
                </div>
              </div>
              {primaryProduct && (
                <div className="mt-2 p-3 bg-green-50 border border-green-300 rounded text-sm text-green-800">
                  <strong>Selected:</strong> {primaryProduct.brand?.name} - {primaryProduct.name} ({primaryProduct.productCode})
                </div>
              )}
            </div>

            {/* Products Used (Optional) */}
            <div>
              <label className="block text-base font-bold text-black mb-2">
                Additional products used (optional)
              </label>

              {/* Added Products List */}
              {productsUsed.length > 0 && (
                <div className="mb-3 space-y-2">
                  {productsUsed.map((product, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#C5A572]/10 p-3 rounded-md border border-[#C5A572]/30">
                      <div className="text-sm">
                        <span className="font-bold text-black">{product.brand}</span>
                        <span className="text-black/70"> - {product.productName}</span>
                        {product.color && <span className="text-black/60"> ({product.color})</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-800 font-bold text-xs px-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Product Form */}
              <div className="space-y-3 p-4 bg-[#F9FAFA] rounded-md border border-[#0A1128]/10">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-black/70 mb-1">Brand</label>
                    <select
                      value={currentProduct.brand}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value, productName: '' })}
                      className="w-full p-2 border border-[#0A1128]/20 rounded text-sm focus:border-[#C5A572] focus:outline-none"
                    >
                      <option value="">Select brand</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-black/70 mb-1">Product</label>
                    <select
                      value={currentProduct.productName}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, productName: e.target.value })}
                      disabled={!currentProduct.brand}
                      className="w-full p-2 border border-[#0A1128]/20 rounded text-sm focus:border-[#C5A572] focus:outline-none disabled:bg-gray-100"
                    >
                      <option value="">Select product</option>
                      {getFilteredProducts().map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black/70 mb-1">Color (optional)</label>
                  <input
                    type="text"
                    value={currentProduct.color}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, color: e.target.value })}
                    placeholder="e.g., Red, #FF0000"
                    className="w-full p-2 border border-[#0A1128]/20 rounded text-sm focus:border-[#C5A572] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={addProduct}
                  disabled={!currentProduct.brand || !currentProduct.productName}
                  className="w-full bg-[#C5A572] text-white font-semibold py-2 rounded text-sm hover:bg-[#0A1128] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add product
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-base font-bold text-black mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border-2 border-[#0A1128]/20 rounded-md focus:border-[#C5A572] focus:outline-none text-black"
                placeholder="Describe the nail design, techniques, etc..."
                required
              />
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading || selectedImages.length === 0 || !description.trim() || !artistName.trim()}
              className="w-full bg-[#C5A572] text-white font-bold py-3 px-6 rounded-md hover:bg-[#0A1128] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {uploading ? `Uploading ${selectedImages.length} image(s)...` : 'Upload work'}
            </button>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-black">Uploading...</span>
                  <span className="font-bold text-[#C5A572]">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#0A1128]/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#C5A572] h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            {uploadError && (
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-md text-red-700">
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="p-3 bg-green-50 border-2 border-green-300 rounded-md text-green-700">
                {uploadSuccess}
              </div>
            )}
          </form>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border-2 border-[#0A1128]/20">
          <h2 className="text-2xl font-bold text-black mb-6">Your portfolio</h2>

          {uploadedWorks.length === 0 ? (
            <div className="text-center py-12 text-black/60">
              <p className="text-lg">No works uploaded yet</p>
              <p className="text-sm mt-2">Upload your first nail design above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedWorks.map((work) => (
                <div key={work.id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-[#0A1128]/20 hover:border-[#C5A572] transition-all">
                  <img
                    src={work.imageUrl}
                    alt={work.description}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-black text-sm mb-3">{work.description}</p>
                    {work.products && work.products.length > 0 && (
                      <div className="space-y-1 mb-3">
                        <div className="text-xs font-bold text-black/70 mb-1">Products used:</div>
                        {work.products.map((product, idx) => (
                          <div key={idx} className="text-xs text-black/60 pl-2">
                            • <span className="font-semibold">{product.brand}</span> - {product.productName}
                            {product.color && <span> ({product.color})</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs text-black/60 pt-2 border-t border-[#0A1128]/10">
                      <span className="font-semibold text-[#C5A572]">By {work.artist}</span>
                      <span>{new Date(work.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
