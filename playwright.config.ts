import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:4340', launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } },
  webServer: { command: 'npx astro preview --port 4340 --host 127.0.0.1 --force', url: 'http://127.0.0.1:4340', reuseExistingServer: true, timeout: 60_000 },
});
