'use client';

import { useState } from 'react';

interface Product {
  id: string;
  productName: string;
  category: string;
  promotionText?: string;
  discountPercentage?: number;
  images: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
  };
  pricingTable: Array<{
    size?: string;
    price: string;
    condition?: string;
    discount: string;
  }>;
  scents?: string[];
  [key: string]: any;
}

interface PDFButtonProps {
  products: Product[];
}

export default function PDFButton({ products }: PDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      // Dynamically import the PDF libraries only when button is clicked
      const { PDFDownloadLink } = await import('@react-pdf/renderer');
      const { default: CatalogPDF } = await import('./CatalogPDF');
      const { pdf } = await import('@react-pdf/renderer');

      setIsLoading(false);
      setIsGenerating(true);

      // Generate the PDF
      const doc = <CatalogPDF products={products} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'VL-London-Winter-Sale-2025.pdf';
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsLoading(false);
      setIsGenerating(false);

      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error generating PDF: ${errorMessage}\n\nPlease check the console for details.`);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="btn-primary"
      disabled={isLoading || isGenerating}
    >
      {isLoading && 'Loading PDF Library...'}
      {isGenerating && 'Generating PDF...'}
      {!isLoading && !isGenerating && 'Download PDF'}
    </button>
  );
}
