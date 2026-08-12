import Image from "next/image";
import Link from "next/link";
import type { GameSummary } from "@/types/game";
import { SectionTitle } from "./SectionTitle";

function metaLine(game: GameSummary) {
  const parts = [game.rtp ? `RTP ${game.rtp}` : null, game.volatility ? `VOL ${game.volatility}` : null].filter(
    Boolean,
  );
  return parts.join(" · ");
}

export function LandingFeatured({ games }: { games: GameSummary[] }) {
  if (games.length === 0) return null;

  const [hero, ...rest] = games;
  const side = rest.slice(0, 4);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle index="02" title="FEATURED" href="/featured" linkLabel="Všetky featured →" />

      <div className="grid gap-4 lg:grid-cols-12">
        <Link
          href={hero.canonicalPath}
          className="landing-card-art group border border-[var(--landing-brand)] bg-[var(--landing-surface)] lg:col-span-7"
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-black lg:aspect-auto lg:min-h-[420px]">
            {hero.thumbnail.src ? (
              <Image
                src={hero.thumbnail.src}
                alt={hero.thumbnail.alt || hero.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="landing-zoom object-cover"
                priority
              />
            ) : null}
          </div>
          <div className="space-y-3 p-5">
            <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--landing-brand)]">EDITOR PICK</p>
            <h3 className="landing-display text-3xl font-black text-[var(--landing-text)]">{hero.name}</h3>
            <p className="text-xs uppercase tracking-wider text-[var(--landing-muted)]">
              {hero.provider?.name ?? "—"}
              {metaLine(hero) ? ` · ${metaLine(hero)}` : ""}
            </p>
            <span className="inline-flex bg-[var(--landing-brand)] px-4 py-2 text-[11px] font-black tracking-widest text-[var(--landing-text-on-brand)]">
              SPUSTIŤ DEMO →
            </span>
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-3 lg:col-span-5 lg:grid-cols-1">
          {side.map((game) => (
            <Link
              key={game.id}
              href={game.canonicalPath}
              className="landing-card-art group flex gap-3 border border-[var(--landing-border)] bg-[var(--landing-surface)] p-2 hover:border-[var(--landing-brand)]"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-black sm:h-24 sm:w-36">
                {game.thumbnail.src ? (
                  <Image
                    src={game.thumbnail.src}
                    alt={game.thumbnail.alt || game.name}
                    fill
                    sizes="144px"
                    className="landing-zoom object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 py-1">
                <h3 className="truncate text-sm font-bold text-[var(--landing-text)]">{game.name}</h3>
                <p className="truncate text-[11px] text-[var(--landing-muted)]">{game.provider?.name ?? "—"}</p>
                {metaLine(game) ? (
                  <p className="mt-1 font-mono text-[10px] text-[var(--landing-hud-mark)]">{metaLine(game)}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
