"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { GlassCard } from "@/components/admin/ui/GlassCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { KycStatus, VipTier } from "@/types/admin";

export function PlayersTable() {
  const { data } = useNexusAdmin();
  const [kyc, setKyc] = useState<KycStatus | "ALL">("ALL");
  const [vip, setVip] = useState<VipTier | "ALL">("ALL");
  const [blockedOnly, setBlockedOnly] = useState(false);
  const [minBalance, setMinBalance] = useState("");

  const rows = useMemo(() => {
    return data.players.filter((p) => {
      if (kyc !== "ALL" && p.kycStatus !== kyc) return false;
      if (vip !== "ALL" && p.vipTier !== vip) return false;
      if (blockedOnly && p.status !== "SUSPENDED") return false;
      if (minBalance && p.realBalance < Number(minBalance)) return false;
      return true;
    });
  }, [data.players, kyc, vip, blockedOnly, minBalance]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider">Players CRM</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Filter by KYC, VIP, balance and suspension status
        </p>
      </div>

      <GlassCard className="p-4 flex flex-wrap gap-3 items-end">
        <label className="text-xs space-y-1">
          <span className="text-zinc-500 font-bold uppercase">KYC</span>
          <select
            value={kyc}
            onChange={(e) => setKyc(e.target.value as KycStatus | "ALL")}
            className="block bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5"
          >
            <option value="ALL">All</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
        <label className="text-xs space-y-1">
          <span className="text-zinc-500 font-bold uppercase">VIP</span>
          <select
            value={vip}
            onChange={(e) => setVip(e.target.value as VipTier | "ALL")}
            className="block bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5"
          >
            <option value="ALL">All</option>
            {["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs space-y-1">
          <span className="text-zinc-500 font-bold uppercase">Min real balance</span>
          <input
            value={minBalance}
            onChange={(e) => setMinBalance(e.target.value)}
            placeholder="0"
            className="block bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 w-28"
          />
        </label>
        <label className="text-xs flex items-center gap-2 pb-2">
          <input
            type="checkbox"
            checked={blockedOnly}
            onChange={(e) => setBlockedOnly(e.target.checked)}
          />
          Blocked only
        </label>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
            <tr>
              <th className="p-4">Player</th>
              <th className="p-4">Status</th>
              <th className="p-4">KYC</th>
              <th className="p-4">VIP</th>
              <th className="p-4">Real / Bonus</th>
              <th className="p-4">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-900/40">
                <td className="p-4">
                  <Link
                    href={`/admin/players/${p.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <img
                      src={p.avatarUrl}
                      alt=""
                      className="w-8 h-8 rounded-lg border border-zinc-700"
                    />
                    <div>
                      <p className="font-bold text-white group-hover:text-amber-400">
                        {p.username}
                      </p>
                      <p className="text-zinc-500">{p.id} · {p.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="p-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="p-4">
                  <StatusBadge status={p.kycStatus} />
                </td>
                <td className="p-4 text-amber-400 font-bold">{p.vipTier}</td>
                <td className="p-4 font-mono">
                  <span className="text-win">€{p.realBalance.toFixed(2)}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-amber-400">€{p.bonusBalance.toFixed(2)}</span>
                </td>
                <td className="p-4 text-zinc-400">{p.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
