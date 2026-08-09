"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface VIPBadgeProps {
  tier: 'Diamond' | 'Platinum' | 'Gold';
  isLarge?: boolean;
}

export function VIPStatusBadge({ tier, isLarge = false }: VIPBadgeProps) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative flex items-center justify-center ${isLarge ? 'w-16 h-16' : 'w-8 h-8'}`}
    >
      {/* Glow Effect Background */}
      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
      
      {/* SlotStar VIP Icon */}
      <Image 
        src="/images/slotstar-vip-icon.png"
        alt="SlotStar VIP"
        width={isLarge ? 64 : 32}
        height={isLarge ? 64 : 32}
        className="relative z-10 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] object-contain"
      />
      
      {isLarge && (
        <div className="absolute -bottom-2 whitespace-nowrap bg-zinc-950 border border-amber-500 px-2 py-0.5 rounded text-[8px] font-black text-amber-500 uppercase tracking-tighter z-20">
          {tier} STATUS
        </div>
      )}
    </motion.div>
  );
}
