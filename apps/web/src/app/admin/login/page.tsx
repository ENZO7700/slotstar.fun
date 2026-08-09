import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/layout/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-zinc-500 text-sm">
          Loading login…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
