const fs = require('fs');

const WP_URL = 'https://slotstars.kestudio.sk/wp-json/wp/v2/posts';
const USER = 'larsenevans';
const PASS = '5bejiRmKkQ81NR0KJOqiVkEa'; // removed spaces for Basic Auth

const credentials = btoa(`${USER}:${PASS}`);

const posts = [
  {
    title: 'Top 10 Demo Slotov 2026: Najlepšie bezplatné kasíno hry',
    content: '<p>Demo kasíno hry sú skvelý spôsob ako spoznať herný svet bez rizika. Na SlotStar.fun nájdete stovky titulov od Pragmatic Play, NetEnt, Play&apos;n GO a ďalších popredných vývojárov zadarmo.</p><h2>Čo sú demo hry?</h2><p>Demo verzia je bezplatná simulácia originálu. Máte k dispozícii virtuálne kredity a môžete si otestovať RTP, volatilitu aj bonus rundy — všetko bez vkladu.</p><p>Najlepšie demo sloty roku 2026 ponúkajú grafiku, zvuky a mechaniky totožné s reálnymi verziami.</p>',
    excerpt: 'Zoznam 10 najlepších demo kasíno hier, ktoré musíte vyskúšať v roku 2026. Od Pragmatic Play až po NetEnt.',
    status: 'publish',
  },
  {
    title: 'Pragmatic Play: Kompletný sprievodca hrami a funkciami',
    content: '<p>Pragmatic Play je jedným z najproduktívnejších vydavateľov kasíno slotov na svete. Ich portfólio zahŕňa stovky titulov s rôznou volatilitou a témami.</p><h2>Najpopulárnejšie hry Pragmatic Play</h2><ul><li><strong>Gates of Olympus</strong> — vysoká volatilita, znásobovače</li><li><strong>Sweet Bonanza</strong> — kaskádové výhry, Tumble mechanika</li><li><strong>Big Bass Bonanza</strong> — rybárska téma, zberné symboly</li></ul><p>Všetky tieto hry si môžete zadarmo vyskúšať na SlotStar.fun.</p>',
    excerpt: 'Objavte kompletný prehľad hier od Pragmatic Play — od Gates of Olympus po Sweet Bonanza.',
    status: 'publish',
  },
  {
    title: 'Čo je RTP a volatilita? Slovenský slovník kasíno pojmov',
    content: '<p>RTP (Return to Player) je percento, ktoré slot vracia hráčom v dlhodobom horizonte. Napríklad slot s RTP 96% vracia teoreticky 96 centov z každého vloženého eura.</p><h2>Volatilita vs RTP</h2><p>Volatilita opisuje frekvenciu a veľkosť výplat. Vysoká volatilita znamená zriedkavejšie, ale vyššie výhry. Nízka volatilita znamená časté, malé výplaty.</p><h2>Ako to využiť?</h2><p>Pri testovaní cez demo verzie sledujte, ako hra reaguje. Ak chcete dlhší herný čas, volte nízku volatilitu. Ak hľadáte veľké výhry, skúste vysokú volatilitu.</p>',
    excerpt: 'Vysvetlenie RTP, volatility a ďalších dôležitých pojmov zo sveta kasíno hier.',
    status: 'publish',
  },
  {
    title: 'Starburst od NetEnt: Prečo je najobľúbenejším slotom všetkých čias?',
    content: '<p>Starburst od NetEnt je bezpochyby ikonou sveta online slotov. Od svojho vydania v roku 2012 patrí medzi 5 najhranejších slotov na svete.</p><h2>Prečo je Starburst taký populárny?</h2><ul><li>Jednoduchá mechanika — ideálne pre začiatočníkov</li><li>Expanding Wild symboly — rozšíria sa na celý stĺpec</li><li>Obojsmerné výhry — zľava aj zprava</li><li>RTP 96,09% a nízka volatilita</li></ul><p>Vyskúšajte Starburst demo zadarmo na SlotStar.fun a sami posúďte jeho kúzlo.</p>',
    excerpt: 'Starburst od NetEnt je ikona. Zistite prečo ho milujú hráči na celom svete.',
    status: 'publish',
  },
  {
    title: 'Zodpovedné hranie: Prečo sú demo hry bezpečnou voľbou',
    content: '<p>Zodpovedné hranie je základ každej skvelej hernej platformy. Na SlotStar.fun sa zameriavame výhradne na demo hry — žiadne reálne stávky, žiadne finančné riziko.</p><h2>Prečo hrať len demo verzie?</h2><ul><li>Žiadne finančné riziko — len virtuálne kredity</li><li>Ideálne na spoznanie hry pred reálnym vkladom</li><li>Zábava bez záväzkov</li><li>Vhodné pre všetkých bez ohľadu na skúsenosti</li></ul><p>Pamätajte: demo hry sú výhradne na zábavné účely. Ak máte problém s hazardným hraním, vyhľadajte odbornú pomoc.</p>',
    excerpt: 'Demo hry sú ideálne pre zábavné hranie bez rizika. Spoznajte zásady zodpovedného hrania.',
    status: 'publish',
  }
];

async function seed() {
  console.log('🌱 Seeding blog posts via WordPress REST API...');

  for (const post of posts) {
    try {
      const res = await fetch(WP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(post)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ Failed to create post: ${post.title}`);
        console.error(`Status: ${res.status}`, errorText);
      } else {
        const data = await res.json();
        console.log(`✅ Created: ${data.title.rendered} (ID: ${data.id})`);
      }
    } catch (err) {
      console.error(`❌ Network error for post: ${post.title}`, err);
    }
  }
  console.log('🎉 Seeding complete!');
}

seed();
