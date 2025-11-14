'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import fitty from 'fitty';
import DiscountBadge from './DiscountBadge';
import backgroundImg from '../assets/salecard/background.png';
import penguinSaleCornerImg from '../assets/salecard/penguin-sale-corner.png';
import backgroundOverlayImg from '../assets/salecard/background-overlay.svg';

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
  showOnlyPriceColumn?: boolean;
  showSizeAndConditionColumnsOnly?: boolean;
  imageLabels?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
  };
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  scents?: string[];
  tableTextSize?: 'xxs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl';
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
  showOnlyPriceColumn = false,
  showSizeAndConditionColumnsOnly = false,
  imageLabels,
  isChecked = false,
  onCheckChange,
  scents,
  tableTextSize = 'xs',
}: SaleCardProps) {
  const textRef = useRef<HTMLParagraphElement>(null);

  // Map size prop to Tailwind classes
  const getTableTextSizeClass = () => {
    const sizeMap: Record<string, string> = {
      xxs: 'text-xs leading-tight px-1 py-1',
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };
    return sizeMap[tableTextSize] || 'text-xs';
  };

  const getTableDiscountSizeClass = () => {
    const sizeMap: Record<string, string> = {
      xxs: 'text-xs leading-tight',
      xs: 'text-sm',
      sm: 'text-base',
      base: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl',
    };
    return sizeMap[tableTextSize] || 'text-sm';
  };

  // Map scents to semantic colors based on their nature
  const getScentColorClass = (scent: string): string => {
    const scentsLower = scent.toLowerCase();

    // Warm/Spicy scents (check first to avoid conflicts with other categories)
    if (scentsLower.includes('mango') || scentsLower.includes('tropical') ||
        scentsLower.includes('ginger') || scentsLower.includes('sweet') ||
        scentsLower.includes('cinnamon') || scentsLower.includes('vanilla') ||
        scentsLower.includes('caramel') || scentsLower.includes('nutmeg') ||
        scentsLower.includes('clove') || scentsLower.includes('cardamom') ||
        scentsLower.includes('cocoa') || scentsLower.includes('chocolate') ||
        scentsLower.includes('coffee') || scentsLower.includes('amber')) {
      return 'bg-red-100 border-red-300 text-red-800';
    }

    // White/Light scents (check early to avoid conflicts)
    if (scentsLower.includes('white') || scentsLower.includes('milky') ||
        scentsLower.includes('soft')) {
      return 'bg-gray-100 border-gray-300 text-gray-800';
    }

    // Teal/Cool Mint scents
    if (scentsLower.includes('mint') || scentsLower.includes('spearmint') ||
        scentsLower.includes('peppermint') || scentsLower.includes('cool') ||
        scentsLower.includes('fresh')) {
      return 'bg-teal-100 border-teal-300 text-teal-800';
    }

    // Green/Herbal scents
    if (scentsLower.includes('aloe') || scentsLower.includes('eucalyptus') ||
        scentsLower.includes('lemongrass') || scentsLower.includes('green') ||
        scentsLower.includes('tea tree') || scentsLower.includes('basil') ||
        scentsLower.includes('rosemary') || scentsLower.includes('thyme') ||
        scentsLower.includes('sage') || scentsLower.includes('juniper') ||
        scentsLower.includes('pine') || scentsLower.includes('fir') ||
        scentsLower.includes('cypress') || scentsLower.includes('cedarwood') ||
        scentsLower.includes('forest') || scentsLower.includes('nature') ||
        scentsLower.includes('grass') || scentsLower.includes('herb')) {
      return 'bg-green-100 border-green-300 text-green-800';
    }

    // Yellow/Citrus/Bright scents
    if (scentsLower.includes('lemon') || scentsLower.includes('citrus') ||
        scentsLower.includes('lime') || scentsLower.includes('grapefruit') ||
        scentsLower.includes('bergamot') || scentsLower.includes('yuzu') ||
        scentsLower.includes('passion') || scentsLower.includes('pineapple') ||
        scentsLower.includes('kiwi') || scentsLower.includes('coconut') ||
        scentsLower.includes('banana')) {
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    }

    // Orange/Warm Citrus scents
    if (scentsLower.includes('orange') || scentsLower.includes('tangerine') ||
        scentsLower.includes('mandarin') || scentsLower.includes('peach') ||
        scentsLower.includes('apricot') || scentsLower.includes('cantaloupe') ||
        scentsLower.includes('papaya') || scentsLower.includes('pecan')) {
      return 'bg-orange-100 border-orange-300 text-orange-800';
    }

    // Pink/Rose/Floral scents
    if (scentsLower.includes('rose') || scentsLower.includes('floral') ||
        scentsLower.includes('raspberry') || scentsLower.includes('pomegranate') ||
        scentsLower.includes('cherry') || scentsLower.includes('berry') ||
        scentsLower.includes('strawberry') || scentsLower.includes('cranberry') ||
        scentsLower.includes('peony') || scentsLower.includes('carnation') ||
        scentsLower.includes('hibiscus') || scentsLower.includes('gardenia') ||
        scentsLower.includes('magnolia') || scentsLower.includes('poppy') ||
        scentsLower.includes('sweet pea') || scentsLower.includes('lilac') ||
        scentsLower.includes('orchid') || scentsLower.includes('camellia')) {
      return 'bg-pink-100 border-pink-300 text-pink-800';
    }

    // Purple/Luxury/Floral scents
    if (scentsLower.includes('lavender') || scentsLower.includes('perfume') ||
        scentsLower.includes('luxury') || scentsLower.includes('mademoiselle') ||
        scentsLower.includes('romance') || scentsLower.includes('iris') ||
        scentsLower.includes('violet') || scentsLower.includes('wisteria') ||
        scentsLower.includes('hyacinth') || scentsLower.includes('lilium') ||
        scentsLower.includes('tuberose') || scentsLower.includes('heliotrope') ||
        scentsLower.includes('jasmine') || scentsLower.includes('ylang') ||
        scentsLower.includes('oud') || scentsLower.includes('musky')) {
      return 'bg-purple-100 border-purple-300 text-purple-800';
    }

    // Blue/Creamy/Gentle scents
    if (scentsLower.includes('honey') || scentsLower.includes('pearl') ||
        scentsLower.includes('milk') || scentsLower.includes('crystal') ||
        scentsLower.includes('waters') || scentsLower.includes('cream') ||
        scentsLower.includes('vanilla') || scentsLower.includes('butter') ||
        scentsLower.includes('oat') || scentsLower.includes('almond') ||
        scentsLower.includes('cotton') || scentsLower.includes('cloud') ||
        scentsLower.includes('aqua') || scentsLower.includes('ocean') ||
        scentsLower.includes('marine') || scentsLower.includes('sea') ||
        scentsLower.includes('breeze') || scentsLower.includes('wind') ||
        scentsLower.includes('rain') || scentsLower.includes('dew')) {
      return 'bg-blue-100 border-blue-300 text-blue-800';
    }

    // Brown/Woody scents
    if (scentsLower.includes('sandalwood') || scentsLower.includes('patchouli') ||
        scentsLower.includes('vetiver') || scentsLower.includes('oak') ||
        scentsLower.includes('mahogany') || scentsLower.includes('teak') ||
        scentsLower.includes('tobacco') || scentsLower.includes('leather') ||
        scentsLower.includes('musk') || scentsLower.includes('incense') ||
        scentsLower.includes('wood')) {
      return 'bg-amber-100 border-amber-300 text-amber-800';
    }

    // Default fallback
    return 'bg-indigo-100 border-indigo-300 text-indigo-800';
  };

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
        src={backgroundImg.src}
        alt="Winter background"
        className="w-full h-auto rounded-lg"
        style={{ display: 'block' }}
      />

      {/* Penguin Sale Corner - Top Left */}
      <div className="absolute -top-4 -left-4 w-48 h-48 z-20">
        <img
          src={penguinSaleCornerImg.src}
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
                crossOrigin="anonymous"
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
                crossOrigin="anonymous"
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
                crossOrigin="anonymous"
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
                  {!showOnlyLastTwoColumns && !showSizeAndConditionColumnsOnly && (
                    <th className={`px-2 py-2 text-left font-semibold border-r border-gray-300 text-black ${getTableTextSizeClass()}`}>Size</th>
                  )}
                  {showSizeAndConditionColumnsOnly && (
                    <th className={`px-2 py-2 text-left font-semibold border-r border-gray-300 text-black ${getTableTextSizeClass()}`}>Size</th>
                  )}
                  {!showSizeAndConditionColumnsOnly && (
                    <th className={`px-2 py-2 text-left font-semibold border-r border-gray-300 text-black ${getTableTextSizeClass()}`}>{showOnlyPriceColumn ? 'Giá ưu đãi' : 'Giá gốc'}</th>
                  )}
                  {!showOnlyLastTwoColumns && !showOnlyPriceColumn && !showSizeAndConditionColumnsOnly && (
                    <th className={`px-2 py-2 text-left font-semibold border-r border-gray-300 text-black ${getTableTextSizeClass()}`}>Điều kiện</th>
                  )}
                  {showSizeAndConditionColumnsOnly && (
                    <th className={`px-2 py-2 text-left font-semibold text-black ${getTableTextSizeClass()}`}>Điều kiện</th>
                  )}
                  {!showOnlyPriceColumn && !showSizeAndConditionColumnsOnly && (
                    <th className={`px-2 py-2 text-left font-semibold text-black ${getTableTextSizeClass()}`}>Giảm còn</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {pricingTable.map((row, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    {(!showOnlyLastTwoColumns || showSizeAndConditionColumnsOnly) && (
                      <td className={`px-2 py-2 border-r border-gray-300 text-black ${getTableTextSizeClass()}`}>{row.size}</td>
                    )}
                    {!showSizeAndConditionColumnsOnly && (
                      <td className={`px-2 py-2 border-r border-gray-300 text-black ${getTableTextSizeClass()}`}>{row.price}</td>
                    )}
                    {((!showOnlyLastTwoColumns && !showOnlyPriceColumn) || showSizeAndConditionColumnsOnly) && (
                      <td className={`px-2 py-2${showSizeAndConditionColumnsOnly ? '' : ' border-r border-gray-300'} text-black ${getTableTextSizeClass()}`}>{row.condition}</td>
                    )}
                    {!showOnlyPriceColumn && !showSizeAndConditionColumnsOnly && (
                      <td className={`px-2 py-2 font-bold text-black ${getTableDiscountSizeClass()}`}>{row.discount}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scents Box - Only visible when scents are provided */}
          {scents && scents.length > 0 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl px-3 py-2 text-black w-auto">
              <div className="flex flex-wrap gap-2">
                {scents.map((scent, index) => {
                  const colorClass = getScentColorClass(scent);
                  return (
                    <span
                      key={index}
                      className={`text-xs border rounded-full px-2 py-1 font-[family-name:var(--font-montserrat)] ${colorClass}`}
                    >
                      {scent}
                    </span>
                  );
                })}
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

      {/* Discount Badge - Red Starburst */}
      <DiscountBadge
        discountPercentage={10}
        position={badgePosition}
        size="medium"
        scale={0.75}
      />

      {/* Background Overlay - Full size on top */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <Image
          src={backgroundOverlayImg}
          alt="Background overlay"
          fill
          className="w-full h-full object-cover rounded-lg"
          priority
        />
      </div>
    </div>
  );
}
