/* eslint-disable */
const fs = require('fs');
const path = require('path');

const HEADLESS_API_URL = 'https://slotstars.kestudio.sk/wp-json/slotstar/v1/games';
const OUTPUT_DIR = path.join(__dirname, '../public/images/games');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Robust fallback image URLs for all 10 slots
const GAME_FALLBACKS = {
  'gates-of-olympus-1001': [
    'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs20olympgate.png',
    'https://img.freepik.com/free-vector/slot-machine-banner-gambling-header_107791-3269.jpg'
  ],
  'sweet-bonanza-1002': [
    'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs20fruitsw.png',
  ],
  'big-bass-bonanza-1003': [
    'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs10fishin.png',
  ],
  'wolf-gold-1004': [
    'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs25wolfgold.png',
  ],
  'fruit-party-1005': [
    'https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/vs20fruitparty.png',
  ],
  'starburst-2001': [
    'https://www.netent.com/content/uploads/2020/06/starburst.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Starburst_slot.png/640px-Starburst_slot.png'
  ],
  'gonzos-quest-2002': [
    'https://www.netent.com/content/uploads/2020/06/gonzos-quest.jpg',
  ],
  'book-of-dead-3001': [
    'https://www.playngo.com/images/games/book-of-dead.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Book_of_Dead_Slot.jpg/640px-Book_of_Dead_Slot.jpg'
  ],
  'reactoonz-3002': [
    'https://www.playngo.com/images/games/reactoonz.jpg',
  ],
  'razor-shark-4001': [
    'https://www.pushgaming.com/games/razor-shark/images/hero.jpg',
  ]
};

async function fetchGames() {
  console.log('Fetching games list from SlotStar Headless API...');
  try {
    const res = await fetch(HEADLESS_API_URL);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Error fetching games:', err.message);
    return [];
  }
}

async function downloadImage(slug, imgUrl) {
  const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);

  try {
    const res = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://demogamesfree.pragmaticplay.net/',
        'Origin': 'https://demogamesfree.pragmaticplay.net'
      }
    });

    if (!res.ok) {
      console.error(`[FAIL] HTTP ${res.status} for ${imgUrl}`);
      return false;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // CRITICAL VALIDATION: Ensure the response is a REAL binary image, NOT an SVG or HTML error page!
    const headerStr = buffer.toString('utf8', 0, 200).toLowerCase();
    if (headerStr.includes('<svg') || headerStr.includes('<!doctype') || headerStr.includes('<html') || buffer.length < 2000) {
      console.error(`[INVALID IMAGE] ${imgUrl} returned invalid image data (${buffer.length} bytes).`);
      return false;
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`[SUCCESS] Saved ${slug}.png (${buffer.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`[ERROR] Download error for ${imgUrl}: ${err.message}`, err.cause || '');
    return false;
  }
}

async function syncImages() {
  const games = await fetchGames();
  console.log(`Processing ${games.length} games...\n`);

  for (const game of games) {
    const slug = game.slug;
    const name = game.name || slug;
    
    // Clean up existing invalid SVG placeholders if any
    const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);
    if (fs.existsSync(outputPath)) {
      const existing = fs.readFileSync(outputPath);
      const str = existing.toString('utf8', 0, 100).toLowerCase();
      if (str.includes('<svg') || existing.length < 2000) {
        console.log(`[CLEANUP] Removing invalid SVG placeholder for ${slug}`);
        fs.unlinkSync(outputPath);
      }
    }

    // Candidate URLs to try in order
    const candidates = [];
    if (game.thumbnail?.src && !game.thumbnail.src.endsWith('.html') && !game.thumbnail.src.includes('/index.html')) {
      candidates.push(game.thumbnail.src);
    }
    if (GAME_FALLBACKS[slug]) {
      candidates.push(...GAME_FALLBACKS[slug]);
    }

    let success = false;
    for (const url of candidates) {
      console.log(`[TRYING] ${name} (${slug}) <- ${url}`);
      success = await downloadImage(slug, url);
      if (success) break;
    }

    if (!success) {
      console.error(`❌ [FAILED] Could not download any valid image for ${name} (${slug})`);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n✅ Image sync process finished!');
}

syncImages();
