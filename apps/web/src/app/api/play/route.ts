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

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch game details from CMS' }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.embedUrl) {
      return NextResponse.json({ error: 'Demo play is not active for this game' }, { status: 403 });
    }

    return NextResponse.json({ embedUrl: data.embedUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
