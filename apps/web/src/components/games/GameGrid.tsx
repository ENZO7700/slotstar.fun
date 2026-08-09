import React from 'react';
import { GameSummary } from '@/types/game';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: GameSummary[];
}

export function GameGrid({ games }: GameGridProps) {
  // Deduplicate games by ID to prevent duplicate cards
  const seen = new Set<number>();
  const uniqueGames = games.filter((game) => {
    if (seen.has(game.id)) return false;
    seen.add(game.id);
    return true;
  });

  return (
    <div className="game-grid">
      {uniqueGames.map((game, index) => (
        <GameCard key={game.id} game={game} priority={index < 4} />
      ))}
    </div>
  );
}
