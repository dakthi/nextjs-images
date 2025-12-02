'use client';

import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 md:ml-64 transition-all duration-300">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
