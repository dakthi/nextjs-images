'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '../components/MainLayout';

interface DashboardStats {
  totalProducts: number;
  totalBrands: number;
  activeProducts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/crud');
        const products = await response.json();

        const brandsResponse = await fetch('/api/brands/crud');
        const brands = await brandsResponse.json();

        setStats({
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalBrands: Array.isArray(brands) ? brands.length : 0,
          activeProducts: Array.isArray(products)
            ? products.filter((p: any) => p.isActive).length
            : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Welcome to VL London</h1>
          <p className="text-base md:text-lg text-black/70">
            Manage your nail product catalog and content
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-md border-2 border-[#C5A572]/30 p-4 md:p-6 text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#C5A572] mb-2">
              {loading ? '...' : stats?.totalProducts || 0}
            </div>
            <p className="text-black font-semibold text-sm md:text-base">Products in catalog</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border-2 border-[#0A1128]/30 p-4 md:p-6 text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#0A1128] mb-2">
              {loading ? '...' : stats?.activeProducts || 0}
            </div>
            <p className="text-black font-semibold text-sm md:text-base">Available to view</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border-2 border-[#C5A572]/30 p-4 md:p-6 text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#C5A572] mb-2">
              {loading ? '...' : stats?.totalBrands || 0}
            </div>
            <p className="text-black font-semibold text-sm md:text-base">Brands</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#0A1128]/20 p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">What would you like to do?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Link
              href="/admin"
              className="flex flex-col items-center p-4 md:p-6 rounded-lg border-2 border-[#0A1128]/20 hover:border-[#C5A572] hover:bg-[#C5A572]/10 transition-all"
            >
              <div className="text-3xl md:text-4xl mb-2">📦</div>
              <h3 className="font-bold text-black mb-1 text-base md:text-lg text-center">Manage products</h3>
              <p className="text-xs md:text-sm text-black/60 text-center">
                Edit product details and images
              </p>
            </Link>

            <Link
              href="/rss"
              className="flex flex-col items-center p-4 md:p-6 rounded-lg border-2 border-[#0A1128]/20 hover:border-[#C5A572] hover:bg-[#C5A572]/10 transition-all"
            >
              <div className="text-3xl md:text-4xl mb-2">📰</div>
              <h3 className="font-bold text-black mb-1 text-base md:text-lg text-center">News feeds</h3>
              <p className="text-xs md:text-sm text-black/60 text-center">
                Stay updated with industry news
              </p>
            </Link>

            <Link
              href="/transcribe"
              className="flex flex-col items-center p-4 md:p-6 rounded-lg border-2 border-[#0A1128]/20 hover:border-[#C5A572] hover:bg-[#C5A572]/10 transition-all"
            >
              <div className="text-3xl md:text-4xl mb-2">🎤</div>
              <h3 className="font-bold text-black mb-1 text-base md:text-lg text-center">Transcribe</h3>
              <p className="text-xs md:text-sm text-black/60 text-center">
                Convert audio and video to text
              </p>
            </Link>

            <Link
              href="/nail-portfolio"
              className="flex flex-col items-center p-4 md:p-6 rounded-lg border-2 border-[#0A1128]/20 hover:border-[#C5A572] hover:bg-[#C5A572]/10 transition-all"
            >
              <div className="text-3xl md:text-4xl mb-2">💅</div>
              <h3 className="font-bold text-black mb-1 text-base md:text-lg text-center">Nail portfolio</h3>
              <p className="text-xs md:text-sm text-black/60 text-center">
                View uploaded nail art designs
              </p>
            </Link>
          </div>
        </div>

        {/* What you can do */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#0A1128]/20 p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">What you can do here</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-[#F9FAFA] rounded-lg border border-[#0A1128]/10">
              <div className="text-2xl">✏️</div>
              <div>
                <h3 className="font-bold text-black text-sm md:text-base">Edit products</h3>
                <p className="text-xs md:text-sm text-black/60">
                  Update product information, prices, and photos
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-[#F9FAFA] rounded-lg border border-[#0A1128]/10">
              <div className="text-2xl">🔍</div>
              <div>
                <h3 className="font-bold text-black text-sm md:text-base">Find products</h3>
                <p className="text-xs md:text-sm text-black/60">
                  Search by name or browse by brand
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-[#F9FAFA] rounded-lg border border-[#0A1128]/10">
              <div className="text-2xl">📋</div>
              <div>
                <h3 className="font-bold text-black text-sm md:text-base">Copy products</h3>
                <p className="text-xs md:text-sm text-black/60">
                  Make copies to create similar items quickly
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-[#F9FAFA] rounded-lg border border-[#0A1128]/10">
              <div className="text-2xl">📤</div>
              <div>
                <h3 className="font-bold text-black text-sm md:text-base">Export data</h3>
                <p className="text-xs md:text-sm text-black/60">
                  Download product lists and images
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-[#F9FAFA] rounded-lg border border-[#0A1128]/10">
              <div className="text-2xl">📸</div>
              <div>
                <h3 className="font-bold text-black text-sm md:text-base">Manage photos</h3>
                <p className="text-xs md:text-sm text-black/60">
                  Upload and organize multiple product images
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-[#F9FAFA] rounded-lg border border-[#0A1128]/10">
              <div className="text-2xl">📝</div>
              <div>
                <h3 className="font-bold text-black text-sm md:text-base">Track changes</h3>
                <p className="text-xs md:text-sm text-black/60">
                  See history of all updates made
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-[#C5A572] to-[#0A1128] rounded-lg shadow-md p-4 md:p-8 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Getting started</h2>
          <ol className="space-y-2 md:space-y-3 ml-4 md:ml-6 text-sm md:text-base">
            <li className="list-decimal">
              Click <strong>Manage products</strong> to view your catalog
            </li>
            <li className="list-decimal">
              Use the search bar to find specific items
            </li>
            <li className="list-decimal">
              Click on any product to edit details
            </li>
            <li className="list-decimal">
              Upload photos in the images section
            </li>
            <li className="list-decimal">
              Use <strong>Copy product</strong> to create variations
            </li>
          </ol>
        </div>
      </div>
    </MainLayout>
  );
}
