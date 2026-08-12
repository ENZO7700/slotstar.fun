import { test, expect } from '@playwright/test';

test.describe('Game Detail Page (/games/[provider]/[game])', () => {
  test('should handle valid game detail with slug format and numeric external ID', async ({ page }) => {
    // Navigate to a valid game slug URL (e.g. gates-of-olympus-1001)
    await page.goto('/games/pragmatic-play/gates-of-olympus-1001');
    await page.waitForLoadState('networkidle');

    // Breadcrumbs
    const homeLink = page.getByRole('link', { name: 'Domov' }).first();
    await expect(homeLink).toBeVisible();

    const gamesLink = page.getByRole('link', { name: 'Hry' }).first();
    await expect(gamesLink).toBeVisible();

    // Game heading
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
    await expect(title).toContainText(/Gates of Olympus/i);

    // Specifications panel (RTP, Volatilita)
    await expect(page.getByText('RTP')).toBeVisible();
    await expect(page.getByText('Volatilita')).toBeVisible();
  });

  test('should render empty state for invalid game slug without numeric ID', async ({ page }) => {
    await page.goto('/games/pragmatic-play/invalid-game-slug-no-id');
    await page.waitForLoadState('networkidle');

    const emptyTitle = page.getByText(/Neplatný formát hry/i);
    await expect(emptyTitle).toBeVisible();

    const backButton = page.getByRole('link', { name: /Späť na katalóg/i });
    await expect(backButton).toBeVisible();
    await backButton.click();

    await page.waitForURL('/games');
    expect(page.url()).toContain('/games');
  });

  test('should render 404 empty state when game ID does not exist in backend', async ({ page }) => {
    await page.goto('/games/pragmatic-play/non-existent-game-99999999');
    await page.waitForLoadState('networkidle');

    const emptyTitle = page.getByText(/Hra sa nenašla/i);
    await expect(emptyTitle).toBeVisible();
  });
});
