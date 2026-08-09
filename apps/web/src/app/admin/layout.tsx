import "./admin.css";
import { getServerSession } from "@/lib/admin/session";
import { getAdminSnapshot } from "@/lib/admin/admin-store";
import { AdminShell } from "@/components/admin/layout/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    return <div className="nexus-admin min-h-screen">{children}</div>;
  }

  const data = getAdminSnapshot();
  return (
    <AdminShell
      initialData={data}
      role={session.role}
      username={session.username}
    >
      {children}
    </AdminShell>
  );
}
