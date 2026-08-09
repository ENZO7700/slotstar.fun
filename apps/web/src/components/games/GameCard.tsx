import React from 'react';
import Link from 'next/link';
import { GameSummary } from '@/types/game';
import { GameImage } from './GameImage';
import { Badge } from '../ui/Badge';

import { decodeHtmlEntities } from '@/lib/utils';

interface GameCardProps {
  game: GameSummary;
  priority?: boolean;
}

export function GameCard({ game, priority = false }: GameCardProps) {
  const isUpcoming = game.upcoming;
  const isFeatured = game.featured;
  const rtp = game.rtp || game.technical?.rtp;
  const volatility = game.volatility || game.technical?.volatility;

  return (
    <Link
      href={game.canonicalPath}
      className="group flex flex-col focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
    >
      {/* Thumbnail */}
      <div className="relative aspect-3/4 w-full rounded-lg overflow-hidden border-2 border-black group-hover:border-zinc-600 transition-colors bg-zinc-900">
        <GameImage
          src={game.thumbnail.src}
          alt={decodeHtmlEntities(game.thumbnail.alt || game.name)}
          priority={priority}
        />

        {/* Badges - Left (above overlay) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          {isUpcoming && <Badge variant="warning">Pripravované</Badge>}
          {isFeatured && <Badge variant="brand">Odporúčané</Badge>}
        </div>

        {/* Badges - Right (above overlay) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
          {game.technical?.bonusBuy && <Badge variant="success">Bonus</Badge>}
        </div>

        {/* RTP badge - bottom left (above overlay) */}
        {rtp && (
          <div className="absolute bottom-2 left-2 z-20">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-zinc-200 backdrop-blur-sm">
              RTP {rtp}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
          <span className="bg-amber-500 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            Viac detailov
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-col mt-2 px-0.5 min-h-11">
        <span className="text-sm font-semibold text-zinc-100 group-hover:text-amber-500 transition-colors truncate leading-tight">
          {decodeHtmlEntities(game.name)}
        </span>
        <span className="text-xs text-zinc-400 truncate leading-tight mt-0.5">
          {game.provider ? decodeHtmlEntities(game.provider.name) : 'Neznámy poskytovateľ'}
        </span>
        {volatility && (
          <span className="text-[10px] text-zinc-400 truncate leading-tight mt-0.5">
            Volatilita: {volatility}
          </span>
        )}
      </div>
    </Link>
  );
}
