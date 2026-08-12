import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LandingNew } from '../LandingNew';
import { makeGames } from './fixtures';

vi.mock('next/image', () => ({
  default: (props: { alt?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt ?? ''} />;
  },
}));

describe('LandingNew', () => {
  it('returns null for empty games', () => {
    const { container } = render(<LandingNew games={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders at most 12 rail cards', () => {
    render(<LandingNew games={makeGames(20)} />);
    expect(screen.getByRole('heading', { name: /NEW/i })).toBeInTheDocument();
    expect(screen.getByText('Game 1')).toBeInTheDocument();
    expect(screen.getByText('Game 12')).toBeInTheDocument();
    expect(screen.queryByText('Game 13')).not.toBeInTheDocument();
  });
});
