'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TaxonomyTerm } from '@/types/taxonomy';
import { Provider } from '@/types/provider';

interface GameFiltersProps {
  providers: Provider[];
  themes: TaxonomyTerm[];
  types: TaxonomyTerm[];
}

export function GameFilters({ providers, themes, types }: GameFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for filters to apply on confirmation (especially for mobile drawer look)
  const [selectedProvider, setSelectedProvider] = useState(searchParams.get('provider') || '');
  const [selectedTheme, setSelectedTheme] = useState(searchParams.get('theme') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedOrderBy, setSelectedOrderBy] = useState(searchParams.get('orderBy') || 'date');
  const [selectedOrder, setSelectedOrder] = useState(searchParams.get('order') || 'desc');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set page to 1 on filter changes
    params.set('page', '1');

    if (selectedProvider) params.set('provider', selectedProvider);
    else params.delete('provider');

    if (selectedTheme) params.set('theme', selectedTheme);
    else params.delete('theme');

    if (selectedType) params.set('type', selectedType);
    else params.delete('type');

    if (selectedOrderBy) params.set('orderBy', selectedOrderBy);
    else params.delete('orderBy');

    if (selectedOrder) params.set('order', selectedOrder);
    else params.delete('order');

    router.push(`/games?${params.toString()}`);
    setIsMobileOpen(false);
  };

  const resetFilters = () => {
    setSelectedProvider('');
    setSelectedTheme('');
    setSelectedType('');
    setSelectedOrderBy('date');
    setSelectedOrder('desc');

    const params = new URLSearchParams();
    // Keep search query if present
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    
    router.push(`/games?${params.toString()}`);
    setIsMobileOpen(false);
  };

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
      {/* Quick Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-zinc-800 scrollbar-none" data-testid="category-pills-container">
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', '1');
            params.delete('orderBy');
            router.push(`/games?${params.toString()}`);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
            !searchParams.get('orderBy')
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Všetky hry
        </button>
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', '1');
            params.set('orderBy', 'trending');
            params.set('order', 'desc');
            router.push(`/games?${params.toString()}`);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            searchParams.get('orderBy') === 'trending'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
              : 'bg-zinc-950 text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-zinc-950'
          }`}
        >
          <span>🚀</span>
          <span>Trending</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', '1');
            params.set('orderBy', 'most_played');
            params.set('order', 'desc');
            router.push(`/games?${params.toString()}`);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            searchParams.get('orderBy') === 'most_played'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
          }`}
        >
          <span>🔥</span>
          <span>Najhrajúcejšie</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', '1');
            params.set('orderBy', 'gold');
            params.set('order', 'desc');
            router.push(`/games?${params.toString()}`);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            searchParams.get('orderBy') === 'gold'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
          }`}
        >
          <span>🏆</span>
          <span>Gold Tier</span>
        </button>
      </div>

      {/* Desktop Filter Panel Grid */}
      <div className="hidden md:grid grid-cols-5 gap-4">
        {/* Provider Select */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Poskytovateľ</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
          >
            <option value="">Všetci</option>
            {providers.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.name} ({p.count})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Select */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Téma</label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
          >
            <option value="">Všetky</option>
            {themes.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Select */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Typ hry</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
          >
            <option value="">Všetky</option>
            {types.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Zoradiť podľa</label>
          <select
            value={`${selectedOrderBy}-${selectedOrder}`}
            onChange={(e) => {
              const [orderBy, order] = e.target.value.split('-');
              setSelectedOrderBy(orderBy);
              setSelectedOrder(order);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
          >
            <option value="trending-desc">🚀 Trending (Najpopulárnejšie)</option>
            <option value="most_played-desc">🔥 Najhrajúcejšie</option>
            <option value="highest_rated-desc">⭐ Najlepšie hodnotené</option>
            <option value="gold-desc">🏆 Gold Tier (VIP)</option>
            <option value="silver-desc">🥈 Silver Tier</option>
            <option value="bronze-desc">🥉 Bronze Tier</option>
            <option value="date-desc">Najnovšie pridané</option>
            <option value="name-asc">Názov A-Z</option>
            <option value="name-desc">Názov Z-A</option>
          </select>
        </div>

        {/* Actions Button */}
        <div className="flex items-end space-x-2">
          <button
            onClick={applyFilters}
            className="flex-1 bg-amber-500 text-zinc-950 text-xs font-bold py-2.5 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Použiť
          </button>
          <button
            onClick={resetFilters}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold py-2.5 px-3 rounded-lg border border-zinc-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Mobile Drawer Trigger Bar */}
      <div className="flex md:hidden items-center justify-between">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center space-x-2 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-semibold hover:border-zinc-700 transition-colors"
        >
          <span>Filtre a zoradenie</span>
        </button>
        <button
          onClick={resetFilters}
          className="text-xs text-zinc-500 hover:text-zinc-300 underline"
        >
          Zmazať filtre
        </button>
      </div>

      {/* Mobile Modal Drawer overlay frame */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-sm bg-zinc-900 h-full flex flex-col p-6 animate-slide-in">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <h3 className="font-bold text-lg text-zinc-100">Filtre</h3>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                Zatvoriť
              </button>
            </div>

            {/* Scrollable Filters form list */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Provider Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Poskytovateľ</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none"
                >
                  <option value="">Všetci</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name} ({p.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Téma</label>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none"
                >
                  <option value="">Všetky</option>
                  {themes.map((t) => (
                    <option key={t.id} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Typ hry</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none"
                >
                  <option value="">Všetky</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Zoradiť podľa</label>
                <select
                  value={`${selectedOrderBy}-${selectedOrder}`}
                  onChange={(e) => {
                    const [orderBy, order] = e.target.value.split('-');
                    setSelectedOrderBy(orderBy);
                    setSelectedOrder(order);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none"
                >
                  <option value="date-desc">Najnovšie</option>
                  <option value="name-asc">Názov A-Z</option>
                  <option value="name-desc">Názov Z-A</option>
                  <option value="modified-desc">Nedávno upravené</option>
                </select>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-4 border-t border-zinc-800 flex space-x-3 mt-6">
              <button
                onClick={resetFilters}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold py-3 rounded-lg border border-zinc-700 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 bg-amber-500 text-zinc-950 text-sm font-bold py-3 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Zobraziť výsledky
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
