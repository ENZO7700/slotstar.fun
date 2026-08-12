import Link from "next/link";

export function LandingFinalCta() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden border border-[var(--landing-brand)] bg-black px-6 py-16 sm:px-12 sm:py-20">
        <span
          className="landing-display pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 text-[clamp(6rem,22vw,14rem)] font-black leading-none text-white/[0.04]"
          aria-hidden
        >
          PLAY
        </span>
        <div className="relative z-10 max-w-xl space-y-3">
          <p className="landing-display text-4xl font-black text-[var(--landing-text)] sm:text-5xl">READY?</p>
          <p className="landing-display text-3xl font-black text-[var(--landing-brand)] sm:text-4xl">
            SPUSTI SI DEMO.
          </p>
          <Link
            href="/games"
            className="landing-display mt-6 inline-flex bg-[var(--landing-brand)] px-8 py-4 text-sm font-black tracking-[0.2em] text-[var(--landing-text-on-brand)]"
          >
            HRAŤ DEMO →
          </Link>
        </div>
      </div>
    </section>
  );
}
