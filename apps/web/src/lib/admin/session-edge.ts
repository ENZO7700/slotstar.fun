import type { AdminRole, AdminSession } from "@/types/admin";

export function decodeSessionEdge(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  try {
    const normalized = token.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
    const json =
      typeof atob === "function"
        ? atob(normalized + pad)
        : Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as AdminSession;
    if (!parsed?.userId || !parsed?.role || !parsed?.exp) return null;
    if (Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isAdminRole(value: string): value is AdminRole {
  return (
    value === "SUPER_ADMIN" ||
    value === "RISK_MANAGER" ||
    value === "SUPPORT_AGENT" ||
    value === "FINANCE_ADMIN"
  );
}
