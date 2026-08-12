import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingProviders } from '../LandingProviders';
import { makeProvider } from './fixtures';

describe('LandingProviders', () => {
  it('returns null for empty providers', () => {
    const { container } = render(<LandingProviders providers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders at most 12 provider links with correct hrefs', () => {
    const providers = Array.from({ length: 15 }, (_, i) =>
      makeProvider({ id: i + 1, name: `Provider ${i + 1}`, slug: `p-${i + 1}` }),
    );
    render(<LandingProviders providers={providers} />);
    expect(screen.getByText('Provider 1')).toBeInTheDocument();
    expect(screen.getByText('Provider 12')).toBeInTheDocument();
    expect(screen.queryByText('Provider 13')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Provider 1' })).toHaveAttribute(
      'href',
      '/providers/p-1',
    );
  });
});
