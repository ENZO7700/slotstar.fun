import { test, expect } from '@playwright/test';

test('marketing homepage loads editorial hero without catalog sidebar', async ({ page }) => {
  await page.goto('/');

  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();
  await expect(heading).toContainText(/SLOT/i);

  const nav = page.locator('nav').first();
  await expect(nav).toBeVisible();

  // Marketing shell: no catalog sidebar
  const sidebar = page.locator('aside').first();
  await expect(sidebar).toHaveCount(0);

  await expect(page.getByRole('link', { name: /HRAŤ DEMO/i }).first()).toBeVisible();
});

test('marketing homepage has no unintentional horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const hasHorizontalScroll = await page.evaluate(() => {
    return document.body.scrollWidth > document.documentElement.clientWidth;
  });
  expect(hasHorizontalScroll).toBe(false);
});
