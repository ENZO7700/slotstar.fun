import { test, expect } from '@playwright/test';

test.describe('Providers Page (/providers)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/providers');
    await page.waitForLoadState('networkidle');
  });

  test('should display provider page heading and search form', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Poskytovatelia hier/i);

    const searchInput = page.getByPlaceholder(/Hľadať poskytovateľa.../i);
    await expect(searchInput).toBeVisible();

    const searchBtn = page.getByRole('button', { name: /^Hľadať$/i });
    await expect(searchBtn).toBeVisible();
  });

  test('should display alphabet filter toolbar and allow letter filtering', async ({ page }) => {
    const allLink = page.getByRole('link', { name: 'Všetko' });
    await expect(allLink).toBeVisible();

    const letterPLink = page.getByRole('link', { name: 'P', exact: true });
    await expect(letterPLink).toBeVisible();
    await letterPLink.click();

    await page.waitForURL((url) => url.searchParams.get('letter') === 'P');
    expect(page.url()).toContain('letter=P');
  });

  test('should search providers by text query', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Hľadať poskytovateľa.../i);
    await searchInput.fill('Pragmatic');

    const searchBtn = page.getByRole('button', { name: /^Hľadať$/i });
    await searchBtn.click();

    await page.waitForURL((url) => url.searchParams.get('q') === 'Pragmatic');
    expect(page.url()).toContain('q=Pragmatic');
  });

  test('should have valid links to provider details', async ({ page }) => {
    const firstProviderCard = page.locator('a[href^="/providers/"]').first();
    if (await firstProviderCard.count() > 0) {
      const href = await firstProviderCard.getAttribute('href');
      expect(href).toMatch(/\/providers\/.+/);
    }
  });
});
