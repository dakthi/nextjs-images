'use client';

import SaleCard from '@/components/SaleCard';
import ExportSelector from '@/components/ExportSelector';
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import productsData from '@/data/products-generated.json';

// Products are already sorted in the JSON file in the desired order

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardRefsMap = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(productsData.products.map(p => p.id))
  );
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Select Products to Export ({selectedProducts.size}/{productsData.products.length})</h2>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsData.products.map((product) => (
            <label key={product.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedProducts.has(product.id)}
                onChange={() => toggleProduct(product.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-700">{product.productName}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Visible cards for UI */}
      <div className="space-y-8">
        {productsData.products
          .filter(product => selectedProducts.has(product.id))
          .map((product, index) => (
          <div key={`visible-${product.id}`}>
            <SaleCard
              productImages={[
                product.images.topLeft,
                product.images.topRight,
                product.images.bottomLeft,
              ]}
              resultImage=""
              promotionText={product.promotionText}
              productName={product.productName}
              discountPercentage={product.discountPercentage}
              pricingTable={product.pricingTable}
              cardNumber={productsData.products.findIndex(p => p.id === product.id) + 1}
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
                product.images.topLeft,
                product.images.topRight,
                product.images.bottomLeft,
              ]}
              resultImage=""
              promotionText={product.promotionText}
              productName={product.productName}
              discountPercentage={product.discountPercentage}
              pricingTable={product.pricingTable}
              cardNumber={index + 1}
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
