'use client';

import MainLayout from './components/MainLayout';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0A1128] mb-2">
            Welcome to VL London
          </h1>
          <p className="text-lg text-[#0A1128]/70">
            Our complete nail product management hub
          </p>
        </div>

        {/* What This Is */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-[#0A1128] p-6">
          <h2 className="text-xl font-bold text-[#0A1128] mb-4">What is this?</h2>
          <p className="text-[#0A1128]/80 mb-4">
            This is our one-stop shop for managing everything about our nail products.
            Keep track of all our product details, photos, and pricing in one place.
          </p>
          <p className="text-[#0A1128]/80">
            Everything you change is saved with a history, so you can always go back if needed.
          </p>
        </div>

        {/* What You Can Do */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-[#0A1128] p-6">
          <h2 className="text-xl font-bold text-[#0A1128] mb-4">What you can do</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#0A1128]">Manage our products</h3>
              <p className="text-sm text-[#0A1128]/80 mb-2">
                View, create, and update our entire nail product collection.
              </p>
              <button
                onClick={() => router.push('/admin')}
                className="text-sm text-[#C5A572] hover:text-[#0A1128] font-semibold"
              >
                Go to Product Manager →
              </button>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">Create product cards</h3>
              <p className="text-sm text-[#0A1128]/80 mb-2">
                Make beautiful promotional cards for our products. Download them as images, bundles, or documents.
              </p>
              <button
                onClick={() => router.push('/product-cards')}
                className="text-sm text-[#C5A572] hover:text-[#0A1128] font-semibold"
              >
                Go to Product Cards →
              </button>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">Edit descriptions</h3>
              <p className="text-sm text-[#0A1128]/80 mb-2">
                Write and edit our product descriptions and marketing copy.
              </p>
              <button
                onClick={() => router.push('/editor')}
                className="text-sm text-[#C5A572] hover:text-[#0A1128] font-semibold"
              >
                Go to Content Editor →
              </button>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">Download everything</h3>
              <p className="text-sm text-[#0A1128]/80">
                Export complete product packages with all images and information whenever you need them.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-[#0A1128] p-6">
          <h2 className="text-xl font-bold text-[#0A1128] mb-4">How it works</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#0A1128]">1. Store our products</h3>
              <p className="text-sm text-[#0A1128]/80">
                All our product information is safely stored and organized. We keep track of every change we make.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">2. Upload photos</h3>
              <p className="text-sm text-[#0A1128]/80">
                Our product images are stored securely and load quickly whenever we need them.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">3. Export our way</h3>
              <p className="text-sm text-[#0A1128]/80">
                Get our product information in the format we need:
              </p>
              <ul className="list-disc list-inside text-sm text-[#0A1128]/80 ml-4 mt-2">
                <li>Individual images for social media</li>
                <li>Bundles for multiple products at once</li>
                <li>Print-ready documents</li>
                <li>Spreadsheets for planning</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">4. Organize by brand</h3>
              <p className="text-sm text-[#0A1128]/80">
                Our products are organized by brand (BlazingStar, BoldBerry, MBerry, Pastel, and more) for easy browsing.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="bg-[#0A1128] hover:bg-[#C5A572] text-white hover:text-[#0A1128] font-bold py-3 px-4 rounded-lg transition-colors border-2 border-[#0A1128]"
          >
            Product Manager
          </button>
          <button
            onClick={() => router.push('/product-cards')}
            className="bg-[#C5A572] hover:bg-[#0A1128] text-[#0A1128] hover:text-white font-bold py-3 px-4 rounded-lg transition-colors border-2 border-[#0A1128]"
          >
            Product Cards
          </button>
          <button
            onClick={() => router.push('/editor')}
            className="bg-white hover:bg-[#0A1128] text-[#0A1128] hover:text-white font-bold py-3 px-4 rounded-lg transition-colors border-2 border-[#0A1128]"
          >
            Content Editor
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
