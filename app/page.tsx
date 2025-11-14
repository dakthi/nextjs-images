'use client';

import SaleCard from '@/components/SaleCard';
import ExportSelector from '@/components/ExportSelector';
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import productsData from '@/data/products-generated.json';
import { getImageUrl } from '@/utils/imageUrl';

// Products are already sorted in the JSON file in the desired order

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardRefsMap = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(productsData.products.map(p => p.id))
  );
  const [imageFilter, setImageFilter] = useState<'all' | 'with-images' | 'no-images'>('all');
  const [exportProgress, setExportProgress] = useState<{
    isExporting: boolean;
    current: number;
    total: number;
    message: string;
  }>({
    isExporting: false,
    current: 0,
    total: 0,
    message: '',
  });

  const toggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAll = () => {
    setSelectedProducts(new Set(productsData.products.map(p => p.id)));
  };

  const deselectAll = () => {
    setSelectedProducts(new Set());
  };

  // Function to check if a product has placeholder images
  const hasPlaceholderImages = (product: any) => {
    return (
      product.images.topLeft === '/vllondon-logo.jpeg' ||
      product.images.topRight === '/vllondon-logo.jpeg' ||
      product.images.bottomLeft === '/vllondon-logo.jpeg'
    );
  };

  // Filter products based on image filter
  const filteredProducts = productsData.products.filter((product) => {
    if (imageFilter === 'with-images') {
      return !hasPlaceholderImages(product);
    } else if (imageFilter === 'no-images') {
      return hasPlaceholderImages(product);
    }
    return true; // 'all'
  });

  // Shared function to convert product cards to PNG blobs
  const convertCardsToPngBlobs = async (options: { delayBetweenCards?: number } = {}) => {
    const { delayBetweenCards = 1000 } = options;
    const pngBlobs: Array<{ filename: string; blob: Blob }> = [];
    const failedProducts: string[] = [];

    const selectedProductsList = productsData.products
      .filter(p => selectedProducts.has(p.id));
    const total = selectedProductsList.length;
    let current = 0;

    console.log('Starting export for', total, 'products');
    console.log('Card refs available:', Object.keys(cardRefsMap.current).length);

    for (const product of selectedProductsList) {
      current++;
      setExportProgress({
        isExporting: true,
        current,
        total,
        message: `Converting ${product.productName}...`,
      });

      const element = cardRefsMap.current[product.id];
      console.log(`Processing ${product.productName}, element found:`, !!element);

      if (!element) {
        console.error(`No element found for ${product.productName} (${product.id})`);
        failedProducts.push(product.productName);
        continue;
      }

      try {
        // Wait for all images to load
        const images = element.querySelectorAll('img');
        console.log(`Found ${images.length} images in ${product.productName}`);

        // Check image loading status
        for (const img of Array.from(images)) {
          if (!img.complete) {
            console.log('Waiting for image to load:', img.src);
            await new Promise((resolve) => {
              img.onload = () => resolve(null);
              img.onerror = () => {
                console.error('Image failed to load:', img.src);
                resolve(null);
              };
              // Timeout after 5 seconds
              setTimeout(() => resolve(null), 5000);
            });
          }
        }

        // Wait for fonts and rendering
        await new Promise(resolve => setTimeout(resolve, delayBetweenCards));

        // Convert to PNG with multiple retry attempts
        console.log(`Converting ${product.productName} to PNG...`);

        let dataUrl: string | null = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (!dataUrl && attempts < maxAttempts) {
          attempts++;
          try {
            dataUrl = await toPng(element, {
              cacheBust: true,
              pixelRatio: 2,
              backgroundColor: '#f9fafb',
              skipFonts: false,
              includeQueryParams: false,
              filter: (node) => {
                // Filter out any problematic nodes
                return true;
              },
            });
          } catch (err) {
            console.error(`Attempt ${attempts} failed:`, err);
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 500));
            } else {
              throw err;
            }
          }
        }

        if (!dataUrl) {
          throw new Error('Failed to generate image after multiple attempts');
        }

        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error('Generated blob is empty');
        }

        // Remove or replace problematic characters in filename
        const filename = `${product.productName
          .replace(/[/\\:*?"<>|]/g, '-') // Replace illegal filename characters
          .replace(/\s+/g, '-') // Replace spaces with dashes
          .toLowerCase()}.png`;

        console.log(`Successfully converted ${product.productName}, blob size:`, blob.size);
        pngBlobs.push({ filename, blob });
      } catch (error) {
        console.error(`Failed to export ${product.productName}:`, error);
        failedProducts.push(product.productName);
      }
    }

    console.log(`Export complete. Success: ${pngBlobs.length}, Failed: ${failedProducts.length}`);
    return { pngBlobs, failedProducts };
  };

  const exportIndividualPNGs = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product to export');
      return;
    }

    try {
      const { pngBlobs, failedProducts } = await convertCardsToPngBlobs({ delayBetweenCards: 500 });

      if (pngBlobs.length === 0) {
        setExportProgress({
          isExporting: false,
          current: 0,
          total: 0,
          message: '',
        });
        alert('Failed to export any cards. Check the console for errors.');
        return;
      }

      const totalSteps = pngBlobs.length;
      let currentStep = 0;

      for (const { filename, blob } of pngBlobs) {
        try {
          currentStep++;
          setExportProgress({
            isExporting: true,
            current: currentStep + totalSteps,
            total: totalSteps * 2,
            message: `Downloading ${filename}...`,
          });

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Add delay between downloads
          await new Promise(resolve => setTimeout(resolve, 800));
        } catch (error) {
          console.error(`Failed to download ${filename}:`, error);
        }
      }

      setExportProgress({
        isExporting: false,
        current: 0,
        total: 0,
        message: '',
      });

      if (failedProducts.length > 0) {
        alert(`Exported ${currentStep} PNG files. Failed: ${failedProducts.join(', ')}`);
      }
      // Success - no alert, just log to console
      console.log(`Successfully exported ${currentStep} PNG files!`);
    } catch (error) {
      setExportProgress({
        isExporting: false,
        current: 0,
        total: 0,
        message: '',
      });
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportAllAsZip = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product to export');
      return;
    }

    try {
      const { pngBlobs, failedProducts } = await convertCardsToPngBlobs({ delayBetweenCards: 500 });

      if (pngBlobs.length === 0) {
        setExportProgress({
          isExporting: false,
          current: 0,
          total: 0,
          message: '',
        });
        alert('Failed to export any cards. Check the console for errors.');
        return;
      }

      setExportProgress({
        isExporting: true,
        current: 0,
        total: pngBlobs.length,
        message: 'Creating ZIP file...',
      });

      const zip = new JSZip();

      for (const { filename, blob } of pngBlobs) {
        zip.file(filename, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.download = `vl-london-sale-cards.zip`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportProgress({
        isExporting: false,
        current: 0,
        total: 0,
        message: '',
      });

      if (failedProducts.length > 0) {
        alert(`Created zip with ${pngBlobs.length} PNG files. Failed: ${failedProducts.join(', ')}`);
      }
      // Success - no alert, just log to console
      console.log(`Successfully created zip with ${pngBlobs.length} PNG files!`);
    } catch (error) {
      setExportProgress({
        isExporting: false,
        current: 0,
        total: 0,
        message: '',
      });
      console.error('ZIP export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportAllCardsAsZip = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product to export');
      return;
    }

    try {
      const { pngBlobs, failedProducts } = await convertCardsToPngBlobs();

      if (pngBlobs.length === 0) {
        alert('No cards to export');
        return;
      }

      const zip = new JSZip();

      for (const { filename, blob } of pngBlobs) {
        zip.file(filename, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.download = `vl-london-sale-cards.zip`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const message = failedProducts.length > 0
        ? `Created zip with ${pngBlobs.length} PNG files.\nFailed: ${failedProducts.join(', ')}`
        : `Created zip with ${pngBlobs.length} PNG files!`;

      alert(message);
    } catch (error) {
      console.error('Failed to export zip:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');

      if (!jsPDF) {
        alert('PDF library failed to load. Please try again.');
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      let addedPages = 0;

      for (let index = 0; index < productsData.products.length; index++) {
        const product = productsData.products[index];

        if (!selectedProducts.has(product.id)) continue;

        const element = cardRefsMap.current[product.id];

        if (element) {
          try {
            // Wait for images
            const images = element.querySelectorAll('img');
            await Promise.all(
              Array.from(images).map(img => {
                return new Promise((resolve) => {
                  if (img.complete) {
                    resolve(null);
                  } else {
                    img.onload = () => resolve(null);
                    img.onerror = () => resolve(null);
                  }
                });
              })
            );

            const imgData = await toPng(element, {
              cacheBust: true,
              pixelRatio: 1,
            });

            const imgWidth = 190;
            const img = new Image();
            img.src = imgData;

            await new Promise((resolve) => {
              img.onload = () => resolve(null);
            });

            const imgHeight = (img.height * imgWidth) / img.width;

            if (addedPages > 0) {
              pdf.addPage();
            }

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            addedPages++;
          } catch (error) {
            console.error(`Failed to add ${product.productName} to PDF:`, error);
          }
        }
      }

      if (addedPages > 0) {
        pdf.save('vl-london-sale-cards.pdf');
        alert(`PDF created with ${addedPages} pages`);
      } else {
        alert('No pages were added to PDF');
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportToCSV = () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product to export');
      return;
    }

    try {
      // Get selected products that match the current filter
      const selectedFilteredProducts = filteredProducts.filter(p => selectedProducts.has(p.id));

      if (selectedFilteredProducts.length === 0) {
        alert('No products match the current filter selection');
        return;
      }

      // CSV Headers
      const headers = [
        'Product ID',
        'Category',
        'Product Name',
        'Promotion Text',
        'Discount Percentage',
        'Has Images',
        'Image Top Left',
        'Image Top Right',
        'Image Bottom Left',
        'Pricing Details',
        'Scents',
        'Badge Position',
        'Table Text Size'
      ];

      // Build CSV rows
      const rows = selectedFilteredProducts.map(product => {
        const hasImages = !hasPlaceholderImages(product);

        // Format pricing table as a single cell
        const pricingDetails = product.pricingTable
          .map(pt => `${pt.size || 'N/A'}: ${pt.price} → ${pt.discount} (${pt.condition || 'No condition'})`)
          .join(' | ');

        const scents = (product as any).scents ? (product as any).scents.join(', ') : '';

        return [
          product.id,
          product.category,
          `"${product.productName.replace(/"/g, '""')}"`, // Escape quotes
          `"${product.promotionText.replace(/"/g, '""')}"`,
          product.discountPercentage,
          hasImages ? 'Yes' : 'No',
          product.images.topLeft,
          product.images.topRight,
          product.images.bottomLeft,
          `"${pricingDetails.replace(/"/g, '""')}"`,
          `"${scents.replace(/"/g, '""')}"`,
          product.badgePosition || 'bottom-right',
          (product as any).tableTextSize || 'xs'
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Add BOM for proper UTF-8 encoding in Excel
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;

      // Create blob and download
      const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vl-london-products-${imageFilter}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Successfully exported ${selectedFilteredProducts.length} products to CSV`);
    } catch (error) {
      console.error('CSV export failed:', error);
      alert(`CSV export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Winter Sale 2025
      </h1>

      <ExportSelector
        selectedCount={selectedProducts.size}
        totalCount={productsData.products.length}
        onExportPNGs={exportIndividualPNGs}
        onExportZip={exportAllAsZip}
        onExportPDF={exportToPDF}
        onExportCSV={exportToCSV}
        isExporting={exportProgress.isExporting}
      />

      {/* Progress Indicator */}
      {exportProgress.isExporting && (
        <div className="max-w-2xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{exportProgress.message}</span>
              <span className="text-sm font-medium text-gray-700">
                {exportProgress.current} / {exportProgress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(exportProgress.current / exportProgress.total) * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Please wait while we process your export...
          </p>
        </div>
      )}

      {/* Product Selector */}
      <div className="max-w-6xl mx-auto mb-8 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-800">Products</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={selectAll}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors text-sm"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors text-sm"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Image Filter Buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setImageFilter('all')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              imageFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({productsData.products.length})
          </button>
          <button
            onClick={() => setImageFilter('with-images')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              imageFilter === 'with-images'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            With Images ({productsData.products.filter(p => !hasPlaceholderImages(p)).length})
          </button>
          <button
            onClick={() => setImageFilter('no-images')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              imageFilter === 'no-images'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            No Images ({productsData.products.filter(p => hasPlaceholderImages(p)).length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.map((product) => (
            <label key={product.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedProducts.has(product.id)}
                onChange={() => toggleProduct(product.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{product.productName}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Visible cards for UI */}
      <div className="space-y-8">
        {filteredProducts
          .map((product, index) => (
          <div key={`visible-${product.id}`}>
            <SaleCard
              productImages={[
                getImageUrl(product.images.topLeft),
                getImageUrl(product.images.topRight),
                getImageUrl(product.images.bottomLeft),
              ]}
              resultImage=""
              promotionText={product.promotionText}
              productName={product.productName}
              discountPercentage={product.discountPercentage}
              pricingTable={product.pricingTable}
              productId={product.id}
              showProductId={true}
              badgePosition={(product.badgePosition as 'middle-right' | 'bottom-right' | undefined) || 'middle-right'}
              showOnlyLastTwoColumns={product.id === 'product-333'}
              showOnlyPriceColumn={(product as any).showOnlyPriceColumn || false}
              showSizeAndConditionColumnsOnly={(product as any).showSizeAndConditionColumnsOnly || false}
              imageLabels={
                product.id === 'product-372' ? { topLeft: 'Kira', topRight: 'MAIA', bottomLeft: 'NORA' } :
                product.id === 'product-378' ? { topLeft: 'Bendi', topRight: 'Bendi', bottomLeft: 'Bendi' } :
                product.id === 'product-377' ? { topLeft: 'Etan', topRight: 'Kaylee', bottomLeft: 'Velda' } :
                undefined
              }
              isChecked={selectedProducts.has(product.id)}
              onCheckChange={(checked) => {
                const newSelected = new Set(selectedProducts);
                if (checked) {
                  newSelected.add(product.id);
                } else {
                  newSelected.delete(product.id);
                }
                setSelectedProducts(newSelected);
              }}
              scents={(product as any).scents}
              tableTextSize={(product as any).tableTextSize || 'xs'}
            />
          </div>
        ))}
      </div>

      {/* Hidden cards for export - rendered but not visible */}
      <div ref={cardRef} className="fixed -left-[9999px] top-0" style={{ width: '1200px' }}>
        {productsData.products.map((product, index) => (
          <div
            key={product.id}
            ref={(el) => {
              if (el) cardRefsMap.current[product.id] = el;
            }}
            style={{
              marginBottom: '60px',
              paddingTop: '20px',
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingBottom: '20px',
              width: 'fit-content',
              position: 'relative'
            }}
          >
            <SaleCard
              productImages={[
                getImageUrl(product.images.topLeft),
                getImageUrl(product.images.topRight),
                getImageUrl(product.images.bottomLeft),
              ]}
              resultImage=""
              promotionText={product.promotionText}
              productName={product.productName}
              discountPercentage={product.discountPercentage}
              pricingTable={product.pricingTable}
              productId={product.id}
              showProductId={false}
              badgePosition={(product.badgePosition as 'middle-right' | 'bottom-right' | undefined) || 'middle-right'}
              showOnlyLastTwoColumns={product.id === 'product-333'}
              showSizeAndConditionColumnsOnly={['product-404', 'product-403', 'product-405'].includes(product.id)}
              imageLabels={
                product.id === 'product-372' ? { topLeft: 'Kira', topRight: 'MAIA', bottomLeft: 'NORA' } :
                product.id === 'product-378' ? { topLeft: 'Bendi', topRight: 'Bendi', bottomLeft: 'Bendi' } :
                product.id === 'product-377' ? { topLeft: 'Etan', topRight: 'Kaylee', bottomLeft: 'Velda' } :
                undefined
              }
              scents={(product as any).scents}
              tableTextSize={(product as any).tableTextSize || 'xs'}
            />
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">How to Use:</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-bold text-lg">1. Add your product images:</h3>
            <p className="ml-4">
              Place your images in the <code className="bg-gray-100 px-2 py-1 rounded">public</code> folder
              and reference them like <code className="bg-gray-100 px-2 py-1 rounded">/your-image.jpg</code>
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">2. Customize the props:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`<SaleCard
  productImages={['/colors.jpg', '/example.jpg']}
  resultImage="/result.jpg"
  promotionText="YOUR PROMOTION TEXT"
  productName="Your Product"
  discountPercentage={10}
  pricingTable={[
    {
      size: '15ml',
      price: '£5',
      condition: 'Your condition',
      discount: '£4.5',
    },
  ]}
/>`}
            </pre>
          </div>

          <div>
            <h3 className="font-bold text-lg">3. Run the development server:</h3>
            <code className="block bg-gray-100 px-4 py-2 rounded ml-4">npm install</code>
            <code className="block bg-gray-100 px-4 py-2 rounded ml-4 mt-2">npm run dev</code>
          </div>
        </div>
      </div>
    </main>
  );
}
