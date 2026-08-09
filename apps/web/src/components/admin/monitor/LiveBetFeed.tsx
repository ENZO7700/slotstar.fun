"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { pushLiveBetTickAction } from "@/actions/adminActions";
import { GlassCard } from "@/components/admin/ui/GlassCard";

export function LiveBetFeed() {
  const { data, refresh } = useNexusAdmin();
  const [bigOnly, setBigOnly] = useState(false);
  const [botsOnly, setBotsOnly] = useState(false);

  useEffect(() => {
    const id = setInterval(async () => {
      await pushLiveBetTickAction();
      await refresh();
    }, 2200);
    return () => clearInterval(id);
  }, [refresh]);

  const rows = useMemo(() => {
    return data.liveBets
      .filter((b) => {
        if (bigOnly && b.multiplier < 100) return false;
        if (botsOnly && !b.suspicious) return false;
        return true;
      })
      .slice(0, 15);
  }, [data.liveBets, bigOnly, botsOnly]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider">
            Live Bet Monitor
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time ticker · capped at 15 rows for 60fps smoothness
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setBigOnly((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
              bigOnly
                ? "border-amber-500/50 text-amber-400 bg-amber-500/10"
                : "border-zinc-800 text-zinc-400"
            }`}
          >
            Big Wins (&gt;100x)
          </button>
          <button
            type="button"
            onClick={() => setBotsOnly((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
              botsOnly
                ? "border-red-800 text-[#ff0033] bg-red-950/30"
                : "border-zinc-800 text-zinc-400"
            }`}
          >
            Bot activity
          </button>
        </div>
      </div>

      <GlassCard className="p-4 space-y-2 min-h-[480px]">
        <AnimatePresence initial={false}>
          {rows.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center justify-between text-xs border rounded-lg px-3 py-2.5 ${
                b.suspicious
                  ? "border-red-900 bg-red-950/20"
                  : b.multiplier >= 100
                    ? "border-emerald-900 bg-emerald-950/20"
                    : "border-zinc-800 bg-zinc-950/40"
              }`}
            >
              <div>
                <p className="font-bold text-white">
                  {b.username}{" "}
                  {b.suspicious ? (
                    <span className="text-[#ff0033] text-[10px]">BOT?</span>
                  ) : null}
                </p>
                <p className="text-zinc-500">{b.gameTitle}</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-400">Bet €{b.betAmount.toFixed(2)}</p>
                <p
                  className={
                    b.multiplier >= 100
                      ? "text-win font-black"
                      : "text-zinc-200 font-bold"
                  }
                >
                  {b.multiplier.toFixed(1)}x · €{b.winAmount.toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}
