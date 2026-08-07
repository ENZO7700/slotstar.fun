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
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-zinc-50">Pripravované hry</h1>
        <p className="text-sm text-zinc-500">
          Tituly, ktoré budú čoskoro vydané a dostupné na hranie.
        </p>
      </div>

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
