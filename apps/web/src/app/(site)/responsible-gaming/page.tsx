import React from 'react';

export default function ResponsibleGamingPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <h1 className="text-3xl font-black tracking-tight text-zinc-100">Zodpovedné hranie</h1>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Na SlotStars.fun nám záleží na bezpečnosti a ochrane našich návštevníkov. Naša platforma slúži výhradne na objavovanie hier a bezplatné testovanie demo verzií bez finančného rizika.
      </p>

      <section className="space-y-3 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-lg font-bold text-amber-500">Základné pravidlá bezpečnej zábavy</h2>
        <ul className="text-sm text-zinc-300 list-disc list-inside space-y-2">
          <li>Demo verzie hier sú určené len pre zábavu a nemajú vplyv na reálne financie.</li>
          <li>Udržujte si kontrolu nad časom stráveným hraním demo hier.</li>
          <li>Hry a ich demo verzie sú určené výhradne pre dospelé osoby staršie ako 18 rokov.</li>
        </ul>
      </section>

      <p className="text-xs text-zinc-500">
        Ak máte pocit, že hranie negatívne ovplyvňuje váš život, odporúčame vyhľadať odbornú pomoc na špecializovaných linkách pomoci pre hazardné hranie.
      </p>
    </div>
  );
}
