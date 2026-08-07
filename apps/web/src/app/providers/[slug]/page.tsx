import React from 'react';
import { getGames, getProvider } from '@/lib/api/wordpress';
import { GameGrid } from '@/components/games/GameGrid';
import { EmptyState } from '@/components/states/EmptyState';
import { ApiErrorState } from '@/components/states/ApiErrorState';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let provider = null;
  let gamesResponse = null;
  let errorMsg = null;

  try {
    const [providerRes, gamesRes] = await Promise.all([
      getProvider(slug),
      getGames({ provider: slug, perPage: 24 })
    ]);

    provider = providerRes;
    gamesResponse = gamesRes;
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : 'Nepodarilo sa načítať detaily poskytovateľa.';
  }

  if (errorMsg && !provider) {
    return <ApiErrorState message={errorMsg} />;
  }

  if (!provider) {
    return (
      <EmptyState
        title="Poskytovateľ sa nenašiel"
        description="Požadované štúdio nebolo nájdené."
        actionHref="/providers"
        actionLabel="Späť na poskytovateľov"
      />
    );
  }

  const games = gamesResponse?.data || [];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-300">Domov</Link>
        <span>/</span>
        <Link href="/providers" className="hover:text-zinc-300">Poskytovatelia</Link>
        <span>/</span>
        <span className="text-zinc-400 font-semibold">{provider.name}</span>
      </div>

      {/* Header card info */}
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-100">{provider.name}</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Všetky dostupné demo automaty od vývojára {provider.name}.
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-amber-500">{provider.count}</span>
          <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Aktívne hry</span>
        </div>
      </div>

      {/* Games list belonging to provider */}
      {games.length === 0 ? (
        <EmptyState
          title="Žiadne hry od tohto vývojára"
          description={`Poskytovateľ ${provider.name} momentálne nemá v našom katalógu priradené žiadne hry.`}
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-300">Hry od {provider.name}</h2>
          <GameGrid games={games} />
        </div>
      )}
    </div>
  );
}
