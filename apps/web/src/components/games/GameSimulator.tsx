'use client';

import React, { useState } from 'react';
import { GameImage } from './GameImage';
import { Button } from '../ui/Button';
import { AFFILIATE_LINK_PROPS } from '@/lib/affiliate';

interface GameSimulatorProps {
  externalId: number;
  gameName: string;
  thumbnailSrc?: string | null;
}

export function GameSimulator({ externalId, gameName, thumbnailSrc }: GameSimulatorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePlayDemo = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/play?id=${externalId}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Nepodarilo sa spustiť demo verziu.');
      }
      const data = await res.json();
      setEmbedUrl(data.embedUrl);
      setIsPlaying(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Chyba pri pripájaní k serveru.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPlaying && embedUrl) {
    return (
      <iframe
        src={embedUrl}
        className="w-full h-full border-0 rounded-xl"
        allowFullScreen
        scrolling="no"
        title={`${gameName} Demo Play`}
      />
    );
  }

  return (
    <div className="relative w-full h-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden rounded-xl group border border-zinc-900">
      {/* Blurred background thumbnail */}
      {thumbnailSrc && (
        <div className="absolute inset-0 opacity-40 filter blur-md scale-105 pointer-events-none">
          <GameImage src={thumbnailSrc} alt={gameName} />
        </div>
      )}

      {/* Centered CTA overlay content */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-4 max-w-sm">
        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Bezplatná Demo Hra
        </span>
        <h3 className="text-xl font-black text-zinc-100 tracking-tight">{gameName}</h3>
        
        {errorMsg ? (
          <p className="text-xs text-red-400 font-semibold bg-red-950/40 border border-red-900/30 p-2.5 rounded-lg">
            {errorMsg}
          </p>
        ) : (
          <p className="text-xs text-zinc-400 leading-relaxed">
            Hrajte bez rizika a registrácie. Kliknutím na tlačidlo nižšie spustíte oficiálnu demo verziu.
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full justify-center">
          <Button
            onClick={handlePlayDemo}
            disabled={isLoading}
            variant="primary"
            size="lg"
            className="shadow-lg shadow-amber-500/15 w-full sm:w-auto min-w-37.5"
          >
            {isLoading ? 'Načítavam...' : 'Hrať zadarmo'}
          </Button>

          <a
            {...AFFILIATE_LINK_PROPS}
            className="w-full sm:w-auto min-w-37.5 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-bold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all border border-emerald-400/30"
          >
            <span>💰 Hrať o peniaze</span>
          </a>
        </div>
      </div>
    </div>
  );
}
