/**
 * WordPress Taxonomy & Category Generator for SlotStar.fun
 * 
 * Target: https://slotstars.kestudio.sk/wp-admin/edit-tags.php?taxonomy=category
 */

const categories = {
  themes: [
    { name: 'Egypt & Pyramídy', slug: 'egypt', description: 'Automaty s témou starovekého Egypta, faraónov a kníh.' },
    { name: 'Ovocné Klasiky', slug: 'fruit', description: 'Tradičné 3-valcové a 5-valcové ovocné automaty s 777 symbolmi.' },
    { name: 'Mytológia & Bohovia', slug: 'mythology', description: 'Grécka, severská a rímska mytológia, Zeus, Thor a Olymp.' },
    { name: 'Divoký Západ', slug: 'wild-west', description: 'Kovbojské automaty, šerifovia, salóny a lúpeže.' },
    { name: 'Drahokamy & Diamanty', slug: 'gems', description: 'Trblietavé klenoty, žiarivé kryštály a diamantové výhry.' },
    { name: 'Dobrodružstvo', slug: 'adventure', description: 'Hľadanie stratených pokladov, piráti a expedície.' },
    { name: 'Fantasy & Mágia', slug: 'fantasy', description: 'Rozprávkové svety, čarodejníci, drakovia a mágia.' },
    { name: 'Zvieratá & Ryby', slug: 'animal', description: 'Divoká príroda, rybárčenie (Big Bass), safari a vlci.' },
    { name: 'Sci-Fi & Vesmír', slug: 'scifi', description: 'Futuristické vesmírne automaty a neónový cyberpunk.' },
    { name: 'Ázijské & Draky', slug: 'asian', description: 'Orientálne motívy, čínske drakovia a symboly šťastia.' },
  ],
  types: [
    { name: 'Megaways™ Automaty', slug: 'megaways', description: 'Automaty s tisíckami výherných línií a dynamickými valcami.' },
    { name: 'Video Automaty', slug: 'video-slot', description: 'Moderné 5-valcové hracie automaty s animovanými grafikami.' },
    { name: 'Klasické Automaty', slug: 'classic-slot', description: 'Tradičné 3-valcové automaty s jednoduchou hrateľnosťou.' },
    { name: 'Jackpot Automaty', slug: 'jackpot', description: 'Automaty s progresívnymi a pevnými jackpotovými výhrami.' },
    { name: 'Bonus Buy Automaty', slug: 'bonus-buy', description: 'Automaty s možnosťou okamžitého zakúpenia free spinov.' },
    { name: 'Cluster Pays', slug: 'cluster-pay', description: 'Výherné automaty na princípe spájania zhlukov symbolov.' },
  ],
  filters: [
    { name: 'Gold Tier (VIP)', slug: 'gold', description: 'Najprestížnejšie certifikované hity s vysokou návratnosťou (RTP).' },
    { name: 'Silver Tier', slug: 'silver', description: 'Vysoko hodnotené obľúbené automaty.' },
    { name: 'Bronze Tier', slug: 'bronze', description: 'Kvalitné štandardné slotové tituly.' },
    { name: 'Trending Hity', slug: 'trending', description: 'Automaty s najrýchlejšie rastúcim počtom hráčov.' },
  ]
};

console.log('====================================================');
console.log('🎰 SLOTSTAR WORDPRESS CATEGORIES & TAXONOMY PLAN 🎰');
console.log('====================================================\n');

console.log('--- 1. TÉMY (category / slotsl-theme) ---');
categories.themes.forEach(t => console.log(`• [${t.slug}] ${t.name} -> ${t.description}`));

console.log('\n--- 2. TYPY HIER (slotsl-type) ---');
categories.types.forEach(t => console.log(`• [${t.slug}] ${t.name} -> ${t.description}`));

console.log('\n--- 3. FILTRE A TRIEDY (slotsl-filter) ---');
categories.filters.forEach(t => console.log(`• [${t.slug}] ${t.name} -> ${t.description}`));

console.log('\n====================================================');
console.log('💡 WP-CLI PRÍKAZY PRE JEDNODUCHÉ VLOŽENIE NA SERVERI:');
console.log('====================================================\n');

categories.themes.forEach(t => {
  console.log(`wp term create category "${t.name}" --slug="${t.slug}" --description="${t.description}"`);
});
categories.types.forEach(t => {
  console.log(`wp term create slotsl-type "${t.name}" --slug="${t.slug}" --description="${t.description}"`);
});
categories.filters.forEach(t => {
  console.log(`wp term create slotsl-filter "${t.name}" --slug="${t.slug}" --description="${t.description}"`);
});

module.exports = { categories };
