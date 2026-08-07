import React from 'react';
import { Provider } from '@/types/provider';
import { ProviderCard } from './ProviderCard';

interface ProviderGridProps {
  providers: Provider[];
}

export function ProviderGrid({ providers }: ProviderGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
}
