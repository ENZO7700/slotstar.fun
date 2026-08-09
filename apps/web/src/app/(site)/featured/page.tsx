import React from 'react';
import { getGames } from '@/lib/api/wordpress';
import { GameGrid } from '@/components/games/GameGrid';
import { ApiErrorState } from '@/components/states/ApiErrorState';
import { GameSummary } from '@/types/game';

export const dynamic = 'force-dynamic';

export default async function FeaturedGamesPage() {
  let games: GameSummary[] = [];
  let errorMsg = null;

  try {
    const res = await getGames({ perPage: 24, orderBy: 'modified', order: 'desc' });
    games = res.data.filter((g: GameSummary) => g.featured);

    if (games.length === 0) {
      games = res.data.slice(0, 12);
    }
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : 'Chyba pri načítaní odporúčaných hier.';
  }

  if (errorMsg) {
    return <ApiErrorState message={errorMsg} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-zinc-50">Odporúčané demo automaty</h1>
        <p className="text-sm text-zinc-500">
          Výber najlepších a najpopulárnejších hier pre skvelý herný zážitok.
        </p>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          Nenašli sa žiadne odporúčané hry.
        </div>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
}
