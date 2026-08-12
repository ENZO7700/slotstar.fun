import Link from "next/link";

const CATEGORIES = [
  { id: "01", label: "ALL", href: "/games" },
  { id: "02", label: "TRENDING", href: "/games?orderBy=trending" },
  { id: "03", label: "NEW", href: "/new-games" },
  { id: "04", label: "FEATURED", href: "/featured" },
  { id: "05", label: "UPCOMING", href: "/upcoming" },
  { id: "06", label: "PROVIDERS", href: "/providers" },
] as const;

export function LandingCategoryNav() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <nav
        aria-label="Katalóg kategórie"
        className="flex flex-wrap gap-x-6 gap-y-4 border-b border-[var(--landing-border)] pb-1"
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative pb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--landing-muted)] hover:text-[var(--landing-text)]"
          >
            <span className="mr-2 text-[var(--landing-brand)] opacity-70 group-hover:opacity-100">
              {cat.id}
            </span>
            {cat.label}
            <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[var(--landing-brand)] transition-transform group-hover:scale-x-100" />
          </Link>
        ))}
      </nav>
    </section>
  );
}
