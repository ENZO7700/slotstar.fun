import React from 'react';
import Link from 'next/link';
import { AffiliateButton } from '../ui/AffiliateComponents';

export function Footer() {
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 py-10 px-6 mt-auto">
      <div className="max-w-(--max-content-width) mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="space-y-3">
          <span className="text-lg font-black tracking-tight text-amber-500">
            SLOT<span className="text-zinc-50 font-medium">STAR</span>
          </span>
          <p className="text-xs text-zinc-400 leading-relaxed">
            SlotStars.fun je moderná platforma na objavovanie a bezplatné testovanie demo kasíno hier a poskytovateľov.
          </p>
        </div>

        {/* Responsible Gaming Notice */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Zodpovedné hranie</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Všetky demo hry na tejto stránke sú určené výhradne na zábavné účely a simulované testovanie. Hranie demo verzií nepredstavuje reálne stávky ani výhry. Hrajte zodpovedne.
          </p>
        </div>

        {/* Links Column */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Odkazy</h2>
          <ul className="text-xs text-zinc-400 space-y-2">
            <li>
              <Link href="/blog" className="hover:underline hover:text-zinc-300">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/responsible-gaming" className="hover:underline hover:text-zinc-300">
                Zodpovedné hranie
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline hover:text-zinc-300">
                Ochrana osobných údajov
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline hover:text-zinc-300">
                Všeobecné obchodné podmienky
              </Link>
            </li>
            <li className="pt-2">
              <AffiliateButton label="🎰 Navštíviť kasíno →" variant="secondary" size="sm" />
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-(--max-content-width) mx-auto mt-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-600">
        <p>© 2026 SlotStars.fun. Všetky práva vyhradené.</p>
        <p className="mt-2 sm:mt-0">Určené iba pre osoby staršie ako 18 rokov.</p>
      </div>
    </footer>
  );
}
