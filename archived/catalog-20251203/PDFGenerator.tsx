'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  productName: string;
  category: string;
  promotionText: string;
  discountPercentage: number;
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
}

interface PDFGeneratorProps {
  products: Product[];
}

export default function PDFGenerator({ products }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);
  const [CatalogPDF, setCatalogPDF] = useState<any>(null);

  useEffect(() => {
    // Dynamically import on client side only
    import('@react-pdf/renderer').then((mod) => {
      setPDFDownloadLink(() => mod.PDFDownloadLink);
    });

    import('./CatalogPDF').then((mod) => {
      setCatalogPDF(() => mod.default);
    });
  }, []);

  if (!PDFDownloadLink || !CatalogPDF) {
    return (
      <button className="btn-primary" disabled>
        Loading PDF Generator...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<CatalogPDF products={products} />}
      fileName="VL-London-Winter-Sale-2025.pdf"
      className="btn-primary"
    >
      {({ loading }: { loading: boolean }) => (loading ? 'Generating PDF...' : 'Download PDF')}
    </PDFDownloadLink>
  );
}
