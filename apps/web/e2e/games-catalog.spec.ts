import { test, expect } from '@playwright/test';

test.describe('Games Catalog Page (/games)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/games');
    await page.waitForLoadState('networkidle');
  });

  test('should display page heading and catalog filter toolbar', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Katalóg kasíno slotov/i);

    // Quick filter pills
    await expect(page.getByRole('button', { name: /Všetky hry/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Trending/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Najhrajúcejšie/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Gold Tier/i })).toBeVisible();
  });

  test('should allow selecting quick filter pills and update URL', async ({ page }) => {
    const trendingBtn = page.getByRole('button', { name: /Trending/i });
    await trendingBtn.click();
    await page.waitForURL((url) => url.searchParams.get('orderBy') === 'trending');

    expect(page.url()).toContain('orderBy=trending');

    const mostPlayedBtn = page.getByRole('button', { name: /Najhrajúcejšie/i });
    await mostPlayedBtn.click();
    await page.waitForURL((url) => url.searchParams.get('orderBy') === 'most_played');

    expect(page.url()).toContain('orderBy=most_played');
  });

  test('should filter by desktop provider select dropdown', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const providerSelect = page.locator('select').first();
    await expect(providerSelect).toBeVisible();

    const options = await providerSelect.locator('option').allInnerTexts();
    if (options.length > 1) {
      const secondOptionValue = await providerSelect.locator('option').nth(1).getAttribute('value');
      if (secondOptionValue) {
        await providerSelect.selectOption(secondOptionValue);

        const applyBtn = page.getByRole('button', { name: /^Použiť$/i });
        await applyBtn.click();

        await page.waitForURL((url) => url.searchParams.get('provider') === secondOptionValue);
        expect(page.url()).toContain(`provider=${secondOptionValue}`);
      }
    }
  });

  test('should reset filters when Reset button is clicked', async ({ page }) => {
    await page.goto('/games?provider=pragmatic-play&orderBy=name&order=asc');
    await page.waitForLoadState('networkidle');

    await page.setViewportSize({ width: 1280, height: 800 });

    const resetBtn = page.getByRole('button', { name: /^Reset$/i });
    await resetBtn.click();

    await page.waitForURL((url) => !url.searchParams.has('provider') && !url.searchParams.has('orderBy'));
    expect(page.url()).not.toContain('provider=');
  });

  test('should show empty state message for nonexistent search or filter query', async ({ page }) => {
    await page.goto('/games?q=nonexistentgametitle99999');
    await page.waitForLoadState('networkidle');

    const emptyTitle = page.locator('h3, h2, h1, div').filter({ hasText: /Nenašli sa výsledky/i }).first();
    await expect(emptyTitle).toBeVisible();
  });

  test('should support mobile drawer filters on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const filterDrawerBtn = page.getByRole('button', { name: /Filtre a zoradenie/i });
    await expect(filterDrawerBtn).toBeVisible();
    await filterDrawerBtn.click();

    const drawerHeader = page.getByRole('heading', { name: /Filtre/i });
    await expect(drawerHeader).toBeVisible();

    const closeBtn = page.getByRole('button', { name: /Zatvoriť/i });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(drawerHeader).not.toBeVisible();
  });
});
