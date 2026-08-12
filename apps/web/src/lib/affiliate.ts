/**
 * ─────────────────────────────────────────────────────
 *  AFFILIATE CONFIG — single source of truth
 *  Change AFFILIATE_URL here → updates the entire app.
 *
 *  Fortuna affinity: set FORTUNA_AFFILIATE_URL to a real
 *  sponsored link to activate partner-scoped yellow CTAs.
 *  SlotStar demo chrome stays red (#E1001A) — see
 *  docs/FORTUNA_AFFINITY.md
 * ─────────────────────────────────────────────────────
 */

export type AffiliatePartnerId = 'default' | 'fortuna';

/** Primary outbound affiliate URL (current partner). */
export const AFFILIATE_URL = 'https://betlbl.com/?bf=6858ac6c4bbc5_11430411467';

/**
 * Fortuna sponsored URL — leave empty until affiliate go-live.
 * When non-empty, partner affinity surfaces activate.
 */
export const FORTUNA_AFFILIATE_URL = '' as string;

/** Force partner theme; `auto` follows FORTUNA_AFFILIATE_URL. */
export const AFFILIATE_PARTNER_MODE: AffiliatePartnerId | 'auto' = 'auto';

export function resolveAffiliatePartner(): AffiliatePartnerId {
  if (AFFILIATE_PARTNER_MODE === 'fortuna' || AFFILIATE_PARTNER_MODE === 'default') {
    return AFFILIATE_PARTNER_MODE;
  }
  return FORTUNA_AFFILIATE_URL.trim().length > 0 ? 'fortuna' : 'default';
}

export function isFortunaAffinityActive(): boolean {
  return resolveAffiliatePartner() === 'fortuna' && FORTUNA_AFFILIATE_URL.trim().length > 0;
}

export function getAffiliateUrl(partner?: AffiliatePartnerId): string {
  const resolved = partner ?? resolveAffiliatePartner();
  if (resolved === 'fortuna' && FORTUNA_AFFILIATE_URL.trim().length > 0) {
    return FORTUNA_AFFILIATE_URL.trim();
  }
  return AFFILIATE_URL;
}

export function getAffiliateLinkProps(partner?: AffiliatePartnerId) {
  return {
    href: getAffiliateUrl(partner),
    target: '_blank' as const,
    rel: 'noopener noreferrer sponsored' as const,
  };
}

/** @deprecated Prefer getAffiliateLinkProps() — kept for existing imports */
export const AFFILIATE_LINK_PROPS = {
  href: AFFILIATE_URL,
  target: '_blank',
  rel: 'noopener noreferrer sponsored',
} as const;

/** CTA copy variants — A/B friendly */
export const AFFILIATE_CTA = {
  primary: '🎰 Hrať za skutočné peniaze',
  secondary: '💰 Získať bonus',
  compact: '▶ Hrať teraz',
  sidebar: '🔥 Získaj bonus',
  hero: '🚀 Zaregistruj sa a hraj',
  footer: 'Navštíviť kasíno →',
  game: '💸 Hrať za real peniaze',
  floating: '💰 BONUS',
  fortunaPrimary: 'Hrať u Fortuny',
  fortunaBonus: 'Získať bonus u Fortuny',
  fortunaFloating: 'FORTUNA',
  fortunaStrip: 'Oficiálny partner Fortuna — hraj za real →',
} as const;
