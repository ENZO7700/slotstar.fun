import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${env.WORDPRESS_API_URL}/slotstar/v1/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      return NextResponse.json({
        status: 'ready',
        wordpress: true,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        status: 'degraded',
        wordpress: false,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  } catch {
    return NextResponse.json(
      {
        status: 'degraded',
        wordpress: false,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
