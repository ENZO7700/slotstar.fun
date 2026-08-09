import React from 'react';
import { getGames, getProviders, getThemes, getTypes } from '@/lib/api/wordpress';
import { GameGrid } from '@/components/games/GameGrid';
import { GameFilters } from '@/components/filters/GameFilters';
import { EmptyState } from '@/components/states/EmptyState';
import { ApiErrorState } from '@/components/states/ApiErrorState';
import Link from 'next/link';

import { Provider } from '@/types/provider';
import { TaxonomyTerm } from '@/types/taxonomy';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    provider?: string;
    theme?: string;
    type?: string;
    orderBy?: string;
    order?: string;
  }>;
}

export default async function GamesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const page = parseInt(resolvedParams.page || '1', 10);
  const provider = resolvedParams.provider || '';
  const theme = resolvedParams.theme || '';
  const type = resolvedParams.type || '';
  const orderBy = (resolvedParams.orderBy || 'date') as 'date' | 'name' | 'modified';
  const order = (resolvedParams.order || 'desc') as 'asc' | 'desc';

  let gamesResponse = null;
  let providers: Provider[] = [];
  let themes: TaxonomyTerm[] = [];
  let types: TaxonomyTerm[] = [];
  let errorMsg = null;

  try {
    // Parallel fetch dependencies to minimize server roundtrip time
    const [gamesRes, providersRes, themesRes, typesRes] = await Promise.all([
      getGames({
        q,
        page,
        perPage: 24,
        provider,
        theme,
        type,
        orderBy,
        order
      }),
      getProviders({ perPage: 100 }),
      getThemes({ perPage: 100 }),
      getTypes({ perPage: 100 })
    ]);

    gamesResponse = gamesRes;
    providers = providersRes.data;
    themes = themesRes.data;
    types = typesRes.data;
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : 'Chyba pri načítaní katalógu hier.';
  }

  if (errorMsg) {
    return <ApiErrorState message={errorMsg} />;
  }

  const games = gamesResponse?.data || [];
  const pagination = gamesResponse?.pagination;
  const totalPages = pagination?.totalPages || 0;

  // Build Pagination URLs helper
  const createPageLink = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (provider) params.set('provider', provider);
    if (theme) params.set('theme', theme);
    if (type) params.set('type', type);
    if (orderBy) params.set('orderBy', orderBy);
    if (order) params.set('order', order);
    params.set('page', targetPage.toString());
    return `/games?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-zinc-50">Katalóg kasíno slotov</h1>
        <p className="text-sm text-zinc-500">
          Filtrujte podľa vývojárov, tém alebo hľadajte špecifickú hru.
        </p>
      </div>

      {/* Filter Toolbar Component */}
      <GameFilters
        providers={providers}
        themes={themes}
        types={types}
      />

      {/* Results Section */}
      {games.length === 0 ? (
        <EmptyState
          title={q ? `Nenašli sa výsledky pre "${q}"` : "Žiadne hry nezodpovedajú filtrom"}
          description="Skúste zmeniť výber filtrov alebo vymazať vyhľadávací dopyt."
        />
      ) : (
        <div className="space-y-8">
          <GameGrid games={games} />

          {/* Clean Casino Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
              <div className="text-xs text-zinc-500">
                Strana <span className="font-semibold text-zinc-300">{page}</span> z <span className="font-semibold text-zinc-300">{totalPages}</span>
              </div>
              <div className="flex items-center space-x-2">
                {page > 1 ? (
                  <Link
                    href={createPageLink(page - 1)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 rounded-lg text-xs font-bold transition-colors"
                  >
                    Predchádzajúca
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-zinc-900 border border-zinc-900 text-zinc-600 rounded-lg text-xs font-bold cursor-not-allowed"
                  >
                    Predchádzajúca
                  </button>
                )}

                {page < totalPages ? (
                  <Link
                    href={createPageLink(page + 1)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 rounded-lg text-xs font-bold transition-colors"
                  >
                    Nasledujúca
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-zinc-900 border border-zinc-900 text-zinc-600 rounded-lg text-xs font-bold cursor-not-allowed"
                  >
                    Nasledujúca
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
