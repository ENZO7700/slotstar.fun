import React from 'react';
import {
  AFFILIATE_CTA,
  AFFILIATE_URL,
  getAffiliateLinkProps,
  isFortunaAffinityActive,
  type AffiliatePartnerId,
} from '@/lib/affiliate';

function resolvePartnerProp(partner?: AffiliatePartnerId | 'auto'): AffiliatePartnerId {
  if (partner === 'fortuna' || partner === 'default') return partner;
  return isFortunaAffinityActive() ? 'fortuna' : 'default';
}

/* ─────────────────────────────────────────────
   AffiliateButton — primary CTA component
   Use anywhere you need an affiliate action.
───────────────────────────────────────────── */

interface AffiliateButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'compact' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
  trackingLabel?: string;
  /** `auto` uses Fortuna styling only when FORTUNA_AFFILIATE_URL is set */
  partner?: AffiliatePartnerId | 'auto';
}

export function AffiliateButton({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  partner = 'auto',
}: AffiliateButtonProps) {
  const resolved = resolvePartnerProp(partner);
  const isFortuna = resolved === 'fortuna';
  const linkProps = getAffiliateLinkProps(resolved);
  const resolvedLabel =
    label ?? (isFortuna ? AFFILIATE_CTA.fortunaPrimary : AFFILIATE_CTA.primary);

  const base = [
    'inline-flex items-center justify-center font-black uppercase tracking-widest',
    'transition-all duration-100 cursor-pointer select-none',
    'border-[3px] border-black',
    'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
    fullWidth ? 'w-full' : '',
    isFortuna ? 'partner-fortuna focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--partner-brand)] focus-visible:outline-offset-2' : 'focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:ring-offset-2 focus:ring-offset-black',
  ].join(' ');

  const variants = isFortuna
    ? {
        primary:
          'bg-[var(--partner-brand)] text-[var(--partner-on-brand)] shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-x-px hover:-translate-y-px',
        secondary:
          'bg-[var(--partner-surface)] text-[var(--partner-brand)] shadow-[4px_4px_0_var(--partner-brand)] hover:shadow-[6px_6px_0_var(--partner-brand)] hover:-translate-x-px hover:-translate-y-px',
        compact:
          'bg-[var(--partner-brand)] text-[var(--partner-on-brand)] border-[2px] shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000]',
        ghost:
          'bg-transparent text-[var(--partner-brand)] border-[var(--partner-brand)] hover:bg-[var(--partner-brand)] hover:text-[var(--partner-on-brand)]',
      }
    : {
        primary:
          'bg-[#ff0033] text-white shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-x-px hover:-translate-y-px',
        secondary:
          'bg-black text-[#ff0033] shadow-[4px_4px_0_#ff0033] hover:shadow-[6px_6px_0_#ff0033] hover:-translate-x-px hover:-translate-y-px',
        compact:
          'bg-[#ff0033] text-white border-[2px] shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000]',
        ghost:
          'bg-transparent text-[#ff0033] border-[#ff0033] hover:bg-[#ff0033] hover:text-black',
      };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] gap-1',
    md: 'px-5 py-2.5 text-xs gap-1.5',
    lg: 'px-7 py-3.5 text-sm gap-2',
    xl: 'px-10 py-5 text-base gap-2',
  };

  return (
    <a
      {...linkProps}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={`Affiliate link: ${resolvedLabel}`}
    >
      {resolvedLabel}
    </a>
  );
}

/* ─────────────────────────────────────────────
   AffiliateTextLink — inline text link
───────────────────────────────────────────── */
interface AffiliateTextLinkProps {
  children: React.ReactNode;
  className?: string;
  partner?: AffiliatePartnerId | 'auto';
}

