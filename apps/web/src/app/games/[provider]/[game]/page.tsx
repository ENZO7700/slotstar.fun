import React from 'react';
import { getGame } from '@/lib/api/wordpress';
import { EmptyState } from '@/components/states/EmptyState';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

import { GameSimulator } from '@/components/games/GameSimulator';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    provider: string;
    game: string;
  }>;
}

export default async function GameDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const gameSlug = resolvedParams.game;

  // Extract externalId (numeric suffix at end of slug)
  const match = gameSlug.match(/-(\d+)$/);
  const externalId = match ? parseInt(match[1], 10) : null;

  if (!externalId) {
    return (
      <EmptyState
        title="Neplatný formát hry"
        description="Adresa hry nemá správny tvar s priradeným číselným kódom."
        actionHref="/games"
        actionLabel="Späť na katalóg"
      />
    );
  }

  let game = null;
  try {
    game = await getGame(externalId);
  } catch {
    // Return a clean 404-style empty state
  }

  if (!game) {
    return (
      <EmptyState
        title="Hra sa nenašla"
        description="Požadovaná demo hra nebola v našom systéme nájdená."
        actionHref="/games"
        actionLabel="Späť na katalóg"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button and breadcrumbs row */}
      <div className="flex items-center space-x-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-300">Domov</Link>
        <span>/</span>
        <Link href="/games" className="hover:text-zinc-300">Hry</Link>
        <span>/</span>
        {game.provider && (
          <>
            <Link href={`/providers/${game.provider.slug}`} className="hover:text-zinc-300">
              {game.provider.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-400 font-semibold">{game.name}</span>
      </div>

      {/* Primary Detail Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle area: Embed simulator iframe */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-16/9 w-full shadow-2xl">
            <GameSimulator
              externalId={externalId}
              gameName={game.name}
              thumbnailSrc={game.thumbnail.src}
            />
          </div>

          {/* Description section */}
          <div className="space-y-3 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-lg font-bold text-zinc-100">O hre {game.name}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {game.description || `Vyskúšajte si bezplatnú demo verziu hry ${game.name} od poskytovateľa ${game.provider?.name || 'neznámeho autora'}. Spoznajte bonusové funkcie a mechaniku predtým, ako vyskúšate reálne verzie.`}
            </p>
          </div>
        </div>

        {/* Right area: Specifications panel */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-100">{game.name}</h1>
              {game.provider && (
                <Link
                  href={`/providers/${game.provider.slug}`}
                  className="text-xs text-amber-500 font-semibold hover:underline block mt-1"
                >
                  od {game.provider.name}
                </Link>
              )}
            </div>

            {/* Badges / status row */}
            <div className="flex flex-wrap gap-2">
              {game.featured && <Badge variant="brand">Odporúčané</Badge>}
              {game.upcoming && <Badge variant="warning">Pripravované</Badge>}
              {game.type && <Badge variant="muted">{game.type.name}</Badge>}
            </div>

            {/* Parameter attributes grid list */}
            <div className="border-t border-zinc-800 pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">RTP</span>
                <span className="font-semibold text-zinc-200">{game.rtp || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Volatilita</span>
                <span className="font-semibold text-zinc-200">{game.volatility || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Dátum vydania</span>
                <span className="font-semibold text-zinc-200">{game.releaseDate || 'N/A'}</span>
              </div>
            </div>

            {/* Themes list tags */}
            {game.themes && game.themes.length > 0 && (
              <div className="border-t border-zinc-800 pt-6 space-y-2">
                <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Témy hry</span>
                <div className="flex flex-wrap gap-1.5">
                  {game.themes.map((theme) => (
                    <Link
                      key={theme.id}
                      href={`/games?theme=${theme.slug}`}
                      className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded hover:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {theme.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
