import React from 'react';
import { GameSummary } from '@/types/game';
import { GameCard } from './GameCard';

interface GameRailProps {
  games: GameSummary[];
}

export function GameRail({ games }: GameRailProps) {
  // Deduplicate games by ID
  const seen = new Set<number>();
  const uniqueGames = games.filter((game) => {
    if (seen.has(game.id)) return false;
    seen.add(game.id);
    return true;
  });

  return (
    <div className="relative w-full">
      <div className="flex space-x-4 overflow-x-auto py-2 scroll-smooth snap-x snap-mandatory">
        {uniqueGames.map((game, index) => (
          <div
            key={game.id}
            className="w-40 sm:w-50 shrink-0 snap-start"
          >
            <GameCard game={game} priority={index < 2} />
          </div>
        ))}
      </div>
    </div>
  );
}
