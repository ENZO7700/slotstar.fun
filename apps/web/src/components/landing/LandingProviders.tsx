import Link from "next/link";
import type { Provider } from "@/types/provider";
import { SectionTitle } from "./SectionTitle";

export function LandingProviders({ providers }: { providers: Provider[] }) {
  if (providers.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle index="04" title="PROVIDERS" href="/providers" linkLabel="VŠETCI POSKYTOVATELIA →" />
      <div className="grid grid-cols-2 gap-px bg-[var(--landing-border)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {providers.slice(0, 12).map((provider) => (
          <Link
            key={provider.id}
            href={`/providers/${provider.slug}`}
            className="flex min-h-[88px] items-center justify-center bg-[var(--landing-bg)] px-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-[var(--landing-muted)] transition-colors hover:bg-white hover:text-black hover:outline hover:outline-1 hover:outline-[var(--landing-brand)]"
          >
            {provider.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
