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
    icon: '',
    description: 'Overview & Quick Actions',
  },
  {
    label: 'Products',
    href: '/admin',
    icon: '',
    description: 'Manage Products & Content',
  },
  {
    label: 'RSS Feed',
    href: '/rss',
    icon: '',
    description: 'Product Feed & Updates',
  },
  {
    label: 'Transcribe',
    href: '/transcribe',
    icon: '',
    description: 'Audio/Video Transcription',
  },
  {
    label: 'Nail Portfolio',
    href: '/nail-portfolio',
    icon: '💅',
    description: 'Upload Nail Art Designs',
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
        className="fixed bottom-6 right-6 z-50 md:hidden bg-[#C5A572] text-[#0A1128] p-3 rounded-full shadow-lg hover:bg-[#0A1128] hover:text-white transition-colors border-2 border-[#0A1128]"
      >
        {isOpen ? '×' : '≡'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0A1128] text-white w-64 shadow-xl transform transition-transform duration-300 z-40 border-r-4 border-[#C5A572] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b-2 border-[#C5A572]">
          <h1 className="text-2xl font-bold text-white">VL London</h1>
          <p className="text-sm text-[#C5A572] mt-1">Product Manager</p>
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex flex-col p-4 rounded-lg transition-all duration-200 border-2 ${
                isActive(item.href)
                  ? 'bg-[#C5A572] text-[#0A1128] border-[#C5A572] shadow-lg font-bold'
                  : 'text-white border-transparent hover:bg-[#C5A572]/20 hover:border-[#C5A572]'
              }`}
            >
              <div className="flex flex-col">
                <div className="font-semibold text-sm">{item.label}</div>
                <div className={`text-xs mt-0.5 ${isActive(item.href) ? 'text-[#0A1128]/70' : 'text-[#C5A572]'}`}>
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </nav>

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
