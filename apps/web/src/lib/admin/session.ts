import { cookies } from "next/headers";
import type { AdminRole, AdminSession } from "@/types/admin";
import { ADMIN_SESSION_COOKIE } from "@/types/admin";

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

export function encodeSession(session: AdminSession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  try {
    const json = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as AdminSession;
    if (!parsed?.userId || !parsed?.role || !parsed?.exp) return null;
    if (Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createSessionPayload(
  userId: string,
  username: string,
  role: AdminRole
): AdminSession {
  return {
    userId,
    username,
    role,
    exp: Date.now() + SESSION_TTL_MS,
  };
}

export async function getServerSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return decodeSession(jar.get(ADMIN_SESSION_COOKIE)?.value);
}

export const DEMO_ADMINS: Array<{
  userId: string;
  username: string;
  role: AdminRole;
  password: string;
}> = [
  {
    userId: "ADM-001",
    username: "Alex_SuperAdmin",
    role: "SUPER_ADMIN",
    password: "nexus",
  },
  {
    userId: "ADM-002",
    username: "Maros_RiskLead",
    role: "RISK_MANAGER",
    password: "nexus",
  },
  {
    userId: "ADM-003",
    username: "Eva_Support",
    role: "SUPPORT_AGENT",
    password: "nexus",
  },
  {
    userId: "ADM-004",
    username: "Peter_Finance",
    role: "FINANCE_ADMIN",
    password: "nexus",
  },
];
