'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: '▪',
    description: 'Overview & Quick Actions',
  },
  {
    label: 'Products',
    href: '/admin',
    icon: '▪',
    description: 'Manage Products & Content',
  },
  {
    label: 'Image Editor',
    href: '/editor',
    icon: '▪',
    description: 'Create Product Images',
  },
  {
    label: 'Catalog',
    href: '/catalog',
    icon: '▪',
    description: 'Browse Products',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        {isOpen ? '×' : '≡'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 shadow-xl transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">VL London</h1>
          <p className="text-sm text-gray-400 mt-1">Product Manager</p>
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex flex-col p-4 rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-blue-600 shadow-lg'
                  : 'hover:bg-gray-700 text-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-gray-300 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-6 left-6 right-6 text-xs text-gray-400 border-t border-gray-700 pt-6">
          <p className="mb-2">Quick Links:</p>
          <div className="space-y-1">
            <p>• Clone products for variants</p>
            <p>• Export brands as ZIP</p>
            <p>• Search & filter products</p>
            <p>• Batch image management</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
