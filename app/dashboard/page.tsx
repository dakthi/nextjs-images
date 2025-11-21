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
        // In a real app, this would be an API endpoint
        // For now, we'll fetch basic product data
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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to VL London Product Management System
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md border-2 border-blue-200 p-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {loading ? '...' : stats?.totalProducts || 0}
            </div>
            <p className="text-gray-600 font-semibold">Total Products</p>
            <p className="text-sm text-gray-500 mt-2">
              All products in your catalog
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md border-2 border-green-200 p-6">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {loading ? '...' : stats?.activeProducts || 0}
            </div>
            <p className="text-gray-600 font-semibold">Active Products</p>
            <p className="text-sm text-gray-500 mt-2">
              Currently published products
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md border-2 border-purple-200 p-6">
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {loading ? '...' : stats?.totalBrands || 0}
            </div>
            <p className="text-gray-600 font-semibold">Brands</p>
            <p className="text-sm text-gray-500 mt-2">
              Brand collections
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin"
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <h3 className="font-bold text-black mb-1 text-xl">Manage Products</h3>
              <p className="text-sm text-gray-600 text-center">
                Edit product details, images, and pricing
              </p>
            </Link>

            <Link
              href="/editor"
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <h3 className="font-bold text-black mb-1 text-xl">Create Images</h3>
              <p className="text-sm text-gray-600 text-center">
                Design and generate product images
              </p>
            </Link>

            <Link
              href="/catalog"
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <h3 className="font-bold text-black mb-1 text-xl">View Catalog</h3>
              <p className="text-sm text-gray-600 text-center">
                Browse all products and collections
              </p>
            </Link>

            <div className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-300 bg-gray-50">
              <h3 className="font-bold text-black mb-1 text-xl">Settings</h3>
              <p className="text-sm text-gray-600 text-center">
                Coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-bold text-black">Export Products</h3>
                <p className="text-sm text-gray-600">
                  Export individual products, entire brands, or search results as JSON, CSV, or ZIP with images
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-bold text-black">Smart Search</h3>
                <p className="text-sm text-gray-600">
                  Search products by name or code with pagination support
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-bold text-black">Clone Products</h3>
                <p className="text-sm text-gray-600">
                  Duplicate products with all content for quick variations
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-bold text-black">Batch Image Manage</h3>
                <p className="text-sm text-gray-600">
                  Upload, reorder, and manage multiple images per product
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-bold text-black">Validation</h3>
                <p className="text-sm text-gray-600">
                  Type-safe input validation with Zod schemas
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-bold text-black">Audit Logs</h3>
                <p className="text-sm text-gray-600">
                  Track all changes with comprehensive audit logging
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <ol className="space-y-3 ml-6">
            <li className="list-decimal">
              Go to <strong>Products</strong> to manage your product catalog
            </li>
            <li className="list-decimal">
              Use <strong>Image Editor</strong> to create product visuals
            </li>
            <li className="list-decimal">
              <strong>Search and filter</strong> products by brand or name
            </li>
            <li className="list-decimal">
              <strong>Export</strong> products for sharing or backup
            </li>
            <li className="list-decimal">
              <strong>Clone products</strong> to quickly create variations
            </li>
          </ol>
        </div>
      </div>
    </MainLayout>
  );
}
