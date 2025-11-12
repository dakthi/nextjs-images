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
  cardNumber?: number;
  productId?: string;
  badgePosition?: 'middle-right' | 'bottom-right';
  showProductId?: boolean;
  showOnlyLastTwoColumns?: boolean;
  imageLabels?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
  };
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  scents?: string[];
}

export default function SaleCard({
  productImages,
  resultImage,
  promotionText,
  productName,
  discountPercentage,
  pricingTable,
  cardNumber,
  productId,
  badgePosition = 'middle-right',
  showProductId = false,
  showOnlyLastTwoColumns = false,
  imageLabels,
  isChecked = false,
  onCheckChange,
  scents,
}: SaleCardProps) {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const fit = fitty(textRef.current, {
        minSize: 16,
        maxSize: 96,
      });
      return () => {
        if (fit && fit.unsubscribe) {
          fit.unsubscribe();
        }
      };
    }
  }, [productName]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Product ID Display - Outside Card (Not rendered in image) */}
      {showProductId && productId && (
        <div className="text-gray-600 text-xs mt-2 pl-2">
          Product ID: {productId}
        </div>
      )}

      {/* Background Image */}
      <img
        src="/background.png"
        alt="Winter background"
        className="w-full h-auto rounded-lg"
        style={{ display: 'block' }}
      />

      {/* Checkbox - Top Left */}
      <div className="absolute top-3 left-3 z-30">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheckChange?.(e.target.checked)}
          className="w-6 h-6 cursor-pointer accent-blue-600"
        />
      </div>

      {/* Penguin Sale Corner - Top Left */}
      <div className="absolute -top-4 -left-4 w-48 h-48 z-20">
        <img
          src="/penguin-sale-corner.png"
          alt="Sale Corner"
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>

      {/* Promotion Banner - Top Right */}
      <div className="absolute top-3 right-2 bg-blue-800 text-white px-6 py-3 rounded-xl shadow-xl z-20">
        <p className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-center">
          {promotionText}
        </p>
      </div>

      {/* 4 Quadrant Grid Overlay */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-2 gap-1">
        {/* TOP LEFT QUADRANT */}
        {productImages[0] && (
          <div className="flex items-center justify-center p-1 relative">
            <div className="border-[12px] border-white shadow-2xl w-full h-full relative">
              <img
                src={productImages[0]}
                alt="Product Image 1"
                className="w-full h-full object-cover"
                style={{ display: 'block' }}
              />
              {imageLabels?.topLeft && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                  <p className="font-[family-name:var(--font-montserrat)] text-white text-xs">
                    {imageLabels.topLeft}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOP RIGHT QUADRANT */}
        {productImages[1] && (
          <div className="flex items-center justify-center p-1">
            <div className="border-[12px] border-white shadow-2xl w-full h-full relative">
              <img
                src={productImages[1]}
                alt="Product Image 2"
                className="w-full h-full object-cover"
                style={{ display: 'block' }}
              />
              {imageLabels?.topRight && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                  <p className="font-[family-name:var(--font-montserrat)] text-white text-xs">
                    {imageLabels.topRight}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM LEFT QUADRANT */}
        {productImages[2] && (
          <div className="flex items-center justify-center p-1">
            <div className="border-[12px] border-white shadow-2xl w-full h-full relative">
              <img
                src={productImages[2]}
                alt="Product Image 3"
                className="w-full h-full object-cover"
                style={{ display: 'block' }}
              />
              {imageLabels?.bottomLeft && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                  <p className="font-[family-name:var(--font-montserrat)] text-white text-xs">
                    {imageLabels.bottomLeft}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM RIGHT QUADRANT - Pricing Table & Scents */}
        <div className="flex flex-col items-start justify-start p-1 gap-1">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden w-auto">
            <table className="w-full font-[family-name:var(--font-montserrat)] text-black">
              <thead>
                <tr className="bg-gray-100">
                  {!showOnlyLastTwoColumns && (
                    <th className={`px-2 py-2 text-left font-semibold border-r border-gray-300 text-black ${pricingTable.length < 3 ? 'text-base' : 'text-xs'}`}>Size</th>
                  )}
                  {!showOnlyLastTwoColumns && (
                    <th className={`px-2 py-2 text-left font-semibold border-r border-gray-300 text-black ${pricingTable.length < 3 ? 'text-base' : 'text-xs'}`}>Giá gốc</th>
                  )}
                  <th className={`px-2 py-2 text-left font-semibold border-r border-gray-300 text-black ${pricingTable.length < 3 ? 'text-base' : 'text-xs'}`}>Điều kiện</th>
                  <th className={`px-2 py-2 text-left font-semibold text-black ${pricingTable.length < 3 ? 'text-base' : 'text-xs'}`}>Giảm còn</th>
                </tr>
              </thead>
              <tbody>
                {pricingTable.map((row, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    {!showOnlyLastTwoColumns && (
                      <td className={`px-2 py-2 border-r border-gray-300 text-black ${pricingTable.length < 3 ? 'text-base' : 'text-xs'}`}>{row.size}</td>
                    )}
                    {!showOnlyLastTwoColumns && (
                      <td className={`px-2 py-2 border-r border-gray-300 text-black ${pricingTable.length < 3 ? 'text-base' : 'text-xs'}`}>{row.price}</td>
                    )}
                    <td className={`px-2 py-2 border-r border-gray-300 text-black ${pricingTable.length < 3 ? 'text-base' : 'text-xs'}`}>{row.condition}</td>
                    <td className={`px-2 py-2 font-bold text-black ${pricingTable.length < 3 ? 'text-lg' : 'text-sm'}`}>{row.discount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scents Box - Only visible when scents are provided */}
          {scents && scents.length > 0 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl px-3 py-2 text-black w-auto">
              <div className="flex flex-wrap gap-2">
                {scents.map((scent, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 border border-gray-300 rounded-full px-2 py-1 font-[family-name:var(--font-montserrat)]"
                  >
                    {scent}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title Badge - Middle Right */}
      <div className="absolute top-[48%] right-4 -translate-y-1/2 z-50">
        <div className="bg-[#d10000] rounded-3xl shadow-xl px-6 py-4 flex items-center justify-center min-w-[300px]">
          <p
            ref={textRef}
            className="text-white font-bold font-[family-name:var(--font-montserrat)] text-center leading-tight tracking-wider w-full">
            {productName}
          </p>
        </div>
      </div>

      {/* Discount Badge */}
      <div className={`absolute z-50 ${
        badgePosition === 'bottom-right'
          ? 'bottom-4 right-4'
          : 'top-[36%] right-2 -translate-y-1/2'
      }`}>
        <Image
          src="/discount-badge-10.png"
          alt="10% discount"
          width={140}
          height={140}
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
