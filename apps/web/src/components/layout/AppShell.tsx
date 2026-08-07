import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import { Footer } from './Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Sticky Left Sidebar for Desktop */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex flex-col flex-1 lg:ml-[240px] min-w-0">
        {/* Sticky Top Header */}
        <Header />

        {/* Dense content viewport wrapper */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Bottom Sticky Tab bar for Mobile */}
      <MobileNavigation />
    </div>
  );
}
