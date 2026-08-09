"use client";

import type { AdminRole } from "@/types/admin";
import type { AdminStoreSnapshot } from "@/lib/admin/admin-store";
import { NexusAdminProvider } from "@/context/NexusAdminContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

export function AdminShell({
  children,
  initialData,
  role,
  username,
}: {
  children: React.ReactNode;
  initialData: AdminStoreSnapshot;
  role: AdminRole;
  username: string;
}) {
  return (
    <NexusAdminProvider initialData={initialData} role={role} username={username}>
      <div className="nexus-admin flex min-h-screen">
        <AdminSidebar role={role} />
        <div className="flex-1 min-w-0 flex flex-col">
          <AdminTopBar />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </NexusAdminProvider>
  );
}
