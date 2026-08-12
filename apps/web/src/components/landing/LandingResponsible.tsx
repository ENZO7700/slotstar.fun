import Link from "next/link";

export function LandingResponsible() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="border border-[var(--landing-border)] bg-[var(--landing-surface)] px-6 py-8">
        <p className="landing-display text-xl font-black tracking-[0.12em] text-[var(--landing-text)]">
          PLAY RESPONSIBLY <span className="text-[var(--landing-brand)]">/ 18+</span>
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--landing-muted)]">
          SlotStar je demo katalóg. Žiadne reálne stávky, žiadne výhry. Hraj zodpovedne.
        </p>
        <Link
          href="/responsible-gaming"
          className="landing-hud-link mt-5 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--landing-text)]"
        >
          ZODPOVEDNÉ HRANIE →
        </Link>
      </div>
    </section>
  );
}
