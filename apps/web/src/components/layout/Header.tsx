'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icons } from '../ui/Icons';
import { AFFILIATE_URL } from '../ui/AffiliateComponents';

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
    <header className="w-full bg-[#111111] text-white border-b-[var(--border-brutal)] border-b-black z-40 sticky top-0 font-sans">
      <div className="max-w-360 mx-auto flex items-center justify-between px-3 md:px-4 h-14 md:h-15">
        
        {/* Logo — hidden on desktop where sidebar shows it */}
        <div className="flex items-center shrink-0 lg:hidden">
          <Link href="/" className="flex items-center space-x-1.5 italic tracking-tighter group whitespace-nowrap">
            <span className="text-xl md:text-2xl font-black text-white group-hover:text-[#00c52a] transition-colors">
              SLOT<span className="text-[#00c52a]">STAR</span>
            </span>
            <Icons.Star className="w-4 h-4 md:w-5 md:h-5 text-white -rotate-12 group-hover:text-[#00c52a] group-hover:rotate-12 transition-transform duration-300 shrink-0" />
          </Link>
        </div>

        {/* Search + Actions */}
        <div className="flex items-center gap-1.5 md:gap-2 ml-auto">
          
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative mr-2">
            <input
              id="header-search"
              name="q"
              type="search"
              autoComplete="off"
              aria-label="Vyhľadávanie hier"
              placeholder="Hľadať hry..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-40 lg:w-48 h-9 pl-9 pr-3 bg-[#2a2b30] rounded-sm text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00c52a] transition-all"
            />
            <Icons.Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          </form>

          {/* Primary Action */}
          <a 
            href={AFFILIATE_URL} 
            aria-label="Získaj bonus"
            className="flex items-center justify-center h-10 md:h-9 px-4 md:px-5 bg-[#4caf50] hover:bg-[#439c47] text-white text-xs md:text-[13px] font-bold rounded-sm transition-colors whitespace-nowrap"
          >
            ZÍSKAJ BONUS
          </a>

          {/* Responsible Gaming (Icon only on mobile) */}
          <Link 
            href="/responsible-gaming" 
            aria-label="Zodpovedné hranie"
            className="flex items-center justify-center h-10 md:h-9 min-w-10 md:min-w-0 px-2.5 md:px-4 bg-[#2a2b30] hover:bg-[#36373d] text-white text-[13px] font-medium rounded-sm transition-colors"
            title="Zodpovedné hranie"
          >
            <Icons.Shield size={16} className="md:mr-2 text-[#00c52a]" />
            <span className="hidden md:inline">ZODPOVEDNE</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