export function AffiliateTextLink({
  children,
  className = '',
  partner = 'auto',
}: AffiliateTextLinkProps) {
  const resolved = resolvePartnerProp(partner);
  const isFortuna = resolved === 'fortuna';
  const linkProps = getAffiliateLinkProps(resolved);

  return (
    <a
      {...linkProps}
      className={
        isFortuna
          ? `partner-fortuna text-[var(--partner-brand)] font-bold underline underline-offset-2 hover:opacity-90 transition-colors ${className}`
          : `text-[#ff0033] font-bold underline underline-offset-2 hover:text-[#cc0029] transition-colors ${className}`
      }
    >
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────
   AffiliateBanner — horizontal promotion strip
───────────────────────────────────────────── */
interface AffiliateBannerProps {
  message?: string;
  ctaLabel?: string;
  variant?: 'blood' | 'warning' | 'partner';
  partner?: AffiliatePartnerId | 'auto';
}

export function AffiliateBanner({
  message,
  ctaLabel,
  variant,
  partner = 'auto',
}: AffiliateBannerProps) {
  const resolved = resolvePartnerProp(partner);
  const isFortuna = resolved === 'fortuna';
  const linkProps = getAffiliateLinkProps(resolved);
  const effectiveVariant = variant ?? (isFortuna ? 'partner' : 'blood');

  const styles = {
    blood: 'bg-[#ff0033] text-white border-b-2 border-black',
    warning: 'bg-[#ffd700] text-black border-b-2 border-black',
    partner:
      'partner-fortuna bg-[var(--partner-brand)] text-[var(--partner-on-brand)] border-b-2 border-black',
  };

  const resolvedMessage =
    message ??
    (isFortuna
      ? 'Oficiálny partner Fortuna — získaj uvítací bonus!'
      : '🎁 Získaj exkluzívny uvítací bonus pre nových hráčov!');
  const resolvedCta =
    ctaLabel ?? (isFortuna ? '→ Hrať u Fortuny' : '→ Zaregistruj sa teraz');

  return (
    <a
      {...linkProps}
      className={`w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 min-h-11 text-xs sm:text-xs md:text-sm font-black uppercase tracking-wider cursor-pointer hover:opacity-95 transition-opacity ${styles[effectiveVariant]}`}
      aria-label="Affiliate promotion banner"
    >
      <span className="hidden sm:inline truncate">{resolvedMessage}</span>
      <span className="sm:hidden truncate">
        {isFortuna ? 'Fortuna bonus →' : '🎁 Bonus pre nových hráčov!'}
      </span>
      <span className="font-black underline shrink-0 whitespace-nowrap">{resolvedCta}</span>
    </a>
  );
}

/* ─────────────────────────────────────────────
   AffiliateFloatingButton — sticky bottom-right
   Persistent across all pages.
───────────────────────────────────────────── */
interface AffiliateFloatingButtonProps {
  partner?: AffiliatePartnerId | 'auto';
}

export function AffiliateFloatingButton({ partner = 'auto' }: AffiliateFloatingButtonProps) {
  const resolved = resolvePartnerProp(partner);
  const isFortuna = resolved === 'fortuna';
  const linkProps = getAffiliateLinkProps(resolved);

  return (
    <a
      {...linkProps}
      className={[
        'fixed bottom-20 right-4 z-40 lg:bottom-6',
        'flex items-center gap-2',
        'px-4 py-3 text-xs font-black uppercase tracking-widest',
        'border-2 border-black shadow-lg',
        'active:scale-95',
        'transition-all duration-200 cursor-pointer',
        isFortuna
          ? 'partner-fortuna bg-[var(--partner-brand)] text-[var(--partner-on-brand)] hover:opacity-95'
          : 'bg-[#ff0033] text-white hover:bg-[#cc0029] hover:scale-105 rounded-lg',
      ].join(' ')}
      style={isFortuna ? { borderRadius: 0 } : undefined}
      aria-label={isFortuna ? 'Hrať u Fortuny' : 'Get casino bonus'}
    >
      {isFortuna ? AFFILIATE_CTA.fortunaFloating : AFFILIATE_CTA.floating}
    </a>
  );
}

/* ─────────────────────────────────────────────
   AffiliateSidebarCTA — sidebar promo block
───────────────────────────────────────────── */
export function AffiliateSidebarCTA() {
  const fortuna = isFortunaAffinityActive();

  return (
    <div
      className={
        fortuna
          ? 'partner-fortuna mx-3 mb-4 border-[3px] border-[var(--partner-brand)] bg-[var(--partner-surface)] p-3 shadow-[4px_4px_0_var(--partner-brand)]'
          : 'mx-3 mb-4 border-[3px] border-[#ff0033] bg-black p-3 shadow-[4px_4px_0_#ff0033]'
      }
    >
      <p
        className={
          fortuna
            ? 'mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--partner-brand)]'
            : 'mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#ff0033]'
        }
      >
        {fortuna ? 'Oficiálny partner' : 'Exkluzívny bonus'}
      </p>
      <p className="mb-3 text-[11px] font-bold text-[#dedbd3] leading-tight">
        {fortuna
          ? 'Hraj za skutočné peniaze u Fortuny — sponsored outbound.'
          : 'Zaregistruj sa a získaj uvítací bonus pre nových hráčov!'}
      </p>
      <AffiliateButton
        label={fortuna ? AFFILIATE_CTA.fortunaBonus : '🔥 Získaj bonus'}
        variant="primary"
        size="sm"
        fullWidth
        partner={fortuna ? 'fortuna' : 'default'}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   AffiliateGameCTA — game card / game page CTA
───────────────────────────────────────────── */
interface AffiliateGameCTAProps {
  gameName?: string;
}

export function AffiliateGameCTA({ gameName }: AffiliateGameCTAProps) {
  const fortuna = isFortunaAffinityActive();
  const label = fortuna
    ? gameName
      ? `Hrať ${gameName} u Fortuny`
      : AFFILIATE_CTA.fortunaPrimary
    : gameName
      ? `💸 Hrať ${gameName} za real`
      : '💸 Hrať za skutočné peniaze';

  return (
    <AffiliateButton
      label={label}
      variant="primary"
      size="lg"
      fullWidth
      partner={fortuna ? 'fortuna' : 'default'}
    />
  );
}

/* ─────────────────────────────────────────────
   PartnerStrip — marketing / catalog affinity strip
   Place OUTSIDE hero brand block (e.g. under trust ticker).
   Renders nothing until Fortuna affinity is active.
───────────────────────────────────────────── */
interface PartnerStripProps {
  className?: string;
  message?: string;
}

export function PartnerStrip({ className = '', message }: PartnerStripProps) {
  if (!isFortunaAffinityActive()) return null;

  const linkProps = getAffiliateLinkProps('fortuna');
  const text = message ?? AFFILIATE_CTA.fortunaStrip;

  return (
    <aside
      className={`partner-fortuna w-full border-y border-[var(--partner-border)] bg-[var(--partner-surface)] ${className}`}
      aria-label="Oficiálny partner Fortuna"
    >
      <a
        {...linkProps}
        className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--partner-brand)] hover:opacity-90 sm:px-6"
      >
        <span className="truncate">{text}</span>
        <span className="shrink-0 bg-[var(--partner-brand)] px-3 py-1.5 text-[var(--partner-on-brand)]">
          Hrať →
        </span>
      </a>
    </aside>
  );
}

export { AFFILIATE_URL, isFortunaAffinityActive };
