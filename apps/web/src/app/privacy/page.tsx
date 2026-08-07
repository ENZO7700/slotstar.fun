import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <h1 className="text-3xl font-black tracking-tight text-zinc-100">Ochrana osobných údajov</h1>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Naša webová stránka SlotStars.fun rešpektuje vaše súkromie. Zhromažďujeme iba minimálne technické údaje nevyhnutné na prevádzku webu a analýzu návštevnosti pomocou cookies.
      </p>

      <section className="space-y-3 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-lg font-bold text-amber-500">Aké dáta spracovávame</h2>
        <p className="text-sm text-zinc-300">
          Nezbierame osobné údaje ako meno, e-mail ani platobné informácie, keďže naša platforma nevyžaduje registráciu ani neumožňuje vklady. Sledujeme iba anonymné štatistiky používania stránky.
        </p>
      </section>

      <p className="text-xs text-zinc-500">
        Posledná aktualizácia: august 2026.
      </p>
    </div>
  );
}
