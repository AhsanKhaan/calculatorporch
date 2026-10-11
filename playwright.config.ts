import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

// E2E runs against the built static export (out/), served with the _headers rules applied.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/serve-out.mjs',
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(PORT), CSP_REPORT_ONLY: process.env.CSP_REPORT_ONLY ?? '' },
  },
});
