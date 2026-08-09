"use client";

import { Activity, LogOut, Search, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/adminActions";
import { useNexusAdmin } from "@/context/NexusAdminContext";
import { RoleSwitcher } from "./RoleSwitcher";

export function AdminTopBar() {
  const { username, data, isPending } = useNexusAdmin();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md px-4 md:px-6 flex items-center gap-4">
      <div className="flex-1 max-w-xl relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          placeholder="Quick search players, withdrawals, promo codes…"
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      <div className="hidden md:flex items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-800 bg-emerald-950/40 text-[#00c52a] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c52a] animate-pulse" />
          SYSTEM HEALTH OK
        </span>
        <span className="inline-flex items-center gap-1 text-zinc-400">
          <Activity size={12} />
          Live {data.kpi.livePlayers}
        </span>
        {isPending ? (
          <span className="inline-flex items-center gap-1 text-amber-400">
            <Zap size={12} /> Syncing
          </span>
        ) : null}
      </div>

      <RoleSwitcher />

      <div className="text-right hidden sm:block">
        <p className="text-xs font-bold text-white">{username}</p>
        <p className="text-[10px] text-zinc-500">Nexus Operator</p>
      </div>

      <button
        type="button"
        onClick={async () => {
          await logoutAction();
          router.push("/admin/login");
          router.refresh();
        }}
        className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
        title="Logout"
      >
        <LogOut size={14} />
      </button>
    </header>
  );
}
