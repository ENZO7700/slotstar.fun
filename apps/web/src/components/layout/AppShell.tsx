import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import { Footer } from './Footer';
import { AffiliateBanner, AffiliateFloatingButton } from '../ui/AffiliateComponents';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {/* Top Banner — Everywhere user looks #1 */}
      <AffiliateBanner />

      {/* Grid Layout: Sidebar + Main Column */}
      <div className="app-shell-grid flex-1">
        {/* Sticky Left Sidebar for Desktop - Grid Column 1 */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Layout Area - Grid Column 2 */}
        <div className="min-h-screen flex flex-col min-w-0">
          {/* Sticky Top Header */}
          <Header />

          {/* Dense content viewport wrapper */}
          <main className="flex-1 w-full min-w-0 px-4 sm:px-6 md:px-8 py-6 lg:pb-8">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </div>

      {/* Bottom Sticky Tab bar for Mobile */}
      <MobileNavigation />

      {/* Persistent Floating Affiliate CTA — Everywhere user looks #2 */}
      <AffiliateFloatingButton />
    </div>
  );
}
