// One-off: screenshot the live canopy prototype for its project hero image.
import { chromium } from '@playwright/test';
const b = await chromium.launch({ args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1.5 });
await p.goto('https://syednafizreja.github.io/parametric-canopy-carbon-optimization/', { waitUntil: 'networkidle' });
await p.waitForTimeout(4000);
await p.screenshot({ path: 'src/assets/media/canopy/canopy_tool.png' });
await b.close();
