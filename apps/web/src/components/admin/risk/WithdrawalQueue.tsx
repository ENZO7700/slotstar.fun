"use client";

import { useState } from "react";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { GlassCard } from "@/components/admin/ui/GlassCard";
import { RiskScoreBadge } from "@/components/admin/ui/RiskScoreBadge";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export function WithdrawalQueue() {
  const { data, approveWithdrawal, flagWithdrawal, rejectWithdrawal } =
    useNexusAdmin();
  const [totpFor, setTotpFor] = useState<string | null>(null);
  const [totp, setTotp] = useState("123456");
  const [msg, setMsg] = useState("");

  const queue = data.withdrawals.filter((w) =>
    ["PENDING", "FLAGGED"].includes(w.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider">
          Anti-Fraud Withdrawal Queue
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Risk score 0–100 · Approve requires mock 2FA code <code>123456</code>
        </p>
      </div>

      {msg ? (
        <GlassCard className="p-3 text-xs text-zinc-300">{msg}</GlassCard>
      ) : null}

      <div className="space-y-3">
        {queue.map((w) => (
          <GlassCard key={w.id} className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-white">
                    {w.username}{" "}
                    <span className="text-zinc-500 font-mono text-xs">({w.playerId})</span>
                  </p>
                  <RiskScoreBadge score={w.riskScore} />
                  <StatusBadge status={w.status} />
                </div>
                <p className="text-sm mt-1">
                  <span className="text-amber-400 font-bold">
                    €{w.amount.toFixed(2)}
                  </span>{" "}
                  via {w.method}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {w.riskFlags.length === 0 ? (
                    <span className="text-[10px] text-[#00c52a] font-bold">
                      CLEAN PROFILE
                    </span>
                  ) : (
                    w.riskFlags.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] px-2 py-0.5 rounded border border-red-900 bg-red-950/40 text-[#ff0033] font-bold"
                      >
                        {f}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTotpFor(w.id);
                    setTotp("123456");
                  }}
                  className="px-3 py-2 rounded-lg bg-[#00c52a] text-black text-[11px] font-black"
                >
                  APPROVE WITHDRAWAL
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await flagWithdrawal(w.id);
                    setMsg(`Flagged ${w.id}`);
                  }}
                  className="px-3 py-2 rounded-lg border border-amber-700 text-amber-400 text-[11px] font-black"
                >
                  FLAG FOR REVIEW
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await rejectWithdrawal(w.id);
                    setMsg(`Rejected & refunded ${w.id}`);
                  }}
                  className="px-3 py-2 rounded-lg border border-red-800 text-[#ff0033] text-[11px] font-black"
                >
                  REJECT & REFUND
                </button>
              </div>
            </div>

            {totpFor === w.id ? (
              <div className="mt-4 border-t border-zinc-800 pt-4 flex flex-wrap items-end gap-2">
                <label className="text-xs space-y-1">
                  <span className="text-zinc-500 font-bold uppercase">2FA TOTP</span>
                  <input
                    value={totp}
                    onChange={(e) => setTotp(e.target.value)}
                    className="block bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 font-mono"
                  />
                </label>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-black"
                  onClick={async () => {
                    const res = await approveWithdrawal(w.id, totp);
                    setMsg(
                      res.success
                        ? `Approved ${w.id}`
                        : res.message || "Approval failed"
                    );
                    if (res.success) setTotpFor(null);
                  }}
                >
                  Confirm 2FA
                </button>
                <button
                  type="button"
                  className="px-3 py-2 text-xs text-zinc-400"
                  onClick={() => setTotpFor(null)}
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </GlassCard>
        ))}
        {queue.length === 0 ? (
          <GlassCard className="p-8 text-center text-zinc-500 text-sm">
            No pending withdrawals in the risk queue.
          </GlassCard>
        ) : null}
      </div>
    </div>
  );
}
