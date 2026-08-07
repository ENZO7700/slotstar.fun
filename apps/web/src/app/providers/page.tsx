import React from 'react';
import { getProviders } from '@/lib/api/wordpress';
import { ProviderGrid } from '@/components/providers/ProviderGrid';
import { ApiErrorState } from '@/components/states/ApiErrorState';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    letter?: string;
  }>;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default async function ProvidersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const page = parseInt(resolvedParams.page || '1', 10);
  const letter = resolvedParams.letter || '';

  let providersResponse = null;
  let errorMsg = null;

  try {
    providersResponse = await getProviders({
      page,
      perPage: 24,
      q,
      letter,
    });
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : 'Chyba pri načítaní poskytovateľov hier.';
  }

  if (errorMsg) {
    return <ApiErrorState message={errorMsg} />;
  }

  const providers = providersResponse?.data || [];
  const pagination = providersResponse?.pagination || { page: 1, perPage: 24, total: 0, totalPages: 0 };

  return (
    <div className="space-y-8">
      {/* Header and Search Form Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-zinc-50">Poskytovatelia hier</h1>
          <p className="text-sm text-zinc-500">
            Objavte vývojárske štúdiá stojace za vašimi obľúbenými automatmi.
          </p>
        </div>

        {/* Search input form */}
        <form method="GET" action="/providers" className="flex items-center space-x-2 w-full md:max-w-xs">
          {letter && <input type="hidden" name="letter" value={letter} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Hľadať poskytovateľa..."
            className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm rounded-lg transition-colors"
          >
            Hľadať
          </button>
        </form>
      </div>

      {/* Alphabet filter list */}
      <div className="flex flex-wrap gap-2 py-3 border-t border-b border-zinc-900">
        <Link
          href={{
            pathname: '/providers',
            query: { ...(q ? { q } : {}) },
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            !letter
              ? 'bg-amber-500 text-zinc-950'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          Všetko
        </Link>
        {ALPHABET.map((char) => (
          <Link
            key={char}
            href={{
              pathname: '/providers',
              query: { letter: char, ...(q ? { q } : {}) },
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              letter === char
                ? 'bg-amber-500 text-zinc-950'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            {char}
          </Link>
        ))}
      </div>

      {/* Provider List Grid */}
      {providers.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 bg-zinc-900/10 border border-dashed border-zinc-900 rounded-2xl">
          Nenašli sa žiadni poskytovatelia hier.
        </div>
      ) : (
        <>
          <ProviderGrid providers={providers} />

          {/* Pagination component controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
              <div className="text-xs text-zinc-500">
                Zobrazujem {providers.length} z {pagination.total} poskytovateľov
              </div>
              <div className="flex items-center space-x-2">
                {page > 1 ? (
                  <Link
                    href={{
                      pathname: '/providers',
                      query: {
                        page: page - 1,
                        ...(q ? { q } : {}),
                        ...(letter ? { letter } : {}),
                      },
                    }}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 font-semibold text-xs rounded-lg transition-colors"
                  >
                    Predchádzajúca
                  </Link>
                ) : (
                  <span className="px-4 py-2 bg-zinc-950 border border-zinc-900 text-zinc-700 font-semibold text-xs rounded-lg cursor-not-allowed">
                    Predchádzajúca
                  </span>
                )}

                <span className="text-xs text-zinc-400 font-bold px-3">
                  Strana {page} z {pagination.totalPages}
                </span>

                {page < pagination.totalPages ? (
                  <Link
                    href={{
                      pathname: '/providers',
                      query: {
                        page: page + 1,
                        ...(q ? { q } : {}),
                        ...(letter ? { letter } : {}),
                      },
                    }}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 font-semibold text-xs rounded-lg transition-colors"
                  >
                    Nasledujúca
                  </Link>
                ) : (
                  <span className="px-4 py-2 bg-zinc-950 border border-zinc-900 text-zinc-700 font-semibold text-xs rounded-lg cursor-not-allowed">
                    Nasledujúca
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
