import Link from "next/link";

const ITEMS = [
  { label: "18+", href: "/responsible-gaming" },
  { label: "DEMO ONLY", href: null },
  { label: "NO DEPOSIT", href: null },
  { label: "NO REGISTRATION", href: null },
  { label: "INSTANT PLAY", href: null },
] as const;

export function LandingTrustTicker() {
  const row = (
    <>
      {ITEMS.map((item, i) => (
        <span key={`${item.label}-${i}`} className="inline-flex items-center gap-4 px-4">
          {item.href ? (
            <Link
              href={item.href}
              className="landing-hud-link font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--landing-brand)]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--landing-text)]">
              {item.label}
            </span>
          )}
          <span className="text-[var(--landing-hud-mark)]" aria-hidden>
            /
          </span>
        </span>
      ))}
    </>
  );

  return (
    <section
      aria-label="Trust markers"
      className="border-y border-[var(--landing-border)] bg-[var(--landing-surface)]"
    >
      <div className="mx-auto flex max-w-[1400px] overflow-x-auto whitespace-nowrap px-2 py-3 [scrollbar-width:none] sm:justify-center sm:overflow-visible sm:whitespace-normal">
        <div className="inline-flex items-center">{row}</div>
      </div>
    </section>
  );
}
