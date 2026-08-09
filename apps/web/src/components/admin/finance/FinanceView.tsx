"use client";

import Link from "next/link";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { GlassCard } from "@/components/admin/ui/GlassCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { StatCard } from "@/components/admin/ui/StatCard";
import { RiskScoreBadge } from "@/components/admin/ui/RiskScoreBadge";

export function FinanceView() {
  const { data } = useNexusAdmin();
  const deposits = data.transactions.filter((t) => t.type === "DEPOSIT");
  const pending = data.withdrawals.filter((w) => w.status === "PENDING");
  const ggr = data.kpi.ggrToday;
  const ngr = Math.round(ggr * 0.72);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider">
          Finance & Payments
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Deposits, payouts, GGR / NGR overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="GGR Today" value={`€${ggr.toLocaleString()}`} accent="gold" />
        <StatCard label="NGR Today" value={`€${ngr.toLocaleString()}`} accent="win" hint="~72% of GGR after bonuses" />
        <StatCard
          label="Deposits Today"
          value={`€${data.kpi.depositsToday.toLocaleString()}`}
        />
        <StatCard
          label="Pending Withdrawals"
          value={String(pending.length)}
          accent="alert"
        />
      </div>

      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Pending withdrawals
          </p>
          <Link
            href="/admin/risk/withdrawals"
            className="text-xs text-amber-400 font-bold"
          >
            Open Risk Queue →
          </Link>
        </div>
        <div className="space-y-2">
          {pending.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between text-xs border border-zinc-800 rounded-lg px-3 py-2"
            >
              <div>
                <p className="font-bold text-white">
                  {w.username} · €{w.amount.toFixed(2)} {w.method}
                </p>
                <p className="text-zinc-500">{w.id}</p>
              </div>
              <RiskScoreBadge score={w.riskScore} />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Transaction log
          </p>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Player</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {data.transactions.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-900/40">
                <td className="p-3 font-mono text-zinc-400">{t.id}</td>
                <td className="p-3">{t.username}</td>
                <td className="p-3">{t.type}</td>
                <td className="p-3">€{t.amount.toFixed(2)}</td>
                <td className="p-3">{t.method}</td>
                <td className="p-3">
                  <StatusBadge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <GlassCard className="p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Deposit methods (today sample)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {(["VISA", "MASTERCARD", "CRYPTO", "SEPA"] as const).map((m) => {
            const sum = deposits
              .filter((d) => d.method === m)
              .reduce((a, d) => a + d.amount, 0);
            return (
              <div key={m} className="border border-zinc-800 rounded-lg p-3">
                <p className="text-zinc-500 font-bold">{m}</p>
                <p className="text-lg font-black text-white mt-1">€{sum.toFixed(0)}</p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
