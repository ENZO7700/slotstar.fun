import React from "react";
import { GlassCard } from "./GlassCard";

export function StatCard({
  label,
  value,
  hint,
  accent = "gold",
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "gold" | "win" | "alert" | "zinc";
  icon?: React.ReactNode;
}) {
  const accentClass =
    accent === "gold"
      ? "text-gold"
      : accent === "win"
        ? "text-win"
        : accent === "alert"
          ? "text-alert"
          : "text-zinc-200";

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
            {label}
          </p>
          <p className={`mt-2 text-2xl font-black ${accentClass}`}>{value}</p>
          {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
        </div>
        {icon ? <div className="text-zinc-500">{icon}</div> : null}
      </div>
    </GlassCard>
  );
}
