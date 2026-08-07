import { test, expect } from '@playwright/test';

test('homepage loads and shows hero section', async ({ page }) => {
  await page.goto('/');

  // Check the main heading
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();

  // Basic check that the navigation exists
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();
});
