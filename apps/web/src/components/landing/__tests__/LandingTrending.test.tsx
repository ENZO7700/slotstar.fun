import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LandingTrending } from '../LandingTrending';
import { makeGame, makeGames } from './fixtures';

vi.mock('next/image', () => ({
  default: (props: { alt?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt ?? ''} />;
  },
}));

describe('LandingTrending', () => {
  it('returns null for empty games', () => {
    const { container } = render(<LandingTrending games={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders at most 6 ranked cards', () => {
    render(<LandingTrending games={makeGames(10)} />);
    expect(screen.getByRole('heading', { name: /TRENDING/i })).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('06')).toBeInTheDocument();
    expect(screen.queryByText('07')).not.toBeInTheDocument();
  });

  it('shows RTP · VOL only when fields exist', () => {
    render(
      <LandingTrending
        games={[
          makeGame({ id: 1, name: 'With Meta', rtp: '96%', volatility: 'Med' }),
          makeGame({ id: 2, name: 'No Meta', rtp: null, volatility: null }),
        ]}
      />,
    );
    expect(screen.getByText('RTP 96% · VOL Med')).toBeInTheDocument();
    expect(screen.getByText('With Meta')).toBeInTheDocument();
    expect(screen.getByText('No Meta')).toBeInTheDocument();
  });
});
