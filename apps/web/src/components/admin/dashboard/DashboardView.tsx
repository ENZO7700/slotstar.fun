"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Gift, TrendingUp, Wallet } from "lucide-react";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { GlassCard } from "@/components/admin/ui/GlassCard";

const VIP_COLORS = ["#71717a", "#a1a1aa", "#f59e0b", "#e4e4e7", "#00c52a"];

export function DashboardView() {
  const { data } = useNexusAdmin();
  const ggrData = data.kpi.ggr30d.map((v, i) => ({
    day: `D${i + 1}`,
    ggr: v,
  }));
  const topGames = [...data.games]
    .sort((a, b) => b.playCount30d - a.playCount30d)
    .slice(0, 5)
    .map((g) => ({ name: g.title, plays: g.playCount30d }));

  const vipCounts = data.players.reduce<Record<string, number>>((acc, p) => {
    acc[p.vipTier] = (acc[p.vipTier] || 0) + 1;
    return acc;
  }, {});
  const vipData = Object.entries(vipCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-white">
          Command Dashboard
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Real-time Nexus Core KPIs and live casino pulse
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="GGR Today"
          value={`€${data.kpi.ggrToday.toLocaleString()}`}
          hint="Gross Gaming Revenue"
          accent="gold"
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          label="Live Players"
          value={String(data.kpi.livePlayers)}
          hint="Currently in sessions"
          accent="win"
          icon={<Activity size={18} />}
        />
        <StatCard
          label="Deposits / Withdrawals"
          value={`€${data.kpi.depositsToday.toLocaleString()} / €${data.kpi.withdrawalsToday.toLocaleString()}`}
          hint="Today"
          accent="zinc"
          icon={<Wallet size={18} />}
        />
        <StatCard
          label="Active Campaigns"
          value={String(data.kpi.activeCampaigns)}
          hint="Bonus & promo engine"
          accent="gold"
          icon={<Gift size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <GlassCard className="p-4 xl:col-span-2 h-80">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            GGR — last 30 days
          </p>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={ggrData}>
              <defs>
                <linearGradient id="ggr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis stroke="#52525b" fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: "#09090b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="ggr"
                stroke="#f59e0b"
                fill="url(#ggr)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-4 h-80">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            VIP distribution
          </p>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie data={vipData} dataKey="value" nameKey="name" outerRadius={90}>
                {vipData.map((_, i) => (
                  <Cell key={i} fill={VIP_COLORS[i % VIP_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#09090b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <GlassCard className="p-4 h-72">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            Top 5 played slots
          </p>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={topGames} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#09090b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="plays" fill="#00c52a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-4 h-72 overflow-hidden">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            Live bet feed
          </p>
          <div className="space-y-2 overflow-y-auto max-h-56 pr-1">
            {data.liveBets.slice(0, 10).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between text-xs border border-zinc-800/80 rounded-lg px-3 py-2 bg-zinc-950/40"
              >
                <div>
                  <p className="font-bold text-zinc-200">{b.username}</p>
                  <p className="text-zinc-500">{b.gameTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-400">€{b.betAmount.toFixed(2)}</p>
                  <p
                    className={
                      b.winAmount > b.betAmount ? "text-win font-bold" : "text-zinc-500"
                    }
                  >
                    {b.multiplier.toFixed(1)}x · €{b.winAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
