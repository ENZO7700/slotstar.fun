'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '../ui/Icons';

export function MobileNavigation() {
  const pathname = usePathname();

  const items = [
    { name: 'Domov', href: '/', icon: Icons.Home },
    { name: 'Hry', href: '/games', icon: Icons.Gamepad },
    { name: 'Poskytovatelia', href: '/providers', icon: Icons.Layers },
    { name: 'Nové', href: '/new-games', icon: Icons.Calendar },
    { name: 'Odporúčané', href: '/featured', icon: Icons.Star },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 right-0 left-0 h-17 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 flex items-center justify-around px-2 pb-safe z-50">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-12 min-h-12 px-2 py-1 transition-colors ${
              isActive ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Icon size={22} className="mb-1" />
            <span className="text-[11px] leading-none font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
