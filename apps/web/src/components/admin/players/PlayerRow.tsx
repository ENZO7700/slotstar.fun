import React from 'react';
import { VIPStatusBadge } from './VIPStatusBadge';

export function PlayerRow({ player }: { player: any }) {
  const isHighValue = player.vipTier === 'Diamond' || player.vipTier === 'Platinum';

  return (
    <tr className={`border-b border-zinc-900 transition-all ${isHighValue ? 'bg-amber-500/5' : 'hover:bg-zinc-800/30'}`}>
      <td className="p-4 flex items-center gap-3">
        {isHighValue && <VIPStatusBadge tier={player.vipTier} />}
        <div>
          <div className="font-bold text-white flex items-center gap-2">
            {player.username}
            {isHighValue && <span className="text-[10px] bg-amber-500 text-black px-1 rounded font-black">VIP</span>}
          </div>
          <div className="text-xs text-zinc-500">{player.email}</div>
        </div>
      </td>
      <td className="p-4 font-mono text-emerald-400 font-bold">€{player.realBalance?.toLocaleString()}</td>
      <td className="p-4">
        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase border ${
          player.kycStatus === 'Verified' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-zinc-700 text-zinc-500'
        }`}>
          {player.kycStatus}
        </span>
      </td>
      <td className="p-4 text-xs font-mono text-amber-400">
        {player.vipTier}
      </td>
      <td className="p-4 text-xs text-zinc-400">
        {player.lastLogin}
      </td>
    </tr>
  );
}
