import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:4340' },
  webServer: { command: 'npx astro preview --port 4340', url: 'http://localhost:4340', reuseExistingServer: true, timeout: 60_000 },
});
