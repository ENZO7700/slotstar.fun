'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GameImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export function GameImage({ src, alt, className = '' }: GameImageProps) {
  const [error, setError] = useState(false);

  // If no source or error happens, display a clean fallback placeholder card
  if (!src || error) {
    return (
      <div className={`w-full h-full bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-4 text-center rounded-lg ${className}`}>
        <span className="text-zinc-600 text-[10px] uppercase tracking-wider font-bold">SlotStar</span>
        <span className="text-zinc-500 text-xs font-semibold mt-1 truncate max-w-full px-2">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-zinc-900 rounded-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-300 hover:scale-105"
        onError={() => setError(true)}
      />
    </div>
  );
}
