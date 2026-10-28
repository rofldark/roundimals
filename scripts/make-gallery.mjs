// scripts/make-gallery.mjs
// Writes the README preview images as SVG: poses, avatars, colors and clothes.
// Usage: node scripts/make-gallery.mjs <folder>
// Turn each SVG into a PNG with any browser screenshot at the size in its header.
import fs from 'node:fs';
import path from 'node:path';
import { POSES, animal, avatar, partToSvg } from '../roundimals/reference/kit.mjs';

const out = process.argv[2] ?? 'gallery';
fs.mkdirSync(out, { recursive: true });

const BG = '#F7F7F7';
const LABEL = 'font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#777777" text-anchor="middle"';

/** One row of cells: { parts, label, round? } placed side by side. */
function row(file, cells, { step = 225, height = 420, y = 190, scale = 0.8, labelY = 395 } = {}) {
  const PAD = 30;
  const W = cells.length * step + 2 * PAD;
  const body = cells
    .map(({ parts, label, round }, i) => {
      const x = PAD + step / 2 + i * step;
      const clip = round ? ` clip-path="url(#c${i})"` : '';
      const defs = round ? `<defs><clipPath id="c${i}"><circle cx="0" cy="-10" r="100"/></clipPath></defs>` : '';
      const bg = round ? `<circle cx="0" cy="-10" r="100" fill="#DDF4FF"/>` : '';
      return (
        `<g transform="translate(${x} ${y}) scale(${scale})">${defs}<g${clip}>${bg}${parts.map(partToSvg).join('')}</g></g>` +
        `<text x="${x}" y="${labelY}" ${LABEL}>${label}</text>`
      );
    })
    .join('');
  fs.writeFileSync(
    path.join(out, file),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}"><rect width="${W}" height="${height}" fill="${BG}"/>${body}</svg>`,
  );
  console.log(`${file} ${W}x${height}`);
}

row(
  'poses.svg',
  Object.keys(POSES).map((pose) => ({ parts: animal('tiger', pose), label: pose })),
);

row(
  'avatars.svg',
  ['dog', 'cat', 'lion', 'tiger', 'bear', 'hamster', 'rabbit', 'panda', 'monkey', 'capybara'].map((species, i) => ({
    parts: avatar(species, ['happy', 'thinking', 'laugh', 'talking', 'neutral', 'surprised', 'sad', 'happy', 'laugh', 'sleeping'][i]),
    label: species,
    round: true,
  })),
  { step: 240, height: 300, y: 130, scale: 1, labelY: 275 },
);

row('colors.svg', [
  { parts: animal('lion', 'cheering', { color: 'blue' }), label: 'blue lion' },
  { parts: animal('cat', 'waving', { color: 'pink' }), label: 'pink cat' },
  { parts: animal('hamster', 'pawUp', { color: 'purple' }), label: 'purple hamster' },
  { parts: animal('dog', 'explaining', { color: 'green' }), label: 'green dog' },
  { parts: animal('bear', 'neutral', { clothes: { kind: 'hoodie', color: '#1CB0F6' } }), label: 'bear in a hoodie' },
  { parts: animal('rabbit', 'asking', { clothes: { kind: 'shirt', color: '#FF4B4B' } }), label: 'rabbit in a shirt' },
  { parts: animal('panda', 'cheering', { clothes: { kind: 'hoodie', color: '#58CC02' } }), label: 'panda in a hoodie' },
]);
