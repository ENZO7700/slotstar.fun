import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionTitle } from '../SectionTitle';

describe('SectionTitle', () => {
  it('renders title and index', () => {
    render(<SectionTitle index="01" title="TRENDING" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('TRENDING');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('/ 01');
  });

  it('renders link only when href is provided', () => {
    const { rerender } = render(<SectionTitle index="01" title="TRENDING" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    rerender(
      <SectionTitle index="01" title="TRENDING" href="/games" linkLabel="Všetko →" />,
    );
    const link = screen.getByRole('link', { name: 'Všetko →' });
    expect(link).toHaveAttribute('href', '/games');
  });
});
