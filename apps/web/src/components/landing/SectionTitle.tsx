interface SectionTitleProps {
  index: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export function SectionTitle({ index, title, href, linkLabel }: SectionTitleProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-[var(--landing-border)] pb-3">
      <h2 className="landing-display text-2xl font-black tracking-tight text-[var(--landing-text)] md:text-3xl">
        <span className="text-[var(--landing-brand)]">{title}</span>
        <span className="text-[var(--landing-muted)]"> / {index}</span>
      </h2>
      {href ? (
        <a
          href={href}
          className="landing-hud-link shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--landing-muted)] hover:text-[var(--landing-brand)]"
        >
          {linkLabel ?? "Všetko →"}
        </a>
      ) : null}
    </div>
  );
}
