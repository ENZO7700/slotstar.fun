'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '../ui/Icons';
import { AFFILIATE_URL } from '../ui/AffiliateComponents';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Domov', href: '/', icon: Icons.Home },
    { name: 'Hry', href: '/games', icon: Icons.Gamepad },
    { name: 'Poskytovatelia', href: '/providers', icon: Icons.Layers },
    { name: 'Nové hry', href: '/new-games', icon: Icons.Calendar },
    { name: 'Odporúčané', href: '/featured', icon: Icons.Star },
    { name: 'Pripravované', href: '/upcoming', icon: Icons.Compass },
    { name: 'Blog', href: '/blog', icon: Icons.BookOpen },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-(--sidebar-width) bg-zinc-900 border-r-[var(--border-brutal)] border-r-black sticky top-0 h-dvh shrink-0 overflow-hidden">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b-[var(--border-medium)] border-b-black shrink-0">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-black tracking-tight text-amber-500">
            SLOT<span className="text-zinc-50 font-medium">STAR</span>
          </span>
        </Link>
      </div>

      {/* Main Navigation — scrollable */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto min-h-0">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              <Icon className="mr-3 shrink-0" size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Compact Affiliate CTA */}
      <div className="mx-3 mb-3 shrink-0">
        <a
          href={AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-[#ff0033] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#cc0029] transition-colors"
        >
          🔥 Získaj bonus
        </a>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-zinc-800 text-xs text-zinc-500 space-y-1.5 shrink-0">
        <Link href="/responsible-gaming" className="block hover:text-zinc-300 transition-colors">
          Zodpovedné hranie
        </Link>
        <Link href="/privacy" className="block hover:text-zinc-300 transition-colors">
          Ochrana súkromia
        </Link>
        <Link href="/terms" className="block hover:text-zinc-300 transition-colors">
          Všeobecné podmienky
        </Link>
        <p className="pt-1 text-[10px] text-zinc-600">© 2026 SlotStars.fun</p>
      </div>
    </aside>
  );
}
