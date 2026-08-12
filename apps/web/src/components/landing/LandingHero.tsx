import Link from "next/link";
import { LandingStarDrift } from "./LandingStarDrift";

interface LandingHeroProps {
  totalGames?: number | null;
}

export function LandingHero({ totalGames }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="landing-noise" aria-hidden />
      <div className="landing-hero-radial" aria-hidden />
      <LandingStarDrift />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="landing-hud landing-hero-reveal relative min-h-[70vh] overflow-hidden p-6 sm:p-10 lg:p-14">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--landing-hud-mark)]">
            {"// SLOTSTAR · DEMO CATALOGUE"}
          </p>

          <h1 className="landing-display max-w-[12ch] text-[clamp(3.5rem,16vw,9.5rem)] font-black leading-[0.85] tracking-[-0.04em]">
            <span className="text-[var(--landing-brand)]">SLOT</span>
            <span className="relative inline-block translate-x-[0.02em] tracking-[0.02em] text-[var(--landing-text)]">
              STAR
            </span>
          </h1>

          <div className="mt-6 max-w-xl space-y-1">
            <p className="landing-display text-lg font-extrabold tracking-[0.08em] text-[var(--landing-text)] sm:text-2xl">
              SLOVENSKÝ
            </p>
            <p className="landing-display text-lg font-extrabold tracking-[0.08em] text-[var(--landing-text)] sm:text-2xl">
              DEMO CASINO
            </p>
            <p className="landing-display text-lg font-extrabold tracking-[0.08em] text-[var(--landing-brand)] sm:text-2xl">
              KATALÓG
            </p>
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--landing-muted)] sm:text-base">
            Hraj zdarma. Porovnávaj RTP. Objavuj nové sloty.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href="/games"
              className="landing-display inline-flex items-center bg-[var(--landing-brand)] px-7 py-3.5 text-sm font-black tracking-[0.18em] text-[var(--landing-text-on-brand)] hover:opacity-95"
            >
              HRAŤ DEMO →
            </Link>
            <Link
              href="/new-games"
              className="landing-hud-link text-xs font-bold uppercase tracking-[0.22em] text-[var(--landing-text)] hover:text-[var(--landing-brand)]"
            >
              OBJAVIŤ NOVINKY ↗
            </Link>
          </div>

          {typeof totalGames === "number" && totalGames > 0 ? (
            <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-[var(--landing-hud-mark)]">
              {`// ${totalGames}+ DEMO HIER`}
            </p>
          ) : null}

          <p className="mt-4 font-mono text-[10px] tracking-[0.18em] text-[var(--landing-muted)]">
            {"// 18+ · DEMO ONLY · NO DEPOSIT"}
          </p>
        </div>
      </div>
    </section>
  );
}
