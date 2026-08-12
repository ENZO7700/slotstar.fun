import { test, expect } from '@playwright/test';

/**
 * PHASE 1 — Layout Surgery: Regression Tests
 *
 * These tests verify that the CSS Grid + sticky sidebar layout is correct
 * at all critical breakpoints. They must pass after the Phase 1 refactor
 * and must continue to pass through all subsequent phases.
 *
 * Rule: sidebar.right <= main.left on desktop (no content hidden under sidebar)
 * Rule: no unintentional horizontal scroll
 * Rule: first game/blog card is visible
 * Rule: mobile nav does not overlap last focusable element
 */

const DESKTOP_BREAKPOINTS = [
  { width: 1024, height: 768, label: '1024px (critical)' },
  { width: 1280, height: 800, label: '1280px (common desktop)' },
  { width: 1440, height: 900, label: '1440px (common desktop)' },
  { width: 1536, height: 864, label: '1536px (large desktop)' },
  { width: 1920, height: 1080, label: '1920px (full HD)' },
];

const MOBILE_BREAKPOINTS = [
  { width: 320, height: 568, label: '320px (small mobile)' },
  { width: 375, height: 812, label: '375px (iPhone SE/13)' },
  { width: 768, height: 1024, label: '768px (tablet)' },
];

// ─────────────────────────────────────────────────────────────
// DESKTOP LAYOUT TESTS
// ─────────────────────────────────────────────────────────────

// AppShell lives under catalog routes; marketing `/` has no sidebar.
const CATALOG_PATH = '/games';

for (const bp of DESKTOP_BREAKPOINTS) {
  test(`[DESKTOP ${bp.label}] sidebar does not overlap main content`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(CATALOG_PATH);
    await page.waitForLoadState('networkidle');

    // Sidebar must exist
    const sidebar = page.locator('aside').first();
    const main = page.locator('main').first();
    await expect(main).toBeVisible();

    if (await sidebar.isVisible()) {
      const sidebarBox = await sidebar.boundingBox();
      const mainBox = await main.boundingBox();

      if (sidebarBox && mainBox) {
        const sidebarRight = sidebarBox.x + sidebarBox.width;
        const mainLeft = mainBox.x;
        expect(mainLeft).toBeGreaterThanOrEqual(sidebarRight - 1); // -1px tolerance for subpixel
      }
    }
  });

  test(`[DESKTOP ${bp.label}] no unintentional horizontal scroll`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(CATALOG_PATH);
    await page.waitForLoadState('networkidle');

    const hasHorizontalScroll = await page.evaluate(() => {
      // Check body scroll width vs viewport width
      // scrollWidth > clientWidth means horizontal overflow
      return document.body.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test(`[DESKTOP ${bp.label}] first visible game card or hero heading is accessible`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(CATALOG_PATH);
    await page.waitForLoadState('networkidle');

    // Hero h1 must be visible and not cut off
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    const headingBox = await heading.boundingBox();
    if (headingBox) {
      // h1 must not start before the sidebar right edge
      const sidebar = page.locator('aside').first();
      const sidebarBox = await sidebar.boundingBox();
      if (sidebarBox) {
        const sidebarRight = sidebarBox.x + sidebarBox.width;
        // Heading left edge must be at or after sidebar right
        expect(headingBox.x).toBeGreaterThanOrEqual(sidebarRight - 1);
      }
    }
  });

  test(`[DESKTOP ${bp.label}] header aligns with main content`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(CATALOG_PATH);
    await page.waitForLoadState('networkidle');

    const header = page.locator('header').first();
    const main = page.locator('main').first();

    const headerBox = await header.boundingBox();
    const mainBox = await main.boundingBox();

    if (headerBox && mainBox) {
      // Header left edge should match main column left edge (both in grid col 2)
      expect(Math.abs(headerBox.x - mainBox.x)).toBeLessThanOrEqual(2); // 2px tolerance
    }
  });
}

// ─────────────────────────────────────────────────────────────
// MOBILE LAYOUT TESTS
// ─────────────────────────────────────────────────────────────

for (const bp of MOBILE_BREAKPOINTS) {
  test(`[MOBILE ${bp.label}] desktop sidebar does not reserve space`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(CATALOG_PATH);
    await page.waitForLoadState('networkidle');

    // The aside should be hidden on mobile
    const sidebar = page.locator('aside').first();
    // Check it's either not visible or has display:none
    const isHidden = await sidebar.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.display === 'none' || styles.visibility === 'hidden';
    });
    expect(isHidden).toBe(true);

    // Main content should start from the left edge (no sidebar margin)
    const main = page.locator('main').first();
    const mainBox = await main.boundingBox();
    if (mainBox) {
      // On mobile, main should start near x=0 (with some padding)
      expect(mainBox.x).toBeLessThan(32); // max 32px left margin is reasonable
    }
  });

  test(`[MOBILE ${bp.label}] no unintentional horizontal scroll`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(CATALOG_PATH);
    await page.waitForLoadState('networkidle');

    const hasHorizontalScroll = await page.evaluate(() => {
      return (document.body.scrollWidth - document.documentElement.clientWidth) > 2;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test(`[MOBILE ${bp.label}] mobile nav exists and does not clip last content`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(CATALOG_PATH);
    await page.waitForLoadState('networkidle');

    // Mobile nav must be visible on small screens
    const mobileNav = page.locator('nav[class*="lg:hidden"]').first();
    await expect(mobileNav).toBeVisible();

    // The real guarantee: <main> must have enough computed padding-bottom to clear the nav.
    // pb-24 = 96px on mobile (Tailwind class on <main>), mobile nav height ~= 64px.
    // We check computed padding-bottom >= nav height, not raw viewport positions
    // (comparing fixed-element viewport-y vs document-height bounding boxes is invalid).
    const main = page.locator('main').first();
    const mainPaddingBottom = await main.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).paddingBottom);
    });

    const navBox = await mobileNav.boundingBox();
    const navHeight = navBox?.height ?? 64;

    // padding-bottom must be at least as tall as the nav to prevent content clipping
    expect(mainPaddingBottom).toBeGreaterThanOrEqual(navHeight - 8); // -8px tolerance
  });
}

// ─────────────────────────────────────────────────────────────
// BLOG PAGE TESTS
// ─────────────────────────────────────────────────────────────

test('[DESKTOP 1280px] blog page - first card not hidden under sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/blog');
  await page.waitForLoadState('networkidle');

  const sidebar = page.locator('aside').first();
  const sidebarBox = await sidebar.boundingBox();

  // Find first article or card element on blog page
  const firstCard = page.locator('article, [data-testid="blog-card"], a[href^="/blog/"]').first();

  if (await firstCard.count() > 0) {
    const cardBox = await firstCard.boundingBox();
    if (sidebarBox && cardBox) {
      const sidebarRight = sidebarBox.x + sidebarBox.width;
      expect(cardBox.x).toBeGreaterThanOrEqual(sidebarRight - 1);
    }
  }
});

test('[DESKTOP 1440px] blog page - no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/blog');
  await page.waitForLoadState('networkidle');

  const hasHorizontalScroll = await page.evaluate(() => {
    return document.body.scrollWidth > document.documentElement.clientWidth;
  });

  expect(hasHorizontalScroll).toBe(false);
});
