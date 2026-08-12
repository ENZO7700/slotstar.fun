import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingTrustTicker } from '../LandingTrustTicker';

describe('LandingTrustTicker', () => {
  it('renders five trust markers', () => {
    render(<LandingTrustTicker />);
    expect(screen.getByText('18+')).toBeInTheDocument();
    expect(screen.getByText('DEMO ONLY')).toBeInTheDocument();
    expect(screen.getByText('NO DEPOSIT')).toBeInTheDocument();
    expect(screen.getByText('NO REGISTRATION')).toBeInTheDocument();
    expect(screen.getByText('INSTANT PLAY')).toBeInTheDocument();
  });

  it('links 18+ to responsible gaming', () => {
    render(<LandingTrustTicker />);
    expect(screen.getByRole('link', { name: '18+' })).toHaveAttribute(
      'href',
      '/responsible-gaming',
    );
  });
});
