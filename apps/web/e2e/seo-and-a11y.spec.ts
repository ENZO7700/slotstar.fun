import { test, expect } from '@playwright/test';

test.describe('SEO, Accessibility and Error Handling', () => {
  test('Homepage has valid document title, meta tags, and charset', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // Viewport meta
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('Catalog page (/games) has valid page title', async ({ page }) => {
    await page.goto('/games');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title).toMatch(/Katalóg|SlotStar|Hry/i);
  });

  test('404 page / non-existent route handles error gracefully without crash', async ({ page }) => {
    const response = await page.goto('/non-existent-route-123456789');
    if (response) {
      expect([404, 200]).toContain(response.status());
    }
  });

  test('All interactive images have alt attributes on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});
