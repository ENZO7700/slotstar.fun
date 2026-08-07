#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# seed-blog-posts.sh — Seeds 5 Slovak blog articles into WordPress
# WebSupport MySQL 8.4 compatible
# Usage: DB_PASS=secret bash infra/scripts/seed-blog-posts.sh
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

DB_HOST="${DB_HOST:-db.r1.websupport.sk}"
DB_PORT="${DB_PORT:-3317}"
DB_NAME="${DB_NAME:-b4xq5Yx9}"
DB_USER="${DB_USER:-bYynBm5S}"
DB_PASS="${DB_PASS:-}"

if [[ -z "$DB_PASS" ]]; then
  echo "❌ DB_PASS environment variable is required."
  exit 1
fi

MYSQL="mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASS $DB_NAME"

echo "🌱 Seeding 5 blog posts into WordPress..."

$MYSQL <<'SQL'
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_520_ci;

-- Author ID = 1 (admin)
SET @author = 1;
SET @now    = NOW();

-- ── Post 1 ──────────────────────────────────────────────────────
INSERT INTO wp_posts
  (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,
   post_status, comment_status, ping_status, post_name, post_type,
   post_modified, post_modified_gmt, to_ping, pinged, post_content_filtered)
VALUES (
  @author, @now, UTC_TIMESTAMP(),
  '<p>Demo kasíno hry sú skvelý spôsob ako spoznať herný svet bez rizika. Na SlotStar.fun nájdete stovky titulov od Pragmatic Play, NetEnt, Play&apos;n GO a ďalších popredných vývojárov zadarmo.</p><h2>Čo sú demo hry?</h2><p>Demo verzia je bezplatná simulácia originálu. Máte k dispozícii virtuálne kredity a môžete si otestovať RTP, volatilitu aj bonus rundy — všetko bez vkladu.</p><p>Najlepšie demo sloty roku 2026 ponúkajú grafiku, zvuky a mechaniky totožné s reálnymi verziami.</p>',
  'Top 10 Demo Slotov 2026: Najlepšie bezplatné kasíno hry',
  'Zoznam 10 najlepších demo kasíno hier, ktoré musíte vyskúšať v roku 2026. Od Pragmatic Play až po NetEnt.',
  'publish', 'closed', 'closed',
  'top-10-demo-slotov-2026',
  'post', @now, UTC_TIMESTAMP(), '', '', ''
);

-- ── Post 2 ──────────────────────────────────────────────────────
INSERT INTO wp_posts
  (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,
   post_status, comment_status, ping_status, post_name, post_type,
   post_modified, post_modified_gmt, to_ping, pinged, post_content_filtered)
VALUES (
  @author, DATE_SUB(@now, INTERVAL 3 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 3 DAY),
  '<p>Pragmatic Play je jedným z najproduktívnejších vydavateľov kasíno slotov na svete. Ich portfólio zahŕňa stovky titulov s rôznou volatilitou a témami.</p><h2>Najpopulárnejšie hry Pragmatic Play</h2><ul><li><strong>Gates of Olympus</strong> — vysoká volatilita, znásobovače</li><li><strong>Sweet Bonanza</strong> — kaskádové výhry, Tumble mechanika</li><li><strong>Big Bass Bonanza</strong> — rybárska téma, zberné symboly</li></ul><p>Všetky tieto hry si môžete zadarmo vyskúšať na SlotStar.fun.</p>',
  'Pragmatic Play: Kompletný sprievodca hrami a funkciami',
  'Objavte kompletný prehľad hier od Pragmatic Play — od Gates of Olympus po Sweet Bonanza.',
  'publish', 'closed', 'closed',
  'pragmatic-play-sprievodca',
  'post', DATE_SUB(@now, INTERVAL 3 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 3 DAY), '', '', ''
);

-- ── Post 3 ──────────────────────────────────────────────────────
INSERT INTO wp_posts
  (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,
   post_status, comment_status, ping_status, post_name, post_type,
   post_modified, post_modified_gmt, to_ping, pinged, post_content_filtered)
