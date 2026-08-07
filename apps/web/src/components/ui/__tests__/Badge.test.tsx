import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies the correct default variant styles', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge.className).toContain('bg-zinc-800');
  });

  it('applies brand variant styles', () => {
    render(<Badge variant="brand">Brand</Badge>);
    const badge = screen.getByText('Brand');
    expect(badge.className).toContain('bg-amber-950');
  });
});
