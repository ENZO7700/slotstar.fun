import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingEditorial } from '../LandingEditorial';
import { makePost } from './fixtures';

describe('LandingEditorial', () => {
  it('returns null for empty posts', () => {
    const { container } = render(<LandingEditorial posts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders lead story and up to two side posts', () => {
    const posts = [
      makePost({ id: 1, title: 'Lead Story', slug: 'lead' }),
      makePost({ id: 2, title: 'Side One', slug: 'side-1' }),
      makePost({ id: 3, title: 'Side Two', slug: 'side-2' }),
      makePost({ id: 4, title: 'Side Three', slug: 'side-3' }),
    ];
    render(<LandingEditorial posts={posts} />);
    expect(screen.getByText('Lead Story')).toBeInTheDocument();
    expect(screen.getByText('Side One')).toBeInTheDocument();
    expect(screen.getByText('Side Two')).toBeInTheDocument();
    expect(screen.queryByText('Side Three')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lead Story' })).toHaveAttribute(
      'href',
      '/blog/lead',
    );
  });

  it('formats lead date for sk-SK locale', () => {
    render(
      <LandingEditorial
        posts={[makePost({ id: 1, title: 'Dated', date: '2024-06-15T12:00:00Z' })]}
      />,
    );
    // sk-SK short month typically includes 2024
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });
});
