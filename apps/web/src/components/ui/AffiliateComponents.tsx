import React from 'react';
import { AFFILIATE_URL, AFFILIATE_LINK_PROPS } from '@/lib/affiliate';

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
  trackingLabel?: string; // for future analytics
}

export function AffiliateButton({
  label = '🎰 Hrať za skutočné peniaze',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}: AffiliateButtonProps) {
  const base = [
    'inline-flex items-center justify-center font-black uppercase tracking-widest',
    'transition-all duration-100 cursor-pointer select-none',
    'border-[3px] border-black',
    'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
    'focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:ring-offset-2 focus:ring-offset-black',
    fullWidth ? 'w-full' : '',
  ].join(' ');

  const variants = {
    primary:   'bg-[#ff0033] text-white shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-x-px hover:-translate-y-px',
    secondary: 'bg-black text-[#ff0033] shadow-[4px_4px_0_#ff0033] hover:shadow-[6px_6px_0_#ff0033] hover:-translate-x-px hover:-translate-y-px',
    compact:   'bg-[#ff0033] text-white border-[2px] shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000]',
    ghost:     'bg-transparent text-[#ff0033] border-[#ff0033] hover:bg-[#ff0033] hover:text-black',
  };

  const sizes = {
    sm:  'px-3 py-1.5 text-[10px] gap-1',
    md:  'px-5 py-2.5 text-xs gap-1.5',
    lg:  'px-7 py-3.5 text-sm gap-2',
    xl:  'px-10 py-5 text-base gap-2',
  };

  return (
    <a
      {...AFFILIATE_LINK_PROPS}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={`Affiliate link: ${label}`}
    >
      {label}
    </a>
  );
}

/* ─────────────────────────────────────────────
   AffiliateTextLink — inline text link
───────────────────────────────────────────── */
interface AffiliateTextLinkProps {
  children: React.ReactNode;
  className?: string;
}

export function AffiliateTextLink({ children, className = '' }: AffiliateTextLinkProps) {
  return (
    <a
      {...AFFILIATE_LINK_PROPS}
      className={`text-[#ff0033] font-bold underline underline-offset-2 hover:text-[#cc0029] transition-colors ${className}`}
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
  variant?: 'blood' | 'warning';
}

export function AffiliateBanner({
  message = '🎁 Získaj exkluzívny uvítací bonus pre nových hráčov!',
  ctaLabel = '→ Zaregistruj sa teraz',
  variant = 'blood',
}: AffiliateBannerProps) {
  const styles = {
    blood:   'bg-[#ff0033] text-white border-b-4 border-black',
    warning: 'bg-[#ffd700] text-black border-b-4 border-black',
  };

  return (
    <a
      {...AFFILIATE_LINK_PROPS}
      className={`flex items-center justify-center gap-4 px-4 py-2 text-sm font-black uppercase tracking-wider cursor-pointer hover:opacity-90 transition-opacity ${styles[variant]}`}
      aria-label="Affiliate promotion banner"
    >
      <span>{message}</span>
      <span className="font-black underline">{ctaLabel}</span>
    </a>
  );
}

/* ─────────────────────────────────────────────
   AffiliateFloatingButton — sticky bottom-right
   Persistent across all pages.
───────────────────────────────────────────── */
export function AffiliateFloatingButton() {
  return (
    <a
      {...AFFILIATE_LINK_PROPS}
      className={[
        'fixed bottom-20 right-4 z-50 lg:bottom-6',
        'flex items-center gap-2',
        'bg-[#ff0033] text-white',
        'px-4 py-3 text-xs font-black uppercase tracking-widest',
        'border-[3px] border-black shadow-[4px_4px_0_#000]',
        'hover:shadow-[6px_6px_0_#000] hover:-translate-x-px hover:-translate-y-px',
        'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
        'transition-all duration-100 cursor-pointer',
        'animate-[brutal-pulse_3s_ease-in-out_infinite]',
      ].join(' ')}
      aria-label="Get casino bonus"
    >
      💰 BONUS
    </a>
  );
}

/* ─────────────────────────────────────────────
   AffiliateSidebarCTA — sidebar promo block
───────────────────────────────────────────── */
export function AffiliateSidebarCTA() {
  return (
    <div className="mx-3 mb-4 border-[3px] border-[#ff0033] bg-black p-3 shadow-[4px_4px_0_#ff0033]">
      <p className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#ff0033]">
        Exkluzívny bonus
      </p>
      <p className="mb-3 text-[11px] font-bold text-[#dedbd3] leading-tight">
        Zaregistruj sa a získaj uvítací bonus pre nových hráčov!
      </p>
      <AffiliateButton
        label="🔥 Získaj bonus"
        variant="primary"
        size="sm"
        fullWidth
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
  const label = gameName ? `💸 Hrať ${gameName} za real` : '💸 Hrať za skutočné peniaze';
  return (
    <AffiliateButton
      label={label}
      variant="primary"
      size="lg"
      fullWidth
    />
  );
}

export { AFFILIATE_URL };
