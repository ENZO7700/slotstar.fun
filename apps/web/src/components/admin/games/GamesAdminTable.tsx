"use client";

import type { GameAdminStatus, GameTag } from "@/types/admin";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { GlassCard } from "@/components/admin/ui/GlassCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

const STATUSES: GameAdminStatus[] = ["ACTIVE", "DISABLED", "MAINTENANCE"];
const TAGS: GameTag[] = ["Featured", "New", "Bonus Buy", "Popular", "Gold Tier"];

export function GamesAdminTable() {
  const { data, setGameStatus, toggleGameTag, role } = useNexusAdmin();
  const canEdit = role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider">
          Game Manager
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Toggle slot status and catalog tags{" "}
          {!canEdit ? "(view-only for your role)" : ""}
        </p>
      </div>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
            <tr>
              <th className="p-4">Game</th>
              <th className="p-4">Provider</th>
              <th className="p-4">RTP</th>
              <th className="p-4">30d Plays</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {data.games.map((g) => (
              <tr key={g.id} className="hover:bg-zinc-900/40">
                <td className="p-4 font-bold text-white">{g.title}</td>
                <td className="p-4 text-zinc-400">{g.provider}</td>
                <td className="p-4 font-mono">{g.rtp.toFixed(2)}%</td>
                <td className="p-4">{g.playCount30d.toLocaleString()}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <StatusBadge status={g.status} />
                    {canEdit ? (
                      <div className="flex flex-wrap gap-1">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            disabled={g.status === s}
                            onClick={() => setGameStatus(g.id, s)}
                            className="px-2 py-0.5 rounded border border-zinc-700 text-[10px] font-bold disabled:opacity-40 hover:border-amber-500/50"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {TAGS.map((tag) => {
                      const on = g.tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          disabled={!canEdit}
                          onClick={() => toggleGameTag(g.id, tag)}
                          className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                            on
                              ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                              : "border-zinc-800 text-zinc-500"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
