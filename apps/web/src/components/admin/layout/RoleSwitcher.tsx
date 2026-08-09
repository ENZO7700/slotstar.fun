"use client";

import type { AdminRole } from "@/types/admin";
import { ROLE_LABELS } from "@/lib/admin/roles";
import { useNexusAdmin } from "@/context/NexusAdminContext";

const ROLES: AdminRole[] = [
  "SUPER_ADMIN",
  "RISK_MANAGER",
  "SUPPORT_AGENT",
  "FINANCE_ADMIN",
];

export function RoleSwitcher() {
  const { role, switchRole } = useNexusAdmin();

  return (
    <select
      value={role}
      onChange={(e) => switchRole(e.target.value as AdminRole)}
      className="bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 rounded-lg px-2 py-1.5"
      title="Demo role switcher"
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABELS[r]}
        </option>
      ))}
    </select>
  );
}
