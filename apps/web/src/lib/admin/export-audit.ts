import type { AuditEntry } from "@/types/admin";

export function auditToCsv(logs: AuditEntry[]): string {
  const header = [
    "id",
    "timestamp",
    "adminUsername",
    "adminRole",
    "action",
    "targetPlayerId",
    "details",
    "oldValue",
    "newValue",
    "ipAddress",
  ];
  const rows = logs.map((l) =>
    [
      l.id,
      l.timestamp,
      l.adminUsername,
      l.adminRole,
      l.action,
      l.targetPlayerId,
      `"${l.details.replace(/"/g, '""')}"`,
      l.oldValue ?? "",
      l.newValue ?? "",
      l.ipAddress,
    ].join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

export function auditToJson(logs: AuditEntry[]): string {
  return JSON.stringify(
    {
      exportType: "NEXUS_REGULATORY_AUDIT",
      generatedAt: new Date().toISOString(),
      count: logs.length,
      entries: logs,
    },
    null,
    2
  );
}
