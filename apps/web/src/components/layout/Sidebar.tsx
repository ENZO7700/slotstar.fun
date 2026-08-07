'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '../ui/Icons';

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
    <aside className="hidden lg:flex flex-col w-60 bg-zinc-900 border-r border-zinc-800 fixed top-0 bottom-0 left-0 z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800 shrink-0">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-black tracking-tight text-amber-500">
            SLOT<span className="text-zinc-50 font-medium">STAR</span>
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              <Icon className="mr-3 shrink-0" size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Area */}
      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 space-y-2">
        <Link href="/responsible-gaming" className="block hover:underline hover:text-zinc-300">
          Zodpovedné hranie
        </Link>
        <Link href="/privacy" className="block hover:underline hover:text-zinc-300">
          Ochrana súkromia
        </Link>
        <Link href="/terms" className="block hover:underline hover:text-zinc-300">
          Všeobecné podmienky
        </Link>
        <p className="pt-2 text-[10px] text-zinc-600">© 2026 SlotStars.fun</p>
      </div>
    </aside>
  );
}
