'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';

interface ProductUsed {
  brand: string;
  productName: string;
  color?: string;
}

interface NailWork {
  id: string;
  imageUrl: string;
  description: string;
  artist: string;
  createdAt: string;
  productId?: number;
  productName?: string;
  productCode?: string;
  brandName?: string;
  products?: ProductUsed[];
}

export default function NailPortfolioManagePage() {
  const [uploadedWorks, setUploadedWorks] = useState<NailWork[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<NailWork[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<string>('all');
  const [artists, setArtists] = useState<string[]>([]);
  const [selectedWork, setSelectedWork] = useState<NailWork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedArtist, setEditedArtist] = useState('');
  const [linkProductMode, setLinkProductMode] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedProductForLink, setSelectedProductForLink] = useState('');

  useEffect(() => {
    loadWorks();
    loadBrands();
  }, []);

  useEffect(() => {
    filterWorks();
  }, [uploadedWorks, searchTerm, selectedArtist]);

  useEffect(() => {
    if (brands.length > 0) {
      loadProducts();
    }
  }, [brands]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const loadWorks = () => {
    const works = localStorage.getItem('nail_portfolio_works');
    if (works) {
      const parsed = JSON.parse(works);
      setUploadedWorks(parsed);

      // Extract unique artists
      const uniqueArtists = Array.from(new Set(parsed.map((w: NailWork) => w.artist)));
      setArtists(uniqueArtists as string[]);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await fetch('/api/brands/crud');
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Failed to load brands:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const allProductsData: any[] = [];
      for (const brand of brands) {
        const response = await fetch(`/api/products/search?brand=${brand.id}&limit=2000&active=true`);
        if (response.ok) {
          const data = await response.json();
          allProductsData.push(...(data.data || []));
        }
      }
      setAllProducts(allProductsData);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const filterWorks = () => {
    let filtered = [...uploadedWorks];

    // Filter by artist
    if (selectedArtist !== 'all') {
      filtered = filtered.filter(work => work.artist === selectedArtist);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(work =>
        work.description.toLowerCase().includes(term) ||
        work.artist.toLowerCase().includes(term)
      );
    }

    setFilteredWorks(filtered);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this work?')) return;

    const updatedWorks = uploadedWorks.filter(work => work.id !== id);
    setUploadedWorks(updatedWorks);
    localStorage.setItem('nail_portfolio_works', JSON.stringify(updatedWorks));
  };

  const handleDeleteAll = () => {
    if (!confirm('Are you sure you want to delete ALL works? This cannot be undone!')) return;

    localStorage.removeItem('nail_portfolio_works');
    setUploadedWorks([]);
    setFilteredWorks([]);
    setArtists([]);
  };

  const handleExportCSV = () => {
    if (filteredWorks.length === 0) {
      alert('No nail art works to export');
      return;
    }

    // Create CSV content
    const headers = ['ID', 'Artist', 'Description', 'Upload Date', 'Linked Product Code', 'Linked Product Name', 'Brand', 'Products Used', 'Image URL'];
    const rows = filteredWorks.map(work => [
      work.id,
      work.artist,
      work.description.replace(/"/g, '""'), // Escape quotes
      new Date(work.createdAt).toLocaleDateString(),
      work.productCode || '',
      work.productName || '',
      work.brandName || '',
      work.products?.map(p => `${p.brand} - ${p.productName}${p.color ? ` (${p.color})` : ''}`).join('; ') || '',
      work.imageUrl
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nail-portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const openModal = (work: NailWork) => {
    setSelectedWork(work);
    setEditedDescription(work.description);
    setEditedArtist(work.artist);
    setIsModalOpen(true);
    setEditMode(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
    setEditMode(false);
  };

  const handleSaveEdit = () => {
    if (!selectedWork) return;

    const updatedWorks = uploadedWorks.map(work =>
      work.id === selectedWork.id
        ? { ...work, description: editedDescription, artist: editedArtist }
        : work
    );

    setUploadedWorks(updatedWorks);
    localStorage.setItem('nail_portfolio_works', JSON.stringify(updatedWorks));
    setSelectedWork({ ...selectedWork, description: editedDescription, artist: editedArtist });
    setEditMode(false);
  };

  const handleDownloadImage = async () => {
    if (!selectedWork) return;

    try {
      // Create info text
      const infoText = `
NAIL ART INFORMATION
═══════════════════════════════════════════════════════

Artist: ${selectedWork.artist}
Uploaded: ${new Date(selectedWork.createdAt).toLocaleDateString()}

Description:
${selectedWork.description}

${selectedWork.products && selectedWork.products.length > 0 ? `
Products Used:
${selectedWork.products.map(p => `- ${p.brand} - ${p.productName}${p.color ? ` (${p.color})` : ''}`).join('\n')}
` : ''}

${selectedWork.productId ? `
Main Product (Linked):
Brand: ${selectedWork.brandName}
Product: ${selectedWork.productName}
Code: ${selectedWork.productCode}
` : ''}

Image URL: ${selectedWork.imageUrl}

═══════════════════════════════════════════════════════
VL London
Generated: ${new Date().toLocaleString()}
      `.trim();

      // Fetch image
      const imageResponse = await fetch(selectedWork.imageUrl);
      const imageBlob = await imageResponse.blob();

      // Create ZIP using JSZip (we'll need to import this)
      // For now, let's use a simpler approach with fetch to API
      const formData = new FormData();
      formData.append('image', imageBlob, 'nail-art.jpg');
      formData.append('info', infoText);
      formData.append('filename', `${selectedWork.artist.replace(/\s+/g, '_')}_${selectedWork.id}`);

      // Just open in new tab for now
      const link = document.createElement('a');
      link.href = selectedWork.imageUrl;
      link.target = '_blank';
      link.download = `${selectedWork.artist.replace(/\s+/g, '_')}_${selectedWork.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Also download info as text file
      const infoBlob = new Blob([infoText], { type: 'text/plain' });
      const infoUrl = window.URL.createObjectURL(infoBlob);
      const infoLink = document.createElement('a');
      infoLink.href = infoUrl;
      infoLink.download = `${selectedWork.artist.replace(/\s+/g, '_')}_${selectedWork.id}_info.txt`;
      document.body.appendChild(infoLink);
      infoLink.click();
      document.body.removeChild(infoLink);
      window.URL.revokeObjectURL(infoUrl);
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Failed to download. Opening image in new tab...');
      window.open(selectedWork.imageUrl, '_blank');
    }
  };

  const handleApproveProduct = (productName: string, brand: string) => {
    if (!selectedWork) return;

    // Find the matching product from the products list
    const product = allProducts.find(p =>
      p.name === productName && p.brand?.name === brand
    );

    if (!product) {
      alert(`Could not find product "${productName}" by ${brand}. Please link manually.`);
      return;
    }

    const updatedWork = {
      ...selectedWork,
      productId: parseInt(product.id),
      productName: product.name,
      productCode: product.productCode,
      brandName: product.brand?.name,
    };

    const updatedWorks = uploadedWorks.map(work =>
      work.id === selectedWork.id ? updatedWork : work
    );

    setUploadedWorks(updatedWorks);
    localStorage.setItem('nail_portfolio_works', JSON.stringify(updatedWorks));
    setSelectedWork(updatedWork);
    alert(`Approved "${productName}" as main product!`);
  };

  const handleLinkProduct = () => {
    if (!selectedWork || !selectedProductForLink) return;

    const product = allProducts.find(p => p.id === selectedProductForLink);
    if (!product) return;

    const updatedWork = {
      ...selectedWork,
      productId: parseInt(product.id),
      productName: product.name,
      productCode: product.productCode,
      brandName: product.brand?.name,
    };

    const updatedWorks = uploadedWorks.map(work =>
      work.id === selectedWork.id ? updatedWork : work
    );

    setUploadedWorks(updatedWorks);
    localStorage.setItem('nail_portfolio_works', JSON.stringify(updatedWorks));
    setSelectedWork(updatedWork);
    setLinkProductMode(false);
    setSelectedBrand('');
    setSelectedProductForLink('');
    alert('Product linked successfully!');
  };

  const handleDownloadInfoPack = async () => {
    if (!selectedWork || !selectedWork.productCode) {
      alert('No product linked to this nail art');
      return;
    }

    try {
      const response = await fetch('/api/export/info-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: [selectedWork.productCode],
          format: 'zip',
          includeImages: true,
          includeProperties: true,
          includePricing: true,
          includeVersions: true,
          nailArtImage: selectedWork.imageUrl,
          nailArtInfo: {
            artist: selectedWork.artist,
            description: selectedWork.description,
            uploadDate: selectedWork.createdAt,
            products: selectedWork.products,
          },
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedWork.brandName}_${selectedWork.productCode}_Info_Pack.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('Product information pack downloaded as ZIP!');
    } catch (error) {
      console.error('Error downloading info pack:', error);
      alert('Failed to download information pack. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Nail Portfolio Management</h1>
          <p className="text-xl text-black font-semibold">Manage uploaded nail art works</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-[#0A1128]/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by description or artist..."
                className="w-full p-3 border-2 border-[#0A1128]/20 rounded-md focus:border-[#C5A572] focus:outline-none text-black"
              />
            </div>

            {/* Artist Filter */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">Filter by Artist</label>
              <select
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                className="w-full p-3 border-2 border-[#0A1128]/20 rounded-md focus:border-[#C5A572] focus:outline-none text-black font-medium"
              >
                <option value="all">All Artists</option>
                {artists.map(artist => (
                  <option key={artist} value={artist}>{artist}</option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-end">
              <div className="bg-[#C5A572]/10 p-3 rounded-md border-2 border-[#C5A572]/30">
                <p className="text-sm font-semibold text-black">
                  Showing {filteredWorks.length} of {uploadedWorks.length} works
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => window.location.href = '/nail-portfolio/uploads'}
              className="bg-[#C5A572] text-white font-bold px-6 py-2 rounded-md hover:bg-[#0A1128] transition-colors"
            >
              Go to Upload Page
            </button>
            {uploadedWorks.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="bg-red-600 text-white font-bold px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete All Works
              </button>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border-2 border-[#0A1128]/20">
          <h2 className="text-2xl font-bold text-black mb-6">
            Portfolio Gallery
            {selectedArtist !== 'all' && ` - ${selectedArtist}`}
          </h2>

          {filteredWorks.length === 0 ? (
            <div className="text-center py-12 text-black/60">
              <p className="text-lg">
                {uploadedWorks.length === 0
                  ? 'No works uploaded yet'
                  : 'No works match your filters'}
              </p>
              <p className="text-sm mt-2">
                {uploadedWorks.length === 0
                  ? 'Artists can upload their work from the upload page'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-[#0A1128]/20 hover:border-[#C5A572] transition-all group cursor-pointer"
                  onClick={() => openModal(work)}
                >
                  <div className="relative">
                    <img
                      src={work.imageUrl}
                      alt={work.description}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(work.id);
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white font-bold px-3 py-1 rounded-md hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-black text-sm mb-3 line-clamp-3">{work.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#C5A572] bg-[#C5A572]/10 px-2 py-1 rounded">
                        {work.artist}
                      </span>
                      <span className="text-black/60">
                        {new Date(work.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && selectedWork && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-xl shadow-2xl border-4 border-[#C5A572] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Body */}
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-black mb-2">Nail Art Showcase</h2>
                    <p className="text-base text-black font-medium">
                      By {selectedWork.artist}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-[#0A1128]/50 hover:text-black text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Image */}
                <div className="mb-6">
                  <img
                    src={selectedWork.imageUrl}
                    alt={selectedWork.description}
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg border-2 border-[#0A1128]/20"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Linked Product for Info Pack */}
                  {selectedWork.productId && (
                    <div className="bg-[#C5A572]/10 border-2 border-[#C5A572] p-4 rounded-lg">
                      <label className="block text-sm font-bold text-black mb-2">Main product - info pack available</label>
                      <div className="space-y-1 mb-3">
                        {selectedWork.brandName && (
                          <p className="text-black">
                            <span className="font-semibold">Brand:</span> {selectedWork.brandName}
                          </p>
                        )}
                        {selectedWork.productName && (
                          <p className="text-black">
                            <span className="font-semibold">Product:</span> {selectedWork.productName}
                          </p>
                        )}
                        {selectedWork.productCode && (
                          <p className="text-black">
                            <span className="font-semibold">Code:</span> {selectedWork.productCode}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleDownloadInfoPack}
                        className="w-full bg-[#0A1128] text-white font-bold px-4 py-3 rounded-md hover:bg-[#C5A572] transition-colors text-base"
                      >
                        Download product info pack
                      </button>
                      <p className="text-xs text-black/60 mt-2 text-center">
                        Complete product details, pricing, and specifications
                      </p>
                    </div>
                  )}

                  {/* All Products Used */}
                  {selectedWork.products && selectedWork.products.length > 0 && (
                    <div className="bg-[#F9FAFA] border-2 border-[#0A1128]/20 p-4 rounded-lg">
                      <label className="block text-sm font-bold text-black mb-3">
                        Products used by artist
                      </label>
                      <div className="space-y-2">
                        {selectedWork.products.map((product, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded border border-[#0A1128]/10">
                            <div className="flex-1">
                              <span className="font-semibold text-black">{product.brand}</span>
                              <span className="text-black/70"> - {product.productName}</span>
                              {product.color && (
                                <span className="text-black/60 text-sm"> ({product.color})</span>
                              )}
                            </div>
                            {!selectedWork.productId && (
                              <button
                                onClick={() => handleApproveProduct(product.productName, product.brand)}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors text-xs font-bold"
                                title="Approve as main product"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link Product Section */}
                  {linkProductMode ? (
                    <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
                      <label className="block text-sm font-bold text-black mb-3">Link main product</label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-black/70 mb-1">Brand</label>
                          <select
                            value={selectedBrand}
                            onChange={(e) => {
                              setSelectedBrand(e.target.value);
                              setSelectedProductForLink('');
                            }}
                            className="w-full p-2 border-2 border-blue-300 rounded focus:border-blue-500 focus:outline-none"
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
                            value={selectedProductForLink}
                            onChange={(e) => setSelectedProductForLink(e.target.value)}
                            disabled={!selectedBrand}
                            className="w-full p-2 border-2 border-blue-300 rounded focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                          >
                            <option value="">Select product</option>
                            {allProducts
                              .filter(p => p.brand?.id === selectedBrand)
                              .map((p) => (
                                <option key={p.id} value={p.id}>{p.name} ({p.productCode})</option>
                              ))}
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleLinkProduct}
                            disabled={!selectedProductForLink}
                            className="flex-1 bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Link product
                          </button>
                          <button
                            onClick={() => {
                              setLinkProductMode(false);
                              setSelectedBrand('');
                              setSelectedProductForLink('');
                            }}
                            className="bg-gray-500 text-white font-bold px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : !selectedWork.productId && (
                    <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg">
                      <p className="text-sm text-black mb-2">
                        <strong>No product linked yet.</strong> Link a product to enable info pack downloads.
                      </p>
                      <button
                        onClick={() => setLinkProductMode(true)}
                        className="bg-yellow-600 text-white font-bold px-4 py-2 rounded hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Link product now
                      </button>
                    </div>
                  )}

                  {/* Artist */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Artist</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedArtist}
                        onChange={(e) => setEditedArtist(e.target.value)}
                        className="w-full p-3 border-2 border-[#0A1128]/20 rounded-md focus:border-[#C5A572] focus:outline-none text-black"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-[#C5A572] bg-[#C5A572]/10 px-4 py-2 rounded-md inline-block">
                        {selectedWork.artist}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Description</label>
                    {editMode ? (
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={4}
                        className="w-full p-3 border-2 border-[#0A1128]/20 rounded-md focus:border-[#C5A572] focus:outline-none text-black"
                      />
                    ) : (
                      <p className="text-black bg-[#F9FAFA] p-4 rounded-md border border-[#0A1128]/10">
                        {selectedWork.description}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Uploaded On</label>
                    <p className="text-black/60">
                      {new Date(selectedWork.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t-2 border-[#0A1128]/20">
                  {editMode ? (
                    <>
                      <button
                        onClick={closeModal}
                        className="bg-[#0A1128]/40 text-white font-bold px-6 py-3 rounded-md hover:bg-[#0A1128]/60 transition-colors text-base"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-green-600 text-white font-bold px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-base"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setEditedDescription(selectedWork.description);
                          setEditedArtist(selectedWork.artist);
                        }}
                        className="bg-gray-500 text-white font-bold px-6 py-3 rounded-md hover:bg-gray-600 transition-colors text-base"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={closeModal}
                        className="bg-[#0A1128]/40 text-white font-bold px-6 py-3 rounded-md hover:bg-[#0A1128]/60 transition-colors text-base"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex-1 bg-[#0A1128] text-white font-bold px-6 py-3 rounded-md hover:bg-[#C5A572] transition-colors text-base"
                      >
                        Edit details
                      </button>
                      {selectedWork.productCode && (
                        <button
                          onClick={handleDownloadInfoPack}
                          className="bg-[#C5A572] text-white font-bold px-6 py-3 rounded-md hover:bg-[#0A1128] transition-colors text-base"
                        >
                          Export info pack
                        </button>
                      )}
                      <button
                        onClick={handleDownloadImage}
                        className="bg-[#C5A572] text-white font-bold px-6 py-3 rounded-md hover:bg-[#0A1128] transition-colors text-base"
                      >
                        Download image
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this nail art?')) {
                            handleDelete(selectedWork.id);
                            closeModal();
                          }
                        }}
                        className="bg-red-600 text-white font-bold px-6 py-3 rounded-md hover:bg-red-700 transition-colors text-base"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
