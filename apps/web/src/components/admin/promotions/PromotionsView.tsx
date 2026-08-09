"use client";

import { useState } from "react";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { GlassCard } from "@/components/admin/ui/GlassCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { FreeSpinModal } from "./FreeSpinModal";

export function PromotionsView() {
  const { data, toggleCampaign } = useNexusAdmin();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider">
            Free Spins & Campaigns
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Pause/resume promos and issue targeted free spins
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-amber-500 text-black text-xs font-black px-4 py-2 rounded-lg"
        >
          Quick Assign Free Spins
        </button>
      </div>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
            <tr>
              <th className="p-4">Campaign</th>
              <th className="p-4">Type</th>
              <th className="p-4">Code</th>
              <th className="p-4">Redemptions</th>
              <th className="p-4">WR</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {data.campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-900/40">
                <td className="p-4">
                  <p className="font-bold text-white">{c.name}</p>
                  <p className="text-zinc-500">
                    {c.gameTitle
                      ? `${c.spinCount} FS · ${c.gameTitle}`
                      : c.matchPercent
                        ? `${c.matchPercent}% match`
                        : c.cashbackPercent
                          ? `${c.cashbackPercent}% cashback`
                          : "—"}
                  </p>
                </td>
                <td className="p-4">{c.type}</td>
                <td className="p-4 font-mono text-amber-400">{c.promoCode}</td>
                <td className="p-4">
                  {c.redemptions}/{c.maxRedemptions}
                </td>
                <td className="p-4">{c.wageringRequirement}x</td>
                <td className="p-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="p-4">
                  {c.status !== "EXPIRED" ? (
                    <button
                      type="button"
                      onClick={() => toggleCampaign(c.id)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-700 text-[11px] font-bold hover:border-amber-500/50"
                    >
                      {c.status === "ACTIVE" ? "Pause" : "Resume"}
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <GlassCard className="p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Recent free spin grants
        </p>
        <div className="space-y-2">
          {data.freeSpins.slice(0, 8).map((f) => (
            <div
              key={f.id}
              className="flex justify-between text-xs border border-zinc-800 rounded-lg px-3 py-2"
            >
              <div>
                <p className="font-bold text-white">
                  {f.playerId} · {f.gameTitle}
                </p>
                <p className="text-zinc-500">
                  {f.spinCount} spins @ €{f.betValue} · WR {f.wageringRequirement}x · by{" "}
                  {f.grantedBy}
                </p>
              </div>
              <StatusBadge status={f.status} />
            </div>
          ))}
        </div>
      </GlassCard>

      {showModal ? <FreeSpinModal onClose={() => setShowModal(false)} /> : null}
    </div>
  );
}
