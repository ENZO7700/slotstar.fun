import React from 'react';
import { GameSummary } from '@/types/game';
import { GameCard } from './GameCard';

interface GameRailProps {
  games: GameSummary[];
}

export function GameRail({ games }: GameRailProps) {
  return (
    <div className="relative w-full">
      {/* Horizontal snapping overflow scrollbar track wrapper */}
      <div className="flex space-x-4 overflow-x-auto py-2 scroll-smooth snap-x snap-mandatory">
        {games.map((game) => (
          <div
            key={game.id}
            className="w-[160px] sm:w-[200px] shrink-0 snap-start"
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
}
