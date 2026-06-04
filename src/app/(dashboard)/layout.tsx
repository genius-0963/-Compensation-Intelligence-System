import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import TopNav from '@/components/layout/top-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] selection:bg-blue-100 selection:text-blue-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto px-8 py-10 animate-fade-up">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
