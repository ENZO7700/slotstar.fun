import { test, expect } from '@playwright/test';

test.describe('Visual Regression Testing (Pixel-by-Pixel UI)', () => {
  test('Homepage visual snapshot (Desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      mask: [page.locator('[data-testid="dynamic-timestamp"]')],
    });
  });

  test('Homepage visual snapshot (Mobile iPhone 13)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });

  test('Games Catalog visual snapshot (/games)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/games');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('games-catalog-desktop.png', {
      fullPage: true,
    });
  });

  test('Game Detail Page visual snapshot (/games/pragmatic-play/gates-of-olympus-1001)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/games/pragmatic-play/gates-of-olympus-1001');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('game-detail-desktop.png', {
      fullPage: true,
    });
  });

  test('Providers Page visual snapshot (/providers)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/providers');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('providers-desktop.png', {
      fullPage: true,
    });
  });

  test('Blog List Page visual snapshot (/blog)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('blog-desktop.png', {
      fullPage: true,
    });
  });

  test('Privacy Policy Page visual snapshot (/privacy)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('privacy-desktop.png', {
      fullPage: true,
    });
  });

  test('Admin Login Form visual snapshot (/admin/login)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('admin-login-desktop.png', {
      fullPage: true,
    });
  });
});
