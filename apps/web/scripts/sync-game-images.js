/* eslint-disable */
const fs = require('fs');
const path = require('path');

const HEADLESS_API_URL = 'https://slotstars.kestudio.sk/wp-json/slotstar/v1/games';
const OUTPUT_DIR = path.join(__dirname, '../public/images/games');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Known high-res fallback thumbnails for games without direct image URLs
const STATIC_FALLBACKS = {
  'razor-shark-4001': 'https://static.casino.guru/pict/87968/Razor-Shark.png',
  'reactoonz-3002': 'https://static.casino.guru/pict/87962/Reactoonz.png',
  'book-of-dead-3001': 'https://static.casino.guru/pict/87950/Book-of-Dead.png',
  'gonzos-quest-2002': 'https://static.casino.guru/pict/87954/Gonzos-Quest.png',
  'starburst-2001': 'https://static.casino.guru/pict/87948/Starburst.png',
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
  
  if (fs.existsSync(outputPath)) {
    console.log(`[SKIP] Image already exists for ${slug}`);
    return true;
  }

  try {
    const res = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      }
    });
    if (!res.ok) return false;

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) return false;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(outputPath, buffer);
    console.log(`[SUCCESS] Saved ${slug}.png (${buffer.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`[ERROR] Failed to download from ${imgUrl}: ${err.message}`);
    return false;
  }
}

async function syncImages() {
  const games = await fetchGames();
  console.log(`Found ${games.length} games to process.\n`);

  for (const game of games) {
    const slug = game.slug;
    const name = game.name || slug;
    let imgUrl = game.thumbnail?.src;

    // If thumbnail URL is an HTML page (like Play'n GO / Push Gaming embeds), use fallback map
    if (!imgUrl || imgUrl.endsWith('.html') || imgUrl.includes('/index.html')) {
      imgUrl = STATIC_FALLBACKS[slug] || null;
    }

    if (!imgUrl) {
      console.log(`[WARNING] No valid image source found for ${name} (${slug})`);
      continue;
    }

    let success = false;
    if (imgUrl) {
      success = await downloadImage(slug, imgUrl);
    }

    if (!success && STATIC_FALLBACKS[slug]) {
      console.log(`[RETRY] Attempting static fallback for ${name}...`);
      await downloadImage(slug, STATIC_FALLBACKS[slug]);
    }

    await new Promise(resolve => setTimeout(resolve, 150));
  }
  console.log('\n✅ Image sync complete!');
}

syncImages();
