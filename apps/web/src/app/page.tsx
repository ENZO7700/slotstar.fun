import React from 'react';
import Link from 'next/link';
import { getGames, getHealth, getProviders } from '@/lib/api/wordpress';
import { GameRail } from '@/components/games/GameRail';
import { ProviderGrid } from '@/components/providers/ProviderGrid';
import { ApiErrorState } from '@/components/states/ApiErrorState';

import { GameSummary } from '@/types/game';
import { Provider } from '@/types/provider';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let health = null;
  let newGames: GameSummary[] = [];
  let featuredGames: GameSummary[] = [];
  let topProviders: Provider[] = [];
  let errorMsg = null;

  try {
    health = await getHealth();
    
    // Fetch New Releases
    const newRes = await getGames({ perPage: 10, orderBy: 'date', order: 'desc' });
    newGames = newRes.data;

    // Fetch Featured Games
    const featuredRes = await getGames({ perPage: 10, orderBy: 'modified', order: 'desc' });
    featuredGames = featuredRes.data.filter(g => g.featured);

    // If no explicit featured games exist, use fallback list
    if (featuredGames.length === 0) {
      featuredGames = featuredRes.data.slice(0, 6);
    }

    // Fetch Top Providers
    const providersRes = await getProviders({ perPage: 8 });
    topProviders = providersRes.data;
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : 'Nepodarilo sa pripojiť k WordPress REST API';
  }

  if (errorMsg && !health) {
    return <ApiErrorState message={errorMsg} />;
  }

  return (
    <div className="space-y-12">
      {/* Compact Branded Hero Section */}
      <section className="relative w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 overflow-hidden flex flex-col md:flex-row md:items-center justify-between">
        <div className="space-y-4 max-w-xl z-10">
          <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Premium Casino Catalogue
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Objavte tisícky zadarmo demo kasíno hier a poskytovateľov
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Bezpečné a okamžité hranie bez registrácie. Testujte RTP, volatilitu a bonusové kolá priamo vo vašom prehliadači na SlotStars.fun.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/games"
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-sm font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Preskúmať katalóg
            </Link>
            <Link
              href="/new-games"
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 text-sm font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Najnovšie hry
            </Link>
          </div>
        </div>
        {/* Abstract design shape fallback */}
        <div className="hidden md:block w-72 h-72 bg-linear-to-tr from-amber-500/10 to-indigo-500/5 rounded-full filter blur-xl absolute -right-16 -top-16" />
      </section>

      {/* Category Links Shortcut Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/new-games"
          className="p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-center transition-colors"
        >
          <span className="block text-lg font-bold text-amber-500">Nové hry</span>
          <span className="text-xs text-zinc-500">Čerstvé novinky v ponuke</span>
        </Link>
        <Link
          href="/featured"
          className="p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-center transition-colors"
        >
          <span className="block text-lg font-bold text-amber-500">Odporúčané</span>
          <span className="text-xs text-zinc-500">Najobľúbenejšie automaty</span>
        </Link>
        <Link
          href="/upcoming"
          className="p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-center transition-colors"
        >
          <span className="block text-lg font-bold text-amber-500">Pripravované</span>
          <span className="text-xs text-zinc-500">Exkluzívne nadchádzajúce tituly</span>
        </Link>
        <Link
          href="/providers"
          className="p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-center transition-colors"
        >
          <span className="block text-lg font-bold text-amber-500">Poskytovatelia</span>
          <span className="text-xs text-zinc-500">Všetky vývojárske štúdiá</span>
        </Link>
      </section>

      {/* New Releases Rail Section */}
      {newGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Najnovšie hry</h2>
            <Link href="/new-games" className="text-xs text-amber-500 hover:underline">
              Zobraziť všetky
            </Link>
          </div>
          <GameRail games={newGames} />
        </section>
      )}

      {/* Featured Games Rail Section */}
      {featuredGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Odporúčané hry</h2>
            <Link href="/featured" className="text-xs text-amber-500 hover:underline">
              Zobraziť všetky
            </Link>
          </div>
          <GameRail games={featuredGames} />
        </section>
      )}

      {/* Top Providers Grid Section */}
      {topProviders.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Poprední poskytovatelia</h2>
            <Link href="/providers" className="text-xs text-amber-500 hover:underline">
              Zobraziť všetkých
            </Link>
          </div>
          <ProviderGrid providers={topProviders} />
        </section>
      )}
    </div>
  );
}
