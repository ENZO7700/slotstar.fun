import React from 'react';
import Link from 'next/link';
import { Provider } from '@/types/provider';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  // Use first letter of name as logo initials fallback
  const initial = provider.name ? provider.name.charAt(0).toUpperCase() : '?';

  return (
    <Link
      href={`/providers/${provider.slug}`}
      className="group flex items-center p-4 bg-zinc-900 border-[var(--border-brutal)] border-black hover:border-amber-500/50 rounded-lg hover:shadow-md transition-all duration-200"
    >
      {/* Fallback Artwork Initials block */}
      <div className="w-10 h-10 rounded bg-zinc-800 border-[var(--border-medium)] border-black flex items-center justify-center font-bold text-amber-500 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
        {initial}
      </div>

      <div className="ml-4 truncate">
        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-500 transition-colors truncate">
          {provider.name}
        </h3>
        <p className="text-xs text-zinc-400">
          {provider.count} {provider.count === 1 ? 'hra' : provider.count < 5 ? 'hry' : 'hier'}
        </p>
      </div>
    </Link>
  );
}
