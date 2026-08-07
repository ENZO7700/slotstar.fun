import React from 'react';
import { GameSummary } from '@/types/game';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: GameSummary[];
}

export function GameGrid({ games }: GameGridProps) {
  return (
    <div className="game-grid">
      {games.map((game, index) => (
        <GameCard key={game.id} game={game} priority={index < 4} />
      ))}
    </div>
  );
}