VALUES (
  @author, DATE_SUB(@now, INTERVAL 7 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY),
  '<p>RTP (Return to Player) je percento, ktoré slot vracia hráčom v dlhodobom horizonte. Napríklad slot s RTP 96% vracia teoreticky 96 centov z každého vloženého eura.</p><h2>Volatilita vs RTP</h2><p>Volatilita opisuje frekvenciu a veľkosť výplat. Vysoká volatilita znamená zriedkavejšie, ale vyššie výhry. Nízka volatilita znamená časté, malé výplaty.</p><h2>Ako to využiť?</h2><p>Pri testovaní cez demo verzie sledujte, ako hra reaguje. Ak chcete dlhší herný čas, volte nízku volatilitu. Ak hľadáte veľké výhry, skúste vysokú volatilitu.</p>',
  'Čo je RTP a volatilita? Slovenský slovník kasíno pojmov',
  'Vysvetlenie RTP, volatility a ďalších dôležitých pojmov zo sveta kasíno hier.',
  'publish', 'closed', 'closed',
  'co-je-rtp-a-volatilita',
  'post', DATE_SUB(@now, INTERVAL 7 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY), '', '', ''
);

-- ── Post 4 ──────────────────────────────────────────────────────
INSERT INTO wp_posts
  (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,
   post_status, comment_status, ping_status, post_name, post_type,
   post_modified, post_modified_gmt, to_ping, pinged, post_content_filtered)
VALUES (
  @author, DATE_SUB(@now, INTERVAL 14 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 14 DAY),
  '<p>Starburst od NetEnt je bezpochyby ikonou sveta online slotov. Od svojho vydania v roku 2012 patrí medzi 5 najhranejších slotov na svete.</p><h2>Prečo je Starburst taký populárny?</h2><ul><li>Jednoduchá mechanika — ideálne pre začiatočníkov</li><li>Expanding Wild symboly — rozšíria sa na celý stĺpec</li><li>Obojsmerné výhry — zľava aj zprava</li><li>RTP 96,09% a nízka volatilita</li></ul><p>Vyskúšajte Starburst demo zadarmo na SlotStar.fun a sami posúďte jeho kúzlo.</p>',
  'Starburst od NetEnt: Prečo je najobľúbenejším slotom všetkých čias?',
  'Starburst od NetEnt je ikona. Zistite prečo ho milujú hráči na celom svete.',
  'publish', 'closed', 'closed',
  'starburst-netent-recenzia',
  'post', DATE_SUB(@now, INTERVAL 14 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 14 DAY), '', '', ''
);

-- ── Post 5 ──────────────────────────────────────────────────────
INSERT INTO wp_posts
  (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,
   post_status, comment_status, ping_status, post_name, post_type,
   post_modified, post_modified_gmt, to_ping, pinged, post_content_filtered)
VALUES (
  @author, DATE_SUB(@now, INTERVAL 21 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 21 DAY),
  '<p>Zodpovedné hranie je základ každej skvelej hernej platformy. Na SlotStar.fun sa zameriavame výhradne na demo hry — žiadne reálne stávky, žiadne finančné riziko.</p><h2>Prečo hrať len demo verzie?</h2><ul><li>Žiadne finančné riziko — len virtuálne kredity</li><li>Ideálne na spoznanie hry pred reálnym vkladom</li><li>Zábava bez záväzkov</li><li>Vhodné pre všetkých bez ohľadu na skúsenosti</li></ul><p>Pamätajte: demo hry sú výhradne na zábavné účely. Ak máte problém s hazardným hraním, vyhľadajte odbornú pomoc.</p>',
  'Zodpovedné hranie: Prečo sú demo hry bezpečnou voľbou',
  'Demo hry sú ideálne pre zábavné hranie bez rizika. Spoznajte zásady zodpovedného hrania.',
  'publish', 'closed', 'closed',
  'zodpovedne-hranie-demo-hry',
  'post', DATE_SUB(@now, INTERVAL 21 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 21 DAY), '', '', ''
);

SELECT 'Blog posts seeded successfully!' AS status;
SQL

echo "✅ Done! 5 blog posts inserted into WordPress."
echo "🔗 Check: http://slotstars.kestudio.sk/wp-admin/edit.php"
