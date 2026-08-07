#!/usr/bin/env bash
# =====================================================
# SLOTSTAR — DEMO SLOTS SEED SCRIPT
# Inserts 10 popular demo slots directly into WP DB
# =====================================================

set -euo pipefail

DB_HOST="db.r1.websupport.sk"
DB_PORT="3317"
DB_NAME="b4xq5Yx9"
DB_USER="bYynBm5S"
DB_PASS="bYynBm5SbYynBm5S@"

echo "🎰 Inserting demo slots into WordPress database..."

mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASS}" --default-character-set=utf8mb4 "${DB_NAME}" <<'SQL'

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_520_ci;

-- 1. Ensure provider terms exist
INSERT IGNORE INTO wp_terms (name, slug, term_group) VALUES
  ('Pragmatic Play', 'pragmatic-play', 0),
  ('NetEnt',         'netent',         0),
  ('Play''n GO',     'playn-go',       0),
  ('Push Gaming',    'push-gaming',    0);

INSERT IGNORE INTO wp_term_taxonomy (term_id, taxonomy, description, parent, count)
SELECT t.term_id, 'sl-provider', '', 0, 0
FROM wp_terms t
WHERE t.slug IN ('pragmatic-play', 'netent', 'playn-go', 'push-gaming')
  AND NOT EXISTS (
    SELECT 1 FROM wp_term_taxonomy tt
    WHERE tt.term_id = t.term_id AND tt.taxonomy = 'sl-provider'
  );

-- 2. Drop existing procedure if exists
DROP PROCEDURE IF EXISTS insert_demo_slot;

DELIMITER //
CREATE PROCEDURE insert_demo_slot(
  IN p_title      VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  IN p_slug       VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  IN p_thumb      TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  IN p_slot_url   TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  IN p_provider   VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  IN p_rtp        VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  IN p_volatility VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci,
  IN p_slpid      INT
)
BEGIN
  DECLARE v_post_id BIGINT;
  DECLARE v_term_tax_id BIGINT;

  -- Insert post
  INSERT INTO wp_posts (
    post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,
    post_status, comment_status, ping_status, post_name, to_ping, pinged,
    post_modified, post_modified_gmt, post_content_filtered, post_parent,
    guid, menu_order, post_type, post_mime_type, comment_count
  ) VALUES (
    1, NOW(), UTC_TIMESTAMP(), '', p_title, '',
    'publish', 'closed', 'closed', p_slug, '', '',
    NOW(), UTC_TIMESTAMP(), '', 0,
    CONCAT('https://slotstar.kestudio.sk/?post_type=slotsl&p=', UUID()), 0, 'slotsl', '', 0
  );

  SET v_post_id = LAST_INSERT_ID();

  -- Meta fields
  INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (v_post_id, 'slimg', p_thumb);
  INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (v_post_id, 'slot_url', p_slot_url);
  INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (v_post_id, 'slpid', p_slpid);
  INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (v_post_id, 'slot_attrs', CONCAT('a:2:{s:3:"rtp";s:', LENGTH(p_rtp), ':"', p_rtp, '";s:10:"volatility";s:', LENGTH(p_volatility), ':"', p_volatility, '";}'));

  -- Link taxonomy
  SELECT tt.term_taxonomy_id INTO v_term_tax_id
  FROM wp_term_taxonomy tt
  JOIN wp_terms t ON t.term_id = tt.term_id
  WHERE t.slug = p_provider AND tt.taxonomy = 'sl-provider'
  LIMIT 1;

  IF v_term_tax_id IS NOT NULL THEN
    INSERT IGNORE INTO wp_term_relationships (object_id, term_taxonomy_id) VALUES (v_post_id, v_term_tax_id);
    UPDATE wp_term_taxonomy SET count = count + 1 WHERE term_taxonomy_id = v_term_tax_id;
  END IF;

END //
DELIMITER ;

-- 3. Insert 10 Demo Slots
CALL insert_demo_slot('Gates of Olympus', 'gates-of-olympus', 'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs20olympgate.png', 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&jurisdictionID=99&cur=EUR&lobbyUrl=https://slotstar.fun', 'pragmatic-play', '96.50', 'High', 1001);
CALL insert_demo_slot('Sweet Bonanza', 'sweet-bonanza', 'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs20fruitsw.png', 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20fruitsw&jurisdictionID=99&cur=EUR&lobbyUrl=https://slotstar.fun', 'pragmatic-play', '96.51', 'High', 1002);
CALL insert_demo_slot('Big Bass Bonanza', 'big-bass-bonanza', 'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs10fishin.png', 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs10fishin&jurisdictionID=99&cur=EUR&lobbyUrl=https://slotstar.fun', 'pragmatic-play', '96.71', 'High', 1003);
CALL insert_demo_slot('Wolf Gold', 'wolf-gold', 'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs25wolfgold.png', 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs25wolfgold&jurisdictionID=99&cur=EUR&lobbyUrl=https://slotstar.fun', 'pragmatic-play', '96.01', 'Medium', 1004);
CALL insert_demo_slot('Starburst', 'starburst', 'https://casino-cdn.casinomodule.com/games/starburst-touch/gameIcon/starburst-touch_en_240x240.jpg', 'https://casino-cdn.casinomodule.com/games/starburst-touch/game/starburst-touch.xhtml', 'netent', '96.09', 'Low', 2001);
CALL insert_demo_slot('Gonzo''s Quest', 'gonzos-quest', 'https://casino-cdn.casinomodule.com/games/gonzosquest-touch/gameIcon/gonzosquest-touch_en_240x240.jpg', 'https://casino-cdn.casinomodule.com/games/gonzosquest-touch/game/gonzosquest-touch.xhtml', 'netent', '95.97', 'Medium', 2002);
CALL insert_demo_slot('Book of Dead', 'book-of-dead', 'https://www.playngonetwork.com/casino/html/BookofDead/index.html', 'https://www.playngonetwork.com/casino/html/BookofDead/index.html', 'playn-go', '96.21', 'High', 3001);
CALL insert_demo_slot('Reactoonz', 'reactoonz', 'https://www.playngonetwork.com/casino/html/Reactoonz2/index.html', 'https://www.playngonetwork.com/casino/html/Reactoonz2/index.html', 'playn-go', '96.00', 'High', 3002);
CALL insert_demo_slot('Razor Shark', 'razor-shark', 'https://m.pgw.pushgaming.com/games/razor-shark/index.html', 'https://m.pgw.pushgaming.com/games/razor-shark/index.html', 'push-gaming', '96.70', 'High', 4001);
CALL insert_demo_slot('Fruit Party', 'fruit-party', 'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs20fruitparty.png', 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20fruitparty&jurisdictionID=99&cur=EUR&lobbyUrl=https://slotstar.fun', 'pragmatic-play', '96.47', 'High', 1005);

DROP PROCEDURE IF EXISTS insert_demo_slot;

SELECT '✅ Demo slots inserted successfully!' AS result;
SELECT COUNT(*) as total_slots FROM wp_posts WHERE post_type='slotsl' AND post_status='publish';

SQL
