import React from "react";

const styles: Record<string, string> = {
  ACTIVE: "bg-emerald-950 text-[#00c52a] border-emerald-800",
  VERIFIED: "bg-emerald-950 text-[#00c52a] border-emerald-800",
  COMPLETED: "bg-emerald-950 text-[#00c52a] border-emerald-800",
  APPROVED: "bg-emerald-950 text-[#00c52a] border-emerald-800",
  PENDING: "bg-amber-950 text-amber-400 border-amber-800",
  FLAGGED: "bg-orange-950 text-orange-400 border-orange-800",
  PAUSED: "bg-zinc-900 text-zinc-300 border-zinc-700",
  MAINTENANCE: "bg-amber-950 text-amber-400 border-amber-800",
  DISABLED: "bg-zinc-900 text-zinc-400 border-zinc-700",
  SUSPENDED: "bg-red-950 text-[#ff0033] border-red-800",
  REJECTED: "bg-red-950 text-[#ff0033] border-red-800",
  UNVERIFIED: "bg-red-950 text-[#ff0033] border-red-800",
  EXPIRED: "bg-zinc-900 text-zinc-500 border-zinc-700",
  SELF_EXCLUDED: "bg-red-950 text-[#ff0033] border-red-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
        styles[status] ?? "bg-zinc-900 text-zinc-300 border-zinc-700"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
