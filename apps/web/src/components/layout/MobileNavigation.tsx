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
    <nav className="lg:hidden fixed bottom-0 right-0 left-0 h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around px-2 pb-safe z-20">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 h-12 text-[10px] font-medium transition-colors ${
              isActive ? 'text-amber-500 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon size={20} className="mb-0.5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
