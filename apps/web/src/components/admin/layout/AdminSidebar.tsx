"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ClipboardList,
  Gamepad2,
  LayoutDashboard,
  ShieldAlert,
  TicketPercent,
  Users,
  Wallet,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { canAccessRoute } from "@/lib/admin/roles";
import type { AdminRole } from "@/types/admin";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/players", label: "Players CRM", icon: Users },
  { href: "/admin/bonuses", label: "Bonuses", icon: Gift },
  { href: "/admin/promotions", label: "Promotions / FS", icon: TicketPercent },
  { href: "/admin/finance", label: "Finance", icon: Wallet },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/risk/withdrawals", label: "Risk Queue", icon: ShieldAlert },
  { href: "/admin/monitor", label: "Live Monitor", icon: Activity },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ClipboardList },
];

export function AdminSidebar({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const items = NAV.filter((n) => canAccessRoute(role, n.href));

  return (
    <aside
      className={`sticky top-0 h-screen border-r border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md transition-all ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-800">
        {!collapsed ? (
          <div>
            <p className="text-sm font-black tracking-widest text-amber-500">
              NEXUS CORE
            </p>
            <p className="text-[10px] text-zinc-500 uppercase">Casino PAM</p>
          </div>
        ) : (
          <span className="text-amber-500 font-black">N</span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="p-1.5 rounded-md border border-zinc-800 text-zinc-400 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
      <nav className="p-3 space-y-1">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 border border-transparent"
              }`}
              title={item.label}
            >
              <Icon size={16} />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
