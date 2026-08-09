import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="glass-card max-w-md w-full p-8 text-center space-y-4">
        <ShieldOff className="mx-auto text-[#ff0033]" size={32} />
        <h1 className="text-xl font-black text-white uppercase tracking-wider">
          Access Denied
        </h1>
        <p className="text-sm text-zinc-400">
          Your current role does not have permission for this Nexus Core module.
          Switch role from the top bar or return to the dashboard.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center bg-amber-500 text-black font-bold text-sm px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
