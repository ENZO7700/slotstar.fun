import { describe, expect, it } from 'vitest';
import {
  AFFILIATE_CTA,
  AFFILIATE_PARTNER_MODE,
  AFFILIATE_URL,
  FORTUNA_AFFILIATE_URL,
  getAffiliateLinkProps,
  getAffiliateUrl,
  isFortunaAffinityActive,
  resolveAffiliatePartner,
} from './affiliate';

describe('affiliate config', () => {
  it('defaults to non-Fortuna partner while FORTUNA_AFFILIATE_URL is empty', () => {
    expect(FORTUNA_AFFILIATE_URL).toBe('');
    expect(AFFILIATE_PARTNER_MODE).toBe('auto');
    expect(resolveAffiliatePartner()).toBe('default');
    expect(isFortunaAffinityActive()).toBe(false);
    expect(getAffiliateUrl()).toBe(AFFILIATE_URL);
  });

  it('keeps sponsored rel on link props', () => {
    const props = getAffiliateLinkProps('default');
    expect(props.rel).toContain('sponsored');
    expect(props.target).toBe('_blank');
    expect(props.href).toBe(AFFILIATE_URL);
  });

  it('falls back to default URL when fortuna partner requested without URL', () => {
    expect(getAffiliateUrl('fortuna')).toBe(AFFILIATE_URL);
    const props = getAffiliateLinkProps('fortuna');
    expect(props.href).toBe(AFFILIATE_URL);
    expect(props.rel).toContain('sponsored');
  });

  it('exposes complete AFFILIATE_CTA keys for SlotStar and Fortuna', () => {
    expect(AFFILIATE_CTA.primary).toBeTruthy();
    expect(AFFILIATE_CTA.floating).toBeTruthy();
    expect(AFFILIATE_CTA.fortunaPrimary).toBe('Hrať u Fortuny');
    expect(AFFILIATE_CTA.fortunaBonus).toBeTruthy();
    expect(AFFILIATE_CTA.fortunaFloating).toBe('FORTUNA');
    expect(AFFILIATE_CTA.fortunaStrip).toContain('Fortuna');
  });
});
