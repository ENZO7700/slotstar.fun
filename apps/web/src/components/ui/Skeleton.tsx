import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-800 rounded ${className}`} />
  );
}

export function GameCardSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      {/* 3:4 or 1:1 consistent ratio skeleton thumbnail */}
      <div className="aspect-4/3 w-full animate-pulse bg-zinc-800 rounded-lg" />
      <div className="h-4 w-3/4 animate-pulse bg-zinc-800 rounded" />
      <div className="h-3 w-1/2 animate-pulse bg-zinc-800 rounded" />
    </div>
  );
}

export function GameGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="game-grid">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GameRailSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex space-x-4 overflow-x-hidden py-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[160px] sm:w-[200px] shrink-0">
          <GameCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function ProviderCardSkeleton() {
  return (
    <div className="h-16 w-full animate-pulse bg-zinc-800 border border-zinc-700 rounded-lg" />
  );
}
