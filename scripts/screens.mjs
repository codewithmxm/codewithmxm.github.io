// Screenshots for visual checks: THEMES=dark,light WIDTHS=1280,390 FULL=0|1 node scripts/screens.mjs <outdir> <paths...>
// (on Git Bash, set MSYS_NO_PATHCONV=1 so "/" is not rewritten)
// BASE=http://127.0.0.1:PORT reuses a preview that is already running.
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
const [out, ...paths] = process.argv.slice(2);
const { base, stop } = process.env.BASE ? { base: process.env.BASE, stop: () => {} } : await serve(4333);
const browser = await chromium.launch();
for (const theme of (process.env.THEMES ?? 'dark,light').split(',')) for (const w of (process.env.WIDTHS ?? '1280,390').split(',').map(Number)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')); await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); await document.fonts.ready; });
    await page.waitForTimeout(300);
    const name = `${out}/${p.replace(/\W+/g, '_') || 'home'}-${theme}-${w}.png`;
    await page.screenshot({ path: name, fullPage: process.env.FULL !== '0' });
  }
  await ctx.close();
}
await browser.close(); stop();
console.log('ok');
