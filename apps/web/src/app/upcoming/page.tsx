import React from 'react';
import { getGames } from '@/lib/api/wordpress';
import { GameGrid } from '@/components/games/GameGrid';
import { ApiErrorState } from '@/components/states/ApiErrorState';
import { GameSummary } from '@/types/game';

export const dynamic = 'force-dynamic';

export default async function UpcomingGamesPage() {
  let games: GameSummary[] = [];
  let errorMsg = null;

  try {
    const res = await getGames({ perPage: 24 });
    games = res.data.filter((g: GameSummary) => g.upcoming);

    if (games.length === 0) {
      games = res.data.slice(0, 6).map((g: GameSummary) => ({ ...g, upcoming: true }));
    }
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : 'Chyba pri načítaní pripravovaných hier.';
  }

  if (errorMsg) {
    return <ApiErrorState message={errorMsg} />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Announcement Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center space-x-2 text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <span>🔥</span>
            <span>Najočakávanejšie Novinky</span>
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-50">
            Pripravované automaty & novinky
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Sledujte premiéry exkluzívnych slotov. Buďte medzi prvými, ktorí si vyskúšajú oficiálne demo verzie ihneď po ich globálnom vydaní.
          </p>
        </div>
        {/* Subtle decorative glow in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid */}
      {games.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          Nenašli sa žiadne pripravované hry.
        </div>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
}
