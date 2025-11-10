'use client';

import SaleCard from '@/components/SaleCard';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);

  const samplePricingTable = [
    {
      size: '15ml',
      price: '£5',
      condition: 'Mua từ 12 chai trở lên có thể MIX & MATCH với Base/Top',
      discount: '£4.5',
    },
    {
      size: 'Set 36 màu',
      price: '£216',
      condition: 'Mua cả set',
      discount: '£194.4',
    },
  ];

  const exportToPNG = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'sale-card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Winter Sale 2025
      </h1>

      <div className="flex justify-center mb-4">
        <button
          onClick={exportToPNG}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
        >
          Export to PNG
        </button>
      </div>

      <div ref={cardRef} className="space-y-8">
        {/* First Card - Bold Berry */}
        <SaleCard
          productImages={[]}
          resultImage=""
          promotionText="ÁP DỤNG TỪ NGÀY 14/11 ĐẾN HẾT NGÀY 30/11"
          productName="Bold Berry Gel Polish"
          discountPercentage={10}
          pricingTable={samplePricingTable}
        />

        {/* Second Card - Blazing Star Powder */}
        <SaleCard
          productImages={[]}
          resultImage=""
          promotionText="ÁP DỤNG TỪ NGÀY 14/11 ĐẾN HẾT NGÀY 30/11"
          productName="BlazingStar Acrylic Powder - Natural Pink"
          discountPercentage={15}
          pricingTable={[
            {
              size: '23oz',
              price: '£36',
              condition: 'Mua từ 5 trở lên',
              discount: '£30.6',
            },
          ]}
        />
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
