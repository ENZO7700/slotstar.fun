import { riskTone } from "@/lib/admin/risk-score";

export function RiskScoreBadge({ score }: { score: number }) {
  const tone = riskTone(score);
  const cls =
    tone === "low"
      ? "bg-emerald-950 text-[#00c52a] border-emerald-800"
      : tone === "high"
        ? "bg-red-950 text-[#ff0033] border-red-800"
        : "bg-amber-950 text-amber-400 border-amber-800";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-black ${cls}`}
    >
      RISK {score}
    </span>
  );
}
