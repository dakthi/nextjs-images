'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import fitty from 'fitty';

interface PricingRow {
  size: string;
  price: string;
  condition: string;
  discount: string;
}

interface SaleCardProps {
  productImages: string[];
  resultImage: string;
  promotionText: string;
  productName: string;
  discountPercentage: number;
  pricingTable: PricingRow[];
  saleStartDate?: string;
  saleEndDate?: string;
}

export default function SaleCard({
  productImages,
  resultImage,
  promotionText,
  productName,
  discountPercentage,
  pricingTable,
}: SaleCardProps) {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      fitty(textRef.current, {
        minSize: 16,
        maxSize: 96,
      });
    }
  }, [productName]);
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Background Image */}
      <Image
        src="/background.png"
        alt="Winter background"
        width={1200}
        height={1200}
        className="w-full h-auto rounded-lg"
        priority
      />

      {/* Penguin Sale Corner - Top Left */}
      <div className="absolute -top-4 -left-4 w-48 h-48 z-20">
        <Image
          src="/penguin-sale-corner.png"
          alt="Sale Corner"
          width={192}
          height={192}
          className="w-full h-full"
        />
      </div>

      {/* Promotion Banner - Top Right */}
      <div className="absolute top-1 right-2 bg-blue-800 text-white px-6 py-3 rounded-xl shadow-xl z-20">
        <p className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-center">
          {promotionText}
        </p>
      </div>

      {/* 4 Quadrant Grid Overlay */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-4 gap-2">
        {/* TOP LEFT QUADRANT - Logo Placeholder */}
        <div className="flex items-center justify-center p-2 relative">
          <div className="border-[12px] border-white shadow-2xl w-full h-full">
            <Image
              src="/vllondon-logo.jpeg"
              alt="VL London Logo"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* TOP RIGHT QUADRANT - Logo Placeholder */}
        <div className="flex items-center justify-center p-2">
          <div className="border-[12px] border-white shadow-2xl w-full h-full">
            <Image
              src="/vllondon-logo.jpeg"
              alt="VL London Logo"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* BOTTOM LEFT QUADRANT - Logo Placeholder */}
        <div className="flex items-center justify-center p-2">
          <div className="border-[12px] border-white shadow-2xl w-full h-full">
            <Image
              src="/vllondon-logo.jpeg"
              alt="VL London Logo"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* BOTTOM RIGHT QUADRANT - Divided into 3 rows */}
        <div className="grid grid-rows-3">
          {/* First Two Rows - Pricing Table */}
          <div className="row-span-2 flex items-start justify-start p-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden w-auto">
              <table className="w-full font-[family-name:var(--font-montserrat)] text-black">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-2 text-left text-xs font-semibold border-r border-gray-300 text-black">Size</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold border-r border-gray-300 text-black">Giá gốc</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold border-r border-gray-300 text-black">Điều kiện</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-black">Giảm còn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-300">
                    <td className="px-2 py-2 text-xs border-r border-gray-300 text-black">15ml</td>
                    <td className="px-2 py-2 text-xs border-r border-gray-300 text-black">£5</td>
                    <td className="px-2 py-2 text-xs border-r border-gray-300 text-black">Mua từ 12 chai trở lên có thể MIX & MATCH với Base/Top</td>
                    <td className="px-2 py-2 text-sm font-bold text-black">£4.5</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="px-2 py-2 text-xs border-r border-gray-300 text-black">Set 36 màu</td>
                    <td className="px-2 py-2 text-xs border-r border-gray-300 text-black">£27</td>
                    <td className="px-2 py-2 text-xs border-r border-gray-300 text-black">Mua cả set</td>
                    <td className="px-2 py-2 text-sm font-bold text-black">£216</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Third Row - Grid with 3 columns */}
          <div className="grid grid-cols-3">
            {/* First Two Columns - Title Badge */}
            <div className="col-span-2 flex items-center justify-center">
              <div className="bg-[#d10000] rounded-3xl shadow-xl px-4 py-3 flex items-center justify-center h-[100px] w-[90%]">
                <p
                  ref={textRef}
                  className="text-white font-bold font-[family-name:var(--font-balsamiq)] text-center leading-tight tracking-wider w-full">
                  {productName}
                </p>
              </div>
            </div>

            {/* Third Column - Discount Badge */}
            <div className="flex items-center justify-center">
              <Image
                src="/discount-badge-10.png"
                alt="10% discount"
                width={180}
                height={180}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orange Overlay Copy - Badge Only (Same Location) */}
      <div className="absolute bottom-0 right-0 z-30">
        <Image
          src="/discount-badge-10.png"
          alt="10% discount"
          width={160}
          height={160}
          className="object-contain"
        />
      </div>

      {/* Background Overlay - Full size on top */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <Image
          src="/background-overlay.svg"
          alt="Background overlay"
          fill
          className="w-full h-full object-cover rounded-lg"
          priority
        />
      </div>
    </div>
  );
}
