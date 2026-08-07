import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({
  title = "Nenašli sa žiadne hry",
  description = "Skúste upraviť filtre vyhľadávania alebo sa vrátiť na domovskú stránku.",
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-zinc-900 border border-zinc-800 rounded-xl my-6">
      <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-600 font-bold text-lg">
        ?
      </div>
      <h3 className="text-lg font-bold text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-sm font-bold rounded-lg transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
