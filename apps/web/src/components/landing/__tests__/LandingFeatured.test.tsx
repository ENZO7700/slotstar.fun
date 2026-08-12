import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LandingFeatured } from '../LandingFeatured';
import { makeGames } from './fixtures';

vi.mock('next/image', () => ({
  default: (props: { alt?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt ?? ''} />;
  },
}));

describe('LandingFeatured', () => {
  it('returns null for empty games', () => {
    const { container } = render(<LandingFeatured games={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders editor pick plus up to 4 side cards', () => {
    const games = makeGames(8);
    render(<LandingFeatured games={games} />);
    expect(screen.getByText('EDITOR PICK')).toBeInTheDocument();
    expect(screen.getByText('Game 1')).toBeInTheDocument();
    expect(screen.getByText('Game 2')).toBeInTheDocument();
    expect(screen.getByText('Game 5')).toBeInTheDocument();
    expect(screen.queryByText('Game 6')).not.toBeInTheDocument();
  });
});
