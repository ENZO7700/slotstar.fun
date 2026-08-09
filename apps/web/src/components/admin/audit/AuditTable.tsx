"use client";

import { useMemo, useState } from "react";
import { Download, History } from "lucide-react";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { GlassCard } from "@/components/admin/ui/GlassCard";
import { auditToCsv, auditToJson } from "@/lib/admin/export-audit";

export function AuditTable() {
  const { data } = useNexusAdmin();
  const [q, setQ] = useState("");

  const logs = useMemo(() => {
    const query = q.toLowerCase();
    return data.auditLogs.filter(
      (l) =>
        !query ||
        l.adminUsername.toLowerCase().includes(query) ||
        l.action.toLowerCase().includes(query) ||
        l.targetPlayerId.toLowerCase().includes(query) ||
        l.details.toLowerCase().includes(query)
    );
  }, [data.auditLogs, q]);

  function download(kind: "csv" | "json") {
    const content = kind === "csv" ? auditToCsv(logs) : auditToJson(logs);
    const blob = new Blob([content], {
      type: kind === "csv" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-audit-${Date.now()}.${kind}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <History className="text-amber-500" /> Immutable Audit Trail
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Regulatory compliance log for all admin interventions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => download("csv")}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-zinc-200 px-4 py-2 rounded-lg text-xs font-bold"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => download("json")}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-zinc-200 px-4 py-2 rounded-lg text-xs font-bold"
          >
            <Download size={14} /> Regulatory JSON
          </button>
        </div>
      </div>

      <GlassCard className="p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search admin, action, player, details…"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
        />
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Admin / Role</th>
              <th className="p-4">Action Type</th>
              <th className="p-4">Target Player</th>
              <th className="p-4">Details</th>
              <th className="p-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                <td className="p-4 text-zinc-400">{log.timestamp}</td>
                <td className="p-4">
                  <span className="font-bold text-white block font-sans">
                    {log.adminUsername}
                  </span>
                  <span className="text-[10px] text-amber-500">{log.adminRole}</span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-200 rounded border border-zinc-700 font-bold font-sans">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-amber-400">{log.targetPlayerId}</td>
                <td className="p-4 text-zinc-300 max-w-xs truncate font-sans">
                  {log.details}
                  {log.oldValue && log.newValue ? (
                    <span className="block text-[10px] text-zinc-500 mt-1">
                      {log.oldValue} → {log.newValue}
                    </span>
                  ) : null}
                </td>
                <td className="p-4 text-zinc-500">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
