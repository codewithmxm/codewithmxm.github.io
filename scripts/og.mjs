// Screenshot every /og/<slug>/ card into public/og/<slug>.png (1200×630). Then rebuild.
import { chromium } from 'playwright';
import { readdir, mkdir } from 'node:fs/promises';
import { serve } from './serve.mjs';
const slugs = (await readdir('dist/og', { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
await mkdir('public/og', { recursive: true });
const { base, stop } = await serve();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, colorScheme: 'light' });
for (const s of slugs) {
  await page.goto(`${base}/og/${s}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.og').screenshot({ path: `public/og/${s}.png` });
}
await browser.close();
stop();
console.log(`og: ${slugs.length} cards`);
