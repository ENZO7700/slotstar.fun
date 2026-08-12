import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LandingHeader } from '../LandingHeader';

describe('LandingHeader', () => {
  it('renders desktop nav items and persistent CTA', () => {
    render(<LandingHeader />);
    expect(screen.getByRole('navigation', { name: 'Marketing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /HRY/i })).toHaveAttribute('href', '/games');
    expect(screen.getByRole('link', { name: /PROVIDERI/i })).toHaveAttribute(
      'href',
      '/providers',
    );
    expect(screen.getByRole('link', { name: /NOVINKY/i })).toHaveAttribute(
      'href',
      '/new-games',
    );
    expect(screen.getByRole('link', { name: /BLOG/i })).toHaveAttribute('href', '/blog');
    expect(screen.getAllByRole('link', { name: /HRAŤ DEMO/i }).length).toBeGreaterThan(0);
  });

  it('toggles mobile menu open and closed', async () => {
    const user = userEvent.setup();
    render(<LandingHeader />);

    expect(screen.queryByRole('navigation', { name: 'Mobile marketing' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('navigation', { name: 'Mobile marketing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zavrieť' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Zavrieť' }));
    expect(screen.queryByRole('navigation', { name: 'Mobile marketing' })).not.toBeInTheDocument();
  });
});
