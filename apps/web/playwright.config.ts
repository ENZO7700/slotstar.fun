import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || 3377;
const baseURL = `http://localhost:${PORT}`;

// CI runners cannot reliably reach the production WordPress CMS. Use local
// fixtures so E2E validates UI behaviour without a live backend dependency.
const e2eUseFixtures = process.env.CI === 'true' || process.env.NEXT_PUBLIC_ENABLE_DEV_FIXTURES === 'true';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      threshold: 0.2,
      animations: 'disabled',
    },
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      ...(e2eUseFixtures ? { NEXT_PUBLIC_ENABLE_DEV_FIXTURES: 'true' } : {}),
    },
  },
});
