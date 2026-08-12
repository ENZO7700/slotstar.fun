import { test, expect } from '@playwright/test';

test.describe('API Routes (/api)', () => {
  test('GET /api/play without id param returns 400 Bad Request', async ({ request }) => {
    const res = await request.get('/api/play');
    expect(res.status()).toBe(400);

    const json = await res.json();
    expect(json.error).toBe('Missing game ID');
  });

  test('GET /api/play with non-numeric id returns 400 Bad Request', async ({ request }) => {
    const res = await request.get('/api/play?id=abc');
    expect(res.status()).toBe(400);

    const json = await res.json();
    expect(json.error).toBe('Invalid game ID');
  });

  test('GET /api/play with valid numeric id returns embedUrl', async ({ request }) => {
    const res = await request.get('/api/play?id=1001');
    expect(res.status()).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty('embedUrl');
    expect(typeof json.embedUrl).toBe('string');
    expect(json.embedUrl).toMatch(/^https?:\/\//);
  });
});
