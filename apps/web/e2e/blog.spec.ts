import { test, expect } from '@playwright/test';

test.describe('Blog Page (/blog)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
  });

  test('should display blog heading and description', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Blog/i);

    const description = page.getByText(/Tipy, stratégie a novinky zo sveta demo kasíno hier/i);
    await expect(description).toBeVisible();
  });

  test('should render blog post cards or empty state gracefully', async ({ page }) => {
    const emptyState = page.getByText(/Zatiaľ žiadne články/i);
    const blogCards = page.locator('a[href^="/blog/"]');

    if (await emptyState.isVisible()) {
      await expect(page.getByRole('link', { name: /Preskúmať hry/i })).toBeVisible();
    } else {
      const count = await blogCards.count();
      expect(count).toBeGreaterThan(0);

      const firstPost = blogCards.first();
      await expect(firstPost).toBeVisible();

      // Check author/date line or title
      await expect(firstPost.getByText(/Čítať viac/i)).toBeVisible();
    }
  });

  test('should have valid links to blog post details', async ({ page }) => {
    const blogCards = page.locator('a[href^="/blog/"]');
    if (await blogCards.count() > 0) {
      const firstPost = blogCards.first();
      const href = await firstPost.getAttribute('href');
      expect(href).toMatch(/\/blog\/.+/);
    }
  });
});
