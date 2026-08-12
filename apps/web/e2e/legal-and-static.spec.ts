import { test, expect } from '@playwright/test';

test.describe('Legal and Static Pages', () => {
  test('Privacy Policy (/privacy) page should render correct heading and privacy info', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Ochrana osobných údajov/i);
    await expect(page.getByText(/SlotStar/i).first()).toBeVisible();
  });

  test('Terms (/terms) page should render terms content', async ({ page }) => {
    await page.goto('/terms');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('Responsible Gaming (/responsible-gaming) page should render responsible gaming warning', async ({ page }) => {
    await page.goto('/responsible-gaming');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
