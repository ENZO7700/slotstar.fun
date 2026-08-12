import Link from "next/link";
import { AffiliateButton } from "@/components/ui/AffiliateComponents";
import { AFFILIATE_CTA } from "@/lib/affiliate";

const CATALOG = [
  { href: "/games", label: "Všetky hry" },
  { href: "/new-games", label: "Novinky" },
  { href: "/featured", label: "Featured" },
  { href: "/providers", label: "Provideri" },
] as const;

const INFO = [
  { href: "/blog", label: "Blog" },
  { href: "/responsible-gaming", label: "Zodpovedné hranie" },
  { href: "/privacy", label: "Súkromie" },
  { href: "/terms", label: "Podmienky" },
] as const;

export function LandingFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--landing-border)] bg-black">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Link href="/" className="landing-display text-2xl font-black">
            <span className="text-[var(--landing-brand)]">SLOT</span>
            <span className="text-[var(--landing-text)]">STAR</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-[var(--landing-muted)]">
            Slovenský demo casino katalóg. Gaming discovery magazine — nie generický affiliate casino web.
          </p>
        </div>

        <div>
          <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-[var(--landing-brand)]">KATALÓG</p>
          <ul className="space-y-2">
            {CATALOG.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-[var(--landing-muted)] hover:text-[var(--landing-text)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-[var(--landing-brand)]">INFO</p>
          <ul className="space-y-2">
            {INFO.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-[var(--landing-muted)] hover:text-[var(--landing-text)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-[var(--landing-brand)]">
            LEGAL / AFFILIATE
          </p>
          <p className="mb-4 text-sm text-[var(--landing-muted)]">
            Demo first. Real-money outbound je sponsored.
          </p>
          <AffiliateButton label={AFFILIATE_CTA.footer} variant="ghost" size="sm" />
        </div>
      </div>

      <div className="border-t border-[var(--landing-border)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-4 text-xs text-[var(--landing-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} SlotStar. Demo only.</p>
          <p className="font-mono tracking-[0.2em] text-[var(--landing-brand)]">18+</p>
        </div>
      </div>
    </footer>
  );
}
