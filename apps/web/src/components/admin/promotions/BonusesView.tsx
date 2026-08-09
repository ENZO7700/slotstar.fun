"use client";

import { useState } from "react";
import type { BonusType } from "@/types/admin";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { GlassCard } from "@/components/admin/ui/GlassCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export function BonusesView() {
  const { data, createCampaign } = useNexusAdmin();
  const [name, setName] = useState("Reload Friday");
  const [type, setType] = useState<BonusType>("DEPOSIT_MATCH");
  const [promoCode, setPromoCode] = useState("RELOAD20");
  const [wagering, setWagering] = useState(30);
  const [expiryDays, setExpiryDays] = useState(7);
  const [spinCount, setSpinCount] = useState(50);
  const [betValue, setBetValue] = useState(0.2);
  const [gameId, setGameId] = useState(data.games[0]?.id || "");
  const [matchPercent, setMatchPercent] = useState(100);
  const [cashbackPercent, setCashbackPercent] = useState(10);
  const [msg, setMsg] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider">
          Bonus & Promo Center
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Create deposit match, free spins, no-deposit and cashback campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <GlassCard className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Campaign builder
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
            placeholder="Campaign name"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BonusType)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
          >
            <option value="DEPOSIT_MATCH">Deposit Match</option>
            <option value="FREE_SPINS">Free Spins</option>
            <option value="NO_DEPOSIT">No-Deposit Bonus</option>
            <option value="CASHBACK">Cashback</option>
          </select>
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono"
            placeholder="Promo code"
          />

          {type === "FREE_SPINS" ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={spinCount}
                  onChange={(e) => setSpinCount(Number(e.target.value))}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                  placeholder="Spins"
                />
                <select
                  value={betValue}
                  onChange={(e) => setBetValue(Number(e.target.value))}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                >
                  {[0.1, 0.2, 0.5, 1].map((v) => (
                    <option key={v} value={v}>
                      €{v.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
              >
                {data.games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </>
          ) : null}

          {type === "DEPOSIT_MATCH" || type === "NO_DEPOSIT" ? (
            <input
              type="number"
              value={matchPercent}
              onChange={(e) => setMatchPercent(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
              placeholder="Match %"
            />
          ) : null}

          {type === "CASHBACK" ? (
            <input
              type="number"
              value={cashbackPercent}
              onChange={(e) => setCashbackPercent(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
              placeholder="Cashback %"
            />
          ) : null}

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs space-y-1">
              <span className="text-zinc-500 font-bold">Wagering</span>
              <input
                type="number"
                value={wagering}
                onChange={(e) => setWagering(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
              />
            </label>
            <label className="text-xs space-y-1">
              <span className="text-zinc-500 font-bold">Expiry days</span>
              <input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
              />
            </label>
          </div>

          <button
            type="button"
            className="w-full bg-amber-500 text-black font-black text-sm py-2.5 rounded-lg"
            onClick={async () => {
              const game = data.games.find((g) => g.id === gameId);
              const res = await createCampaign({
                name,
                type,
                promoCode,
                wageringRequirement: wagering,
                expiryDays,
                maxRedemptions: 1000,
                spinCount: type === "FREE_SPINS" ? spinCount : undefined,
                betValue: type === "FREE_SPINS" ? betValue : undefined,
                gameId: type === "FREE_SPINS" ? game?.id : undefined,
                gameTitle: type === "FREE_SPINS" ? game?.title : undefined,
                matchPercent:
                  type === "DEPOSIT_MATCH" || type === "NO_DEPOSIT"
                    ? matchPercent
                    : undefined,
                cashbackPercent: type === "CASHBACK" ? cashbackPercent : undefined,
              });
              setMsg(res.success ? "Campaign created" : "Failed to create campaign");
            }}
          >
            Create Campaign
          </button>
          {msg ? <p className="text-xs text-zinc-400">{msg}</p> : null}
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Active promo codes
            </p>
          </div>
          <table className="w-full text-xs">
            <thead className="text-zinc-500 uppercase">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Uses</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {data.campaigns.map((c) => (
                <tr key={c.id}>
                  <td className="p-3">
                    <p className="font-mono text-amber-400">{c.promoCode}</p>
                    <p className="text-zinc-500">{c.name}</p>
                  </td>
                  <td className="p-3">
                    {c.redemptions}/{c.maxRedemptions}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  );
}
