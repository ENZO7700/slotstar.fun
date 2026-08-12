import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LandingHero } from '../LandingHero';

vi.mock('../LandingStarDrift', () => ({
  LandingStarDrift: () => <div data-testid="star-drift" />,
}));

describe('LandingHero', () => {
  it('renders SLOTSTAR wordmark and primary CTA to /games', () => {
    render(<LandingHero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SLOT');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('STAR');
    const cta = screen.getByRole('link', { name: /HRAŤ DEMO/i });
    expect(cta).toHaveAttribute('href', '/games');
  });

  it('shows demo count only when totalGames > 0', () => {
    const { rerender } = render(<LandingHero totalGames={null} />);
    expect(screen.queryByText(/DEMO HIER/i)).not.toBeInTheDocument();

    rerender(<LandingHero totalGames={0} />);
    expect(screen.queryByText(/DEMO HIER/i)).not.toBeInTheDocument();

    rerender(<LandingHero totalGames={1200} />);
    expect(screen.getByText('// 1200+ DEMO HIER')).toBeInTheDocument();
  });

  it('links secondary CTA to new games', () => {
    render(<LandingHero />);
    expect(screen.getByRole('link', { name: /OBJAVIŤ NOVINKY/i })).toHaveAttribute(
      'href',
      '/new-games',
    );
  });
});
