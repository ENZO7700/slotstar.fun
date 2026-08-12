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

function RailCard({ game }: { game: GameSummary }) {
  return (
    <Link
      href={game.canonicalPath}
      className="landing-card-art group w-[160px] shrink-0 border border-[var(--landing-border)] bg-[var(--landing-surface)] sm:w-[180px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black">
        {game.thumbnail.src ? (
          <Image
            src={game.thumbnail.src}
            alt={game.thumbnail.alt || game.name}
            fill
            sizes="180px"
            className="landing-zoom object-cover"
          />
        ) : null}
      </div>
      <div className="space-y-1 p-2.5">
        <h3 className="truncate text-xs font-bold text-[var(--landing-text)]">{game.name}</h3>
        <p className="truncate text-[10px] uppercase tracking-wider text-[var(--landing-muted)]">
          {game.provider?.name ?? "—"}
        </p>
        {metaLine(game) ? (
          <p className="font-mono text-[9px] text-[var(--landing-hud-mark)]">{metaLine(game)}</p>
        ) : null}
      </div>
    </Link>
  );
}

export function LandingNew({ games }: { games: GameSummary[] }) {
  if (games.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle index="03" title="NEW" href="/new-games" linkLabel="Všetky novinky →" />
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0">
        {games.slice(0, 12).map((game) => (
          <RailCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
