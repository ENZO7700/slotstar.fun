import { test, expect } from '@playwright/test';

test.describe('Game Collections Pages', () => {
  test('New Games Page (/new-games) should render heading and games grid', async ({ page }) => {
    await page.goto('/new-games');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Najnovšie demo automaty/i);
  });

  test('Featured Games Page (/featured) should render heading', async ({ page }) => {
    await page.goto('/featured');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('Upcoming Games Page (/upcoming) should render heading', async ({ page }) => {
    await page.goto('/upcoming');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
