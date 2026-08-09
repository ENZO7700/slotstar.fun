"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";
import { loginAction } from "@/actions/adminActions";
import type { AdminRole } from "@/types/admin";

const QUICK: AdminRole[] = [
  "SUPER_ADMIN",
  "RISK_MANAGER",
  "SUPPORT_AGENT",
  "FINANCE_ADMIN",
];

export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Shield size={22} />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white">
            NEXUS CORE
          </h1>
          <p className="text-xs text-zinc-500">
            Casino Admin Panel — demo login (password: <code>nexus</code>)
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              const res = await loginAction(fd);
              if (!res.success) {
                setError(res.message || "Login failed");
                return;
              }
              router.push(params.get("next") || "/admin");
              router.refresh();
            });
          }}
        >
          <label className="block space-y-1.5">
            <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
              Username
            </span>
            <input
              name="username"
              defaultValue="Alex_SuperAdmin"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
              Password
            </span>
            <input
              name="password"
              type="password"
              defaultValue="nexus"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
            />
          </label>
          {error ? <p className="text-xs text-alert">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 rounded-lg text-sm disabled:opacity-60"
          >
            {pending ? "Authenticating…" : "Enter Back-Office"}
          </button>
        </form>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
            Quick role login
          </p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK.map((role) => (
              <button
                key={role}
                type="button"
                className="text-[10px] font-bold border border-zinc-800 rounded-lg px-2 py-2 text-zinc-300 hover:border-amber-500/50"
                onClick={() => {
                  const fd = new FormData();
                  fd.set("password", "nexus");
                  fd.set("role", role);
                  start(async () => {
                    const res = await loginAction(fd);
                    if (res.success) {
                      router.push("/admin");
                      router.refresh();
                    }
                  });
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
