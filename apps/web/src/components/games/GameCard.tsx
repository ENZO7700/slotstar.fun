import React from 'react';
import Link from 'next/link';
import { GameSummary } from '@/types/game';
import { GameImage } from './GameImage';
import { Badge } from '../ui/Badge';

interface GameCardProps {
  game: GameSummary;
  priority?: boolean;
}

export function GameCard({ game, priority = false }: GameCardProps) {
  // Compute badge flags based on metadata
  const isUpcoming = game.upcoming;
  const isFeatured = game.featured;

  return (
    <Link
      href={game.canonicalPath}
      className="group flex flex-col space-y-2 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-1"
    >
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden border border-zinc-900 group-hover:border-zinc-800 transition-colors">
        <GameImage
          src={game.thumbnail.src}
          alt={game.thumbnail.alt || game.name}
          priority={priority}
        />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
          {isUpcoming && <Badge variant="warning">Pripravované</Badge>}
          {isFeatured && <Badge variant="brand">Odporúčané</Badge>}
        </div>

        {/* Hover overlay CTA */}
        <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
          <span className="bg-amber-500 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            Viac detailov
          </span>
        </div>
      </div>

      {/* Metadata Labels */}
      <div className="flex flex-col truncate px-1">
        <span className="text-sm font-semibold text-zinc-100 group-hover:text-amber-500 transition-colors truncate">
          {game.name}
        </span>
        {game.provider && (
          <span className="text-xs text-zinc-500 truncate">
            {game.provider.name}
          </span>
        )}
      </div>
    </Link>
  );
}
