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

function TrendingCard({ game, rank, priority }: { game: GameSummary; rank: string; priority?: boolean }) {
  return (
    <Link
      href={game.canonicalPath}
      className="landing-card-art group relative block border border-[var(--landing-border)] bg-[var(--landing-surface)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        {game.thumbnail.src ? (
          <Image
            src={game.thumbnail.src}
            alt={game.thumbnail.alt || game.name}
            fill
            sizes="(max-width: 768px) 90vw, 33vw"
            className="landing-zoom object-cover"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-[var(--landing-muted)]">
            NO ART
          </div>
        )}
        <span className="absolute left-3 top-3 font-mono text-xs tracking-[0.2em] text-[var(--landing-brand)]">
          {rank}
        </span>
        {game.featured || game.upcoming ? (
          <span className="absolute right-0 top-0 bg-[var(--landing-brand)] px-2 py-1 text-[9px] font-black tracking-widest text-[var(--landing-text-on-brand)]">
            {game.upcoming ? "NEW" : "HOT"}
          </span>
        ) : null}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-black/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--landing-text)] transition-transform group-hover:translate-y-0">
          SPUSTIŤ DEMO →
        </span>
      </div>
      <div className="space-y-1 p-3">
        <h3 className="truncate text-sm font-bold text-[var(--landing-text)]">{game.name}</h3>
        <p className="truncate text-[11px] uppercase tracking-wider text-[var(--landing-muted)]">
          {game.provider?.name ?? "—"}
        </p>
        {metaLine(game) ? (
          <p className="font-mono text-[10px] tracking-wider text-[var(--landing-hud-mark)]">{metaLine(game)}</p>
        ) : null}
      </div>
    </Link>
  );
}

export function LandingTrending({ games }: { games: GameSummary[] }) {
  if (games.length === 0) return null;
  const items = games.slice(0, 6);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle index="01" title="TRENDING" href="/games?orderBy=trending" linkLabel="Celý chart →" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((game, i) => (
          <TrendingCard
            key={game.id}
            game={game}
            rank={String(i + 1).padStart(2, "0")}
            priority={i < 2}
          />
        ))}
      </div>
    </section>
  );
}
