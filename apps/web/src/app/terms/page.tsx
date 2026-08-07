import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <h1 className="text-3xl font-black tracking-tight text-zinc-100">Všeobecné obchodné podmienky</h1>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Vitajte na stránke SlotStars.fun. Vstupom na túto stránku súhlasíte s týmito podmienkami používania.
      </p>

      <section className="space-y-3 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-lg font-bold text-amber-500">Pravidlá používania</h2>
        <p className="text-sm text-zinc-300">
          Všetok obsah na stránke vrátane textov, kódov a grafických prvkov je určený výhradne na osobné nekomerčné použitie. Zneužívanie alebo kopírovanie herných demo embedov je zakázané.
        </p>
      </section>

      <p className="text-xs text-zinc-500">
        Posledná aktualizácia: august 2026.
      </p>
    </div>
  );
}
