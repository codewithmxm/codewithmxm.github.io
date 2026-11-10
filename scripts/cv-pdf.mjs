// Print /cv/ to public/cv/CV_Syed_Nafiz_Reja_Hasib.pdf (A4, print stylesheet). Then rebuild.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { serve } from './serve.mjs';
await mkdir('public/cv', { recursive: true });
const { base, stop } = await serve(4330);
const browser = await chromium.launch();
const page = await browser.newPage({ colorScheme: 'light' });
await page.goto(`${base}/cv/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// links in the PDF must point at the live site, not the local preview server
await page.evaluate((origin) => document.querySelectorAll('a[href]').forEach((a) => { const u = new URL(a.getAttribute('href'), location.href); if (u.origin === location.origin) a.href = origin + u.pathname + u.hash; }), 'https://syednafizreja.github.io');
await page.pdf({ path: 'public/cv/CV_Syed_Nafiz_Reja_Hasib.pdf', format: 'A4', printBackground: false, margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' } });
await browser.close();
stop();
console.log('cv pdf ok');
