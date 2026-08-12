import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingCategoryNav } from '../LandingCategoryNav';

describe('LandingCategoryNav', () => {
  it('renders six category links with correct hrefs', () => {
    render(<LandingCategoryNav />);
    expect(screen.getByRole('link', { name: /ALL/i })).toHaveAttribute('href', '/games');
    expect(screen.getByRole('link', { name: /TRENDING/i })).toHaveAttribute(
      'href',
      '/games?orderBy=trending',
    );
    expect(screen.getByRole('link', { name: /NEW/i })).toHaveAttribute('href', '/new-games');
    expect(screen.getByRole('link', { name: /FEATURED/i })).toHaveAttribute(
      'href',
      '/featured',
    );
    expect(screen.getByRole('link', { name: /UPCOMING/i })).toHaveAttribute(
      'href',
      '/upcoming',
    );
    expect(screen.getByRole('link', { name: /PROVIDERS/i })).toHaveAttribute(
      'href',
      '/providers',
    );
  });
});
