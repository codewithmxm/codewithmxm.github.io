// QA screenshots and the static viewer fallback. Usage: node scripts/shots.mjs [outdir]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { serve } from './serve.mjs';
const out = process.argv[2] ?? 'shots';
await mkdir(out, { recursive: true });
const { base, stop } = await serve(4331);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
// viewer fallback: the live WebGL render, light theme
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'light', deviceScaleFactor: 2 });
  await page.goto(`${base}/work/shellform/`, { waitUntil: 'networkidle' });
  const host = page.locator('[data-viewer]').first();
  await host.scrollIntoViewIfNeeded();
  await host.locator('[data-load]').click();
  await page.waitForSelector('[data-viewer] canvas', { timeout: 20000 }).catch(() => console.log('no canvas'));
  await page.waitForTimeout(1500);
  await page.addStyleTag({ content: '.viewer .controls, .viewer [data-hint] { display: none !important; } .viewer { border: 0 !important; }' });
  await page.waitForTimeout(200);
  await host.screenshot({ path: `${out}/viewer.png` });
  if (process.env.FALLBACK) {
    const sharp = (await import('sharp')).default;
    await sharp(`${out}/viewer.png`).resize(1600, 1000, { fit: 'cover' }).png({ compressionLevel: 9 }).toFile('src/assets/media/shellform/viewer-fallback.png');
    console.log('viewer fallback updated');
  }
  await page.close();
}
for (const scheme of ['light', 'dark']) for (const w of [375, 768, 1280, 1600]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: scheme });
  for (const p of ['/', '/work/', '/work/shellform/', '/publications/', '/cv/']) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${out}/${scheme}-${w}${p.replace(/\//g, '_')}.png`, fullPage: false });
  }
  await page.close();
}
await browser.close();
stop();
console.log('shots ok');
