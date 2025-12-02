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
            VL London Product Information System
          </h1>
          <p className="text-lg text-[#0A1128]/70">
            Centralised product information management and export platform
          </p>
        </div>

        {/* What This Is */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-[#0A1128] p-6">
          <h2 className="text-xl font-bold text-[#0A1128] mb-4">Overview</h2>
          <p className="text-[#0A1128]/80 mb-4">
            This platform serves as the central repository for all VL London product information.
            It stores product details, images, pricing, and specifications in a structured database,
            allowing the marketing team to access and export product information in various formats.
          </p>
          <p className="text-[#0A1128]/80">
            All product data is version-controlled, meaning changes are tracked and can be reviewed or reverted if needed.
          </p>
        </div>

        {/* What You Can Do */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-[#0A1128] p-6">
          <h2 className="text-xl font-bold text-[#0A1128] mb-4">Available Functions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#0A1128]">Product Management</h3>
              <p className="text-sm text-[#0A1128]/80 mb-2">
                View, create, update, and organise product information across all brands.
              </p>
              <button
                onClick={() => router.push('/admin')}
                className="text-sm text-[#C5A572] hover:text-[#0A1128] font-semibold"
              >
                Go to Product Manager →
              </button>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">Product Cards</h3>
              <p className="text-sm text-[#0A1128]/80 mb-2">
                Generate and export promotional product cards for marketing campaigns.
                Export as individual PNG files, ZIP archives, PDF documents, or CSV data files.
              </p>
              <button
                onClick={() => router.push('/product-cards')}
                className="text-sm text-[#C5A572] hover:text-[#0A1128] font-semibold"
              >
                Go to Product Cards →
              </button>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">Content Editing</h3>
              <p className="text-sm text-[#0A1128]/80 mb-2">
                Edit product descriptions, metadata, and marketing copy directly in the system.
              </p>
              <button
                onClick={() => router.push('/editor')}
                className="text-sm text-[#C5A572] hover:text-[#0A1128] font-semibold"
              >
                Go to Content Editor →
              </button>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">Information Packs</h3>
              <p className="text-sm text-[#0A1128]/80">
                Export comprehensive product information packages including images, specifications,
                pricing details, and version history. Available in ZIP format from the Product Manager.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-[#0A1128] p-6">
          <h2 className="text-xl font-bold text-[#0A1128] mb-4">How It Works</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#0A1128]">1. Database Storage</h3>
              <p className="text-sm text-[#0A1128]/80">
                Product information is stored in a PostgreSQL database. Each product has multiple versions,
                allowing you to track changes over time and maintain a complete history.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">2. Image Management</h3>
              <p className="text-sm text-[#0A1128]/80">
                Product images are stored on Cloudflare R2 (cloud storage) and referenced in the database.
                This ensures fast loading times and reliable image delivery.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">3. Export Options</h3>
              <p className="text-sm text-[#0A1128]/80">
                Data can be exported in multiple formats depending on your needs:
              </p>
              <ul className="list-disc list-inside text-sm text-[#0A1128]/80 ml-4 mt-2">
                <li>PNG: Individual product card images</li>
                <li>ZIP: Batch downloads of multiple products</li>
                <li>PDF: Print-ready documents</li>
                <li>CSV: Spreadsheet data for analysis</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#0A1128]">4. Brand Organisation</h3>
              <p className="text-sm text-[#0A1128]/80">
                Products are organised by brand (BlazingStar, BoldBerry, MBerry, Pastel, etc.).
                Each brand has its own properties and can be managed independently.
              </p>
            </div>
          </div>
        </div>

        {/* Data Structure */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-[#0A1128] p-6">
          <h2 className="text-xl font-bold text-[#0A1128] mb-4">Data Structure</h2>

          <p className="text-sm text-[#0A1128]/80 mb-4">
            Each product contains the following information:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-[#0A1128]">Basic Information</h4>
              <ul className="list-disc list-inside text-[#0A1128]/80 ml-2 mt-1">
                <li>Product Code</li>
                <li>Product Name</li>
                <li>Brand Association</li>
                <li>Active Status</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A1128]">Content</h4>
              <ul className="list-disc list-inside text-[#0A1128]/80 ml-2 mt-1">
                <li>Descriptions (multiple types)</li>
                <li>Marketing Copy</li>
                <li>Language Variants</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A1128]">Images</h4>
              <ul className="list-disc list-inside text-[#0A1128]/80 ml-2 mt-1">
                <li>Product Photos</li>
                <li>Promotional Images</li>
                <li>Display Order</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A1128]">Pricing</h4>
              <ul className="list-disc list-inside text-[#0A1128]/80 ml-2 mt-1">
                <li>Size Options</li>
                <li>Base Prices</li>
                <li>Discount Prices</li>
                <li>Purchase Conditions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A1128]">Properties</h4>
              <ul className="list-disc list-inside text-[#0A1128]/80 ml-2 mt-1">
                <li>Custom Attributes</li>
                <li>Technical Specifications</li>
                <li>Metadata</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A1128]">Version Control</h4>
              <ul className="list-disc list-inside text-[#0A1128]/80 ml-2 mt-1">
                <li>Version History</li>
                <li>Change Tracking</li>
                <li>Rollback Capability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Notes */}
        <div className="bg-[#0A1128] rounded-lg shadow-lg border-2 border-[#C5A572] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Technical Information</h2>

          <div className="space-y-3 text-sm text-white">
            <div>
              <span className="font-semibold text-[#C5A572]">Database:</span> PostgreSQL (hosted on Supabase)
            </div>
            <div>
              <span className="font-semibold text-[#C5A572]">Image Storage:</span> Cloudflare R2 CDN
            </div>
            <div>
              <span className="font-semibold text-[#C5A572]">Framework:</span> Next.js 15
            </div>
            <div>
              <span className="font-semibold text-[#C5A572]">ORM:</span> Prisma
            </div>
            <div>
              <span className="font-semibold text-[#C5A572]">Authentication:</span> Database-level access control
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
