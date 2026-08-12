import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  AffiliateBanner,
  AffiliateButton,
  PartnerStrip,
} from '../AffiliateComponents';
import { AFFILIATE_CTA, AFFILIATE_URL } from '@/lib/affiliate';

describe('AffiliateButton', () => {
  it('renders default SlotStar CTA with blood styles and sponsored rel', () => {
    render(<AffiliateButton partner="default" />);
    const link = screen.getByRole('link', {
      name: `Affiliate link: ${AFFILIATE_CTA.primary}`,
    });
    expect(link).toHaveAttribute('href', AFFILIATE_URL);
    expect(link).toHaveAttribute('rel', expect.stringContaining('sponsored'));
    expect(link.className).toContain('bg-[#ff0033]');
    expect(link.className).not.toContain('partner-fortuna');
  });

  it('applies Fortuna partner styles and label when partner=fortuna', () => {
    render(<AffiliateButton partner="fortuna" />);
    const link = screen.getByRole('link', {
      name: `Affiliate link: ${AFFILIATE_CTA.fortunaPrimary}`,
    });
    expect(link.className).toContain('partner-fortuna');
    expect(link.className).toContain('bg-[var(--partner-brand)]');
    expect(link).toHaveAttribute('rel', expect.stringContaining('sponsored'));
  });
});

describe('AffiliateBanner', () => {
  it('renders blood variant by default when Fortuna inactive', () => {
    render(<AffiliateBanner partner="default" />);
    const link = screen.getByRole('link', { name: 'Affiliate promotion banner' });
    expect(link.className).toContain('bg-[#ff0033]');
    expect(link).toHaveAttribute('rel', expect.stringContaining('sponsored'));
  });

  it('renders partner variant classes when partner=fortuna', () => {
    render(<AffiliateBanner partner="fortuna" />);
    const link = screen.getByRole('link', { name: 'Affiliate promotion banner' });
    expect(link.className).toContain('partner-fortuna');
    expect(link.className).toContain('bg-[var(--partner-brand)]');
  });
});

describe('PartnerStrip', () => {
  it('renders nothing while Fortuna affinity is inactive', () => {
    const { container } = render(<PartnerStrip />);
    expect(container.firstChild).toBeNull();
  });
});
