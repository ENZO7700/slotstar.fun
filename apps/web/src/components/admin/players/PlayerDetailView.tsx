"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { GlassCard } from "@/components/admin/ui/GlassCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { FreeSpinModal } from "@/components/admin/promotions/FreeSpinModal";

const TABS = [
  "Transactions",
  "Bets",
  "Free Spins & Bonuses",
  "KYC Documents",
  "Responsible Gaming",
] as const;

export function PlayerDetailView({ playerId }: { playerId: string }) {
  const { data, creditBalance, suspendPlayer, approveKyc, role } = useNexusAdmin();
  const player = data.players.find((p) => p.id === playerId);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Transactions");
  const [showFs, setShowFs] = useState(false);
  const [amount, setAmount] = useState("50");
  const [msg, setMsg] = useState("");

  const txs = useMemo(
    () => data.transactions.filter((t) => t.playerId === playerId),
    [data.transactions, playerId]
  );
  const bets = useMemo(
    () => data.bets.filter((b) => b.playerId === playerId),
    [data.bets, playerId]
  );
  const spins = useMemo(
    () => data.freeSpins.filter((f) => f.playerId === playerId),
    [data.freeSpins, playerId]
  );

  if (!player) {
    return (
      <div className="space-y-4">
        <p className="text-alert">Player not found.</p>
        <Link href="/admin/players" className="text-amber-400 text-sm">
          Back to players
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/players"
        className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Back to CRM
      </Link>

      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={player.avatarUrl}
              alt=""
              className="w-16 h-16 rounded-xl border border-zinc-700"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white">{player.username}</h1>
                <StatusBadge status={player.status} />
                <StatusBadge status={player.kycStatus} />
                <span className="text-amber-400 text-xs font-bold">{player.vipTier}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {player.id} · {player.email} · {player.country}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowFs(true)}
              className="px-3 py-2 rounded-lg bg-amber-500 text-black text-xs font-bold"
            >
              Grant Free Spins
            </button>
            {role === "SUPER_ADMIN" || role === "RISK_MANAGER" ? (
              <button
                type="button"
                onClick={() => approveKyc(player.id)}
                className="px-3 py-2 rounded-lg border border-emerald-800 text-[#00c52a] text-xs font-bold"
              >
                Approve KYC
              </button>
            ) : null}
            {role === "SUPER_ADMIN" || role === "RISK_MANAGER" ? (
              <button
                type="button"
                onClick={() => suspendPlayer(player.id, player.status !== "SUSPENDED")}
                className="px-3 py-2 rounded-lg border border-red-800 text-[#ff0033] text-xs font-bold"
              >
                {player.status === "SUSPENDED" ? "Unblock" : "Block Account"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-[10px] uppercase text-zinc-500 font-bold">Real Balance</p>
            <p className="text-xl font-black text-win">€{player.realBalance.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-[10px] uppercase text-zinc-500 font-bold">Bonus Balance</p>
            <p className="text-xl font-black text-amber-400">
              €{player.bonusBalance.toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 col-span-2">
            <p className="text-[10px] uppercase text-zinc-500 font-bold mb-2">
              Manual credit (SuperAdmin)
            </p>
            <div className="flex gap-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs w-24"
              />
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-bold"
                onClick={async () => {
                  const res = await creditBalance(
                    player.id,
                    Number(amount),
                    "REAL",
                    "VIP Compensation"
                  );
                  setMsg(res.message || (res.success ? "Credited" : "Denied"));
                }}
              >
                + Real
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-bold"
                onClick={async () => {
                  const res = await creditBalance(
                    player.id,
                    Number(amount),
                    "BONUS",
                    "Manual bonus"
                  );
                  setMsg(res.message || (res.success ? "Credited" : "Denied"));
                }}
              >
                + Bonus
              </button>
            </div>
            {msg ? <p className="text-[11px] text-zinc-400 mt-1">{msg}</p> : null}
          </div>
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
              tab === t
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                : "border-zinc-800 text-zinc-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <GlassCard className="p-4 overflow-x-auto">
        {tab === "Transactions" && (
          <table className="w-full text-xs">
            <thead className="text-zinc-500 uppercase">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Method</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {txs.map((t) => (
                <tr key={t.id}>
                  <td className="p-2 font-mono text-zinc-400">{t.id}</td>
                  <td className="p-2">{t.type}</td>
                  <td className="p-2">€{t.amount.toFixed(2)}</td>
                  <td className="p-2">{t.method}</td>
                  <td className="p-2">
                    <StatusBadge status={t.status} />
                  </td>
                </tr>
              ))}
              {txs.length === 0 ? (
                <tr>
                  <td className="p-4 text-zinc-500" colSpan={5}>
                    No transactions
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}

        {tab === "Bets" && (
          <table className="w-full text-xs">
            <thead className="text-zinc-500 uppercase">
              <tr>
                <th className="p-2 text-left">Game</th>
                <th className="p-2 text-left">Bet</th>
                <th className="p-2 text-left">Win</th>
                <th className="p-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {bets.map((b) => (
                <tr key={b.id}>
                  <td className="p-2">{b.gameTitle}</td>
                  <td className="p-2">€{b.betAmount.toFixed(2)}</td>
                  <td className="p-2 text-win">€{b.winAmount.toFixed(2)}</td>
                  <td className="p-2 text-zinc-500">{b.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "Free Spins & Bonuses" && (
          <div className="space-y-2">
            {spins.map((f) => (
              <div
                key={f.id}
                className="border border-zinc-800 rounded-lg p-3 flex justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white">
                    {f.spinCount} FS · {f.gameTitle}
                  </p>
                  <p className="text-zinc-500">
                    €{f.betValue} / spin · WR {f.wageringRequirement}x · remaining{" "}
                    {f.remainingSpins}
                  </p>
                </div>
                <StatusBadge status={f.status} />
              </div>
            ))}
            {spins.length === 0 ? (
              <p className="text-zinc-500 text-xs">No free spins assigned</p>
            ) : null}
          </div>
        )}

        {tab === "KYC Documents" && (
          <div className="space-y-2">
            {player.kycDocuments.map((d) => (
              <div
                key={d.id}
                className="border border-zinc-800 rounded-lg p-3 flex justify-between text-xs"
              >
                <div>
                  <p className="font-bold">{d.type}</p>
                  <p className="text-zinc-500">{d.fileName}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
            {player.kycDocuments.length === 0 ? (
              <p className="text-zinc-500 text-xs">No documents uploaded</p>
            ) : null}
          </div>
        )}

        {tab === "Responsible Gaming" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="border border-zinc-800 rounded-lg p-3">
              <p className="text-zinc-500 uppercase font-bold">Daily deposit limit</p>
              <p className="text-lg font-black mt-1">
                {player.limits.dailyDepositLimit != null
                  ? `€${player.limits.dailyDepositLimit}`
                  : "None"}
              </p>
            </div>
            <div className="border border-zinc-800 rounded-lg p-3">
              <p className="text-zinc-500 uppercase font-bold">Weekly deposit limit</p>
              <p className="text-lg font-black mt-1">
                {player.limits.weeklyDepositLimit != null
                  ? `€${player.limits.weeklyDepositLimit}`
                  : "None"}
              </p>
            </div>
            <div className="border border-zinc-800 rounded-lg p-3">
              <p className="text-zinc-500 uppercase font-bold">Self-exclusion</p>
              <p className="text-lg font-black mt-1">
                {player.limits.selfExclusionUntil
                  ? player.limits.selfExclusionUntil.slice(0, 10)
                  : "Not active"}
              </p>
            </div>
          </div>
        )}
      </GlassCard>

      {showFs ? (
        <FreeSpinModal
          playerId={player.id}
          onClose={() => setShowFs(false)}
        />
      ) : null}
    </div>
  );
}
