import Link from "next/link";
import { SectionTitle } from "./SectionTitle";

const STEPS = [
  { id: "01", title: "VYBER HRU", body: "Katalóg tisícok demo slotov podľa providera, RTP a volatility." },
  { id: "02", title: "SPUSŤ DEMO", body: "Okamžité hranie v prehliadači. Bez registrácie, bez vkladu." },
  { id: "03", title: "POROVNAJ", body: "RTP, volatilita a provider na jednom mieste — rozhoduj sa dátami." },
] as const;

export function LandingHow() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle index="05" title="HOW" />
      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.id} className="border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6">
            <p className="font-mono text-xs tracking-[0.25em] text-[var(--landing-brand)]">{step.id}</p>
            <h3 className="landing-display mt-3 text-2xl font-black text-[var(--landing-text)]">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--landing-muted)]">{step.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/games"
          className="landing-display inline-flex border border-[var(--landing-border)] px-6 py-3 text-xs font-black tracking-[0.2em] text-[var(--landing-text)] hover:border-[var(--landing-brand)] hover:text-[var(--landing-brand)]"
        >
          DO KATALÓGU →
        </Link>
      </div>
    </section>
  );
}
