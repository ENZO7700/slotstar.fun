import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');
  
  if (!idStr) {
    return NextResponse.json({ error: 'Missing game ID' }, { status: 400 });
  }

  const externalId = parseInt(idStr, 10);
  if (isNaN(externalId)) {
    return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
  }

  try {
    // Generate signature payload
    const timestamp = Math.floor(Date.now() / 1000);
    const method = 'POST';
    const path = `/slotstar/v1/internal/launch/${externalId}`;
    
    // Empty request body representation
    const body = '';
    const bodyHash = crypto.createHash('sha256').update(body).digest('hex');
    
    const message = `${timestamp}.${method}.${path}.${bodyHash}`;
    
    // Retrieve bridge secret key from private server environment variable
    const secret = process.env.SLOTSTAR_BRIDGE_SECRET || 'local_bridge_secret_secure_928374';
    
    const signature = crypto.createHmac('sha256', secret).update(message).digest('hex');

    // Secure POST call to internal WordPress launch endpoint
    const response = await fetch(`${env.WORDPRESS_API_URL}/slotstar/v1/internal/launch/${externalId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-SlotStar-Signature': signature,
        'X-SlotStar-Timestamp': String(timestamp),
      },
      body: body,
      next: { revalidate: 0 }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.embedUrl) {
        return NextResponse.json({ embedUrl: data.embedUrl });
      }
    }

    // Fallback: If CMS launch fails or returns no embedUrl, fetch game details to construct direct demo URL
    const gameRes = await fetch(`${env.WORDPRESS_API_URL}/slotstar/v1/games/${externalId}`, {
      next: { revalidate: 300 }
    });

    if (gameRes.ok) {
      const gameData = await gameRes.json();
      const gameSlug = gameData.slug || `game-${externalId}`;
      const fallbackUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${gameSlug}&jurisdictionID=99&cur=EUR&lobbyUrl=https://slotstar.fun`;
      return NextResponse.json({ embedUrl: fallbackUrl });
    }

    // Generic fallback if game detail is unavailable
    const fallbackUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&jurisdictionID=99&cur=EUR&lobbyUrl=https://slotstar.fun`;
    return NextResponse.json({ embedUrl: fallbackUrl });

  } catch {
    // Robust fallback for any network error
    const fallbackUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&jurisdictionID=99&cur=EUR&lobbyUrl=https://slotstar.fun`;
    return NextResponse.json({ embedUrl: fallbackUrl });
  }
}
