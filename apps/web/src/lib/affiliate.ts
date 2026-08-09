/**
 * ─────────────────────────────────────────────────────
 *  AFFILIATE CONFIG — single source of truth
 *  Change AFFILIATE_URL here → updates the entire app.
 * ─────────────────────────────────────────────────────
 */

export const AFFILIATE_URL = 'https://betlbl.com?bf=6858ac6c4bbc5_11430411467';

/** Standard link props — always opens in new tab, no referrer leak */
export const AFFILIATE_LINK_PROPS = {
  href: AFFILIATE_URL,
  target: '_blank',
  rel: 'noopener noreferrer sponsored',
} as const;

/** CTA copy variants — A/B friendly */
export const AFFILIATE_CTA = {
  primary:   '🎰 Hrať za skutočné peniaze',
  secondary: '💰 Získať bonus',
  compact:   '▶ Hrať teraz',
  sidebar:   '🔥 Získaj bonus',
  hero:      '🚀 Zaregistruj sa a hraj',
  footer:    'Navštíviť kasíno →',
  game:      '💸 Hrať za real peniaze',
  floating:  '💰 BONUS',
} as const;
