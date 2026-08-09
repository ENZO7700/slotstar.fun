"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { GlassCard } from "@/components/admin/ui/GlassCard";

export function FreeSpinModal({
  playerId,
  onClose,
}: {
  playerId?: string;
  onClose: () => void;
}) {
  const { data, grantFreeSpins, role } = useNexusAdmin();
  const [selectedPlayer, setSelectedPlayer] = useState(
    playerId || data.players[0]?.id || ""
  );
  const [query, setQuery] = useState("");
  const [gameId, setGameId] = useState(data.games[0]?.id || "");
  const [spinCount, setSpinCount] = useState(20);
  const [betValue, setBetValue] = useState(0.2);
  const [wagering, setWagering] = useState(35);
  const [expiryDays, setExpiryDays] = useState(7);
  const [message, setMessage] = useState("");

  const games = useMemo(() => {
    const q = query.toLowerCase();
    return data.games.filter(
      (g) =>
        g.status === "ACTIVE" &&
        (!q || g.title.toLowerCase().includes(q) || g.provider.toLowerCase().includes(q))
    );
  }, [data.games, query]);

  const game = data.games.find((g) => g.id === gameId);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-lg p-6 space-y-4 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-white"
        >
          <X size={16} />
        </button>
        <div>
          <h2 className="text-lg font-black uppercase tracking-wider text-white">
            Assign Free Spins
          </h2>
          <p className="text-xs text-zinc-500">
            Role: {role} {role === "SUPPORT_AGENT" ? "(max 20 FS)" : ""}
          </p>
        </div>

        {!playerId ? (
          <label className="block text-xs space-y-1">
            <span className="text-zinc-500 font-bold uppercase">Player</span>
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            >
              {data.players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.username}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="block text-xs space-y-1">
          <span className="text-zinc-500 font-bold uppercase">Search game</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gates of Olympus, Starburst…"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
          />
        </label>

        <label className="block text-xs space-y-1">
          <span className="text-zinc-500 font-bold uppercase">Game</span>
          <select
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
          >
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title} ({g.provider})
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs space-y-1">
            <span className="text-zinc-500 font-bold uppercase">Spin count</span>
            <select
              value={spinCount}
              onChange={(e) => setSpinCount(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs space-y-1">
            <span className="text-zinc-500 font-bold uppercase">Bet value</span>
            <select
              value={betValue}
              onChange={(e) => setBetValue(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            >
              {[0.1, 0.2, 0.5, 1, 2].map((n) => (
                <option key={n} value={n}>
                  €{n.toFixed(2)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-500 font-bold uppercase">Wagering</span>
            <span className="text-amber-400 font-bold">{wagering}x</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            value={wagering}
            onChange={(e) => setWagering(Number(e.target.value))}
            className="w-full"
          />
        </label>

        <label className="block text-xs space-y-1">
          <span className="text-zinc-500 font-bold uppercase">Expiry (days)</span>
          <input
            type="number"
            min={1}
            value={expiryDays}
            onChange={(e) => setExpiryDays(Number(e.target.value))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
          />
        </label>

        {message ? <p className="text-xs text-zinc-300">{message}</p> : null}

        <button
          type="button"
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 rounded-lg text-sm"
          onClick={async () => {
            if (!game) return;
            const res = await grantFreeSpins({
              playerId: selectedPlayer,
              gameId: game.id,
              gameTitle: game.title,
              spinCount,
              betValue,
              wageringRequirement: wagering,
              expiryDays,
            });
            setMessage(
              res.success
                ? `Granted ${spinCount} FS on ${game.title}`
                : res.message || "Failed"
            );
            if (res.success) setTimeout(onClose, 700);
          }}
        >
          Issue Free Spins
        </button>
      </GlassCard>
    </div>
  );
}
