import { test, expect } from '@playwright/test';

test.describe('Admin Panel (/admin)', () => {
  test('Admin login page (/admin/login) renders login form inputs', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');

    const form = page.locator('form');
    await expect(form).toBeVisible();
  });
});
