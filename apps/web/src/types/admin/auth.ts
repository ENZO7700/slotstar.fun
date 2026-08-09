export type AdminRole =
  | "SUPER_ADMIN"
  | "RISK_MANAGER"
  | "SUPPORT_AGENT"
  | "FINANCE_ADMIN";

export interface AdminSession {
  userId: string;
  username: string;
  role: AdminRole;
  exp: number;
}

export const ADMIN_SESSION_COOKIE = "nexus_admin_session";
