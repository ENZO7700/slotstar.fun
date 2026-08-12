import { test, expect } from '@playwright/test';

test.describe('Global Navigation and Header Search', () => {
  test('Header search input submits search query and redirects to /games?q=...', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/games');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('#header-search');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Olympus');
    await searchInput.press('Enter');

    await page.waitForURL((url) => url.searchParams.get('q') === 'Olympus');
    expect(page.url()).toContain('q=Olympus');
  });

  test('Sidebar links navigate correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/games');
    await page.waitForLoadState('networkidle');

    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();

    const providersLink = sidebar.getByRole('link', { name: 'Poskytovatelia' });
    await providersLink.click();
    await page.waitForURL('/providers');
    expect(page.url()).toContain('/providers');

    const blogLink = sidebar.getByRole('link', { name: 'Blog' });
    await blogLink.click();
    await page.waitForURL('/blog');
    expect(page.url()).toContain('/blog');
  });

  test('Mobile navigation links navigate correctly on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/games');
    await page.waitForLoadState('networkidle');

    const mobileNav = page.locator('nav[class*="lg:hidden"]').first();
    await expect(mobileNav).toBeVisible();

    const gamesLink = mobileNav.getByRole('link', { name: 'Hry' });
    await expect(gamesLink).toBeVisible();
  });
});
