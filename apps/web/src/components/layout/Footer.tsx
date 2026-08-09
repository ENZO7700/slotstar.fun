import React from 'react';
import Link from 'next/link';
import { AffiliateButton } from '../ui/AffiliateComponents';
import { Icons } from '../ui/Icons';

export function Footer() {
  return (
    <footer className="relative w-full bg-zinc-950 border-t-[var(--border-brutal)] border-t-black py-12 px-6 mt-auto overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-200 h-px bg-linear-to-r from-transparent via-amber-500/20 to-transparent"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-150 h-50 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-(--max-content-width) mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 z-10">
        
        {/* Brand & Info Column */}
        <div className="col-span-1 md:col-span-5 space-y-5">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 bg-linear-to-br from-zinc-800 to-zinc-900 rounded-lg shadow-inner border border-white/5 group-hover:border-amber-500/30 transition-all">
              <Icons.Star size={16} className="text-zinc-500 group-hover:text-amber-500 transition-colors" />
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
              SLOT<span className="text-zinc-600 font-medium">STAR</span>
            </span>
          </Link>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
            SlotStars.fun je prémiová platforma na objavovanie a bezplatné testovanie demo kasíno hier od špičkových poskytovateľov. Zažite čisté vzrušenie bez rizika.
          </p>
          <div className="pt-2">
            <AffiliateButton label="🎰 Pozrieť top kasína" variant="ghost" size="sm" />
          </div>
        </div>

        {/* Responsible Gaming Notice */}
        <div className="col-span-1 md:col-span-4 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-100 flex items-center">
            <Icons.Shield size={14} className="mr-2 text-emerald-500" />
            Zodpovedné hranie
          </h2>
          <div className="p-4 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-inner">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Všetky demo hry na tejto stránke sú určené výhradne na zábavné účely a simulované testovanie. Hranie demo verzií nepredstavuje reálne stávky ani výhry. Hrajte vždy zodpovedne a s rozvahou.
            </p>
          </div>
        </div>

        {/* Links Column */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Dôležité Odkazy</h2>
          <ul className="text-sm text-zinc-400 space-y-3">
            <li>
              <Link href="/blog" className="flex items-center hover:text-amber-400 hover:translate-x-1 transition-transform duration-200">
                <span className="mr-2 text-zinc-600">→</span> Blog a novinky
              </Link>
            </li>
            <li>
              <Link href="/responsible-gaming" className="flex items-center hover:text-amber-400 hover:translate-x-1 transition-transform duration-200">
                <span className="mr-2 text-zinc-600">→</span> Zodpovedné hranie
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="flex items-center hover:text-amber-400 hover:translate-x-1 transition-transform duration-200">
                <span className="mr-2 text-zinc-600">→</span> Ochrana osobných údajov
              </Link>
            </li>
            <li>
              <Link href="/terms" className="flex items-center hover:text-amber-400 hover:translate-x-1 transition-transform duration-200">
                <span className="mr-2 text-zinc-600">→</span> Obchodné podmienky
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="relative max-w-(--max-content-width) mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500 z-10">
        <p className="font-medium">© {new Date().getFullYear()} SlotStars.fun. Všetky práva vyhradené.</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 font-black text-[10px] shadow-sm">
            18+
          </span>
          <p>Určené iba pre dospelé osoby.</p>
        </div>
      </div>
    </footer>
  );
}
