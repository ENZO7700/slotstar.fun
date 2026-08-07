'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icons } from '../ui/Icons';

export function Header() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/games?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 flex items-center justify-between px-6 z-20">
      {/* Brand logo visibility for mobile/tablet */}
      <div className="flex items-center lg:hidden">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-black tracking-tight text-amber-500">
            SLOT<span className="text-zinc-50 font-medium">STAR</span>
          </span>
        </Link>
      </div>

      {/* Global Search Box */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md mx-4 lg:mx-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
          <Icons.Search size={18} />
        </div>
        <input
          id="site-search"
          name="q"
          type="search"
          placeholder="Hľadať hry alebo poskytovateľov..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
        />

      </form>

      {/* Extra Action Area */}
      <div className="hidden sm:flex items-center space-x-4">
        <Link
          href="/responsible-gaming"
          className="inline-flex items-center text-xs text-zinc-400 hover:text-zinc-200"
        >
          <Icons.Shield size={14} className="mr-1 text-amber-500" />
          Zodpovedné hranie
        </Link>
      </div>
    </header>
  );
}
