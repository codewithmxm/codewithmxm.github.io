// Rasterise public/favicon.svg (light variant) into the PNG icon set.
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
const svg = (await readFile('public/favicon.svg', 'utf8')).replace(/@media[^}]*}[^}]*}[^}]*}}/, '');
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['favicon-192.png', 192], ['favicon-512.png', 512]]) {
  await sharp(Buffer.from(svg), { density: 72 * (size / 64) * 1.2 }).resize(size, size).png().toFile(`public/${name}`);
}
console.log('icons ok');
