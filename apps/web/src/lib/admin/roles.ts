import type { AdminRole } from "@/types/admin";

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  SUPER_ADMIN: [
    "/admin",
    "/admin/players",
    "/admin/bonuses",
    "/admin/promotions",
    "/admin/finance",
    "/admin/games",
    "/admin/risk",
    "/admin/monitor",
    "/admin/audit-logs",
  ],
  RISK_MANAGER: [
    "/admin",
    "/admin/players",
    "/admin/risk",
    "/admin/monitor",
    "/admin/audit-logs",
  ],
  SUPPORT_AGENT: [
    "/admin",
    "/admin/players",
    "/admin/promotions",
    "/admin/bonuses",
  ],
  FINANCE_ADMIN: [
    "/admin",
    "/admin/finance",
    "/admin/risk/withdrawals",
    "/admin/audit-logs",
  ],
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  RISK_MANAGER: "Risk & Fraud Manager",
  SUPPORT_AGENT: "Support Agent",
  FINANCE_ADMIN: "Finance Manager",
};

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/unauthorized"];

export function isPublicAdminPath(pathname: string): boolean {
  return PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function canAccessRoute(role: AdminRole, pathname: string): boolean {
  if (isPublicAdminPath(pathname)) return true;
  const allowed = ROLE_PERMISSIONS[role] ?? [];
  return allowed.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function canGrantFreeSpins(role: AdminRole, spinCount: number): boolean {
  if (role === "SUPER_ADMIN" || role === "RISK_MANAGER") return true;
  if (role === "SUPPORT_AGENT") return spinCount <= 20;
  return false;
}

export function canMutateBalance(role: AdminRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canApproveWithdrawals(role: AdminRole): boolean {
  return role === "SUPER_ADMIN" || role === "RISK_MANAGER" || role === "FINANCE_ADMIN";
}
