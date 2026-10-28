// reference/render-sheet.mjs
// A contact sheet with every pose of every animal, the avatars and a few
// fantasy colors, to check the drawing after any change.
// Usage: node reference/render-sheet.mjs <folder>  then open <folder>/sheet.svg in a browser.
import fs from 'node:fs';
import path from 'node:path';
import { SPECIES, POSES, EXPRESSIONS, animal, avatar, partToSvg } from './kit.mjs';

const out = process.argv[2] ?? 'sheet-out';
fs.mkdirSync(out, { recursive: true });

const CELL_W = 250;
const CELL_H = 330;
const S = 0.72;
const LABEL = 'font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#777777" text-anchor="middle"';

const rows = [];
for (const species of Object.keys(SPECIES)) {
  rows.push(Object.keys(POSES).map((pose) => ({ parts: animal(species, pose), label: `${species} ${pose}` })));
}
// avatars of one animal with every expression, then fantasy colors and clothes
rows.push(Object.keys(EXPRESSIONS).map((ex) => ({ parts: avatar('bear', ex), label: `bear avatar ${ex}`, avatar: true })));
rows.push([
  { parts: animal('lion', 'cheering', { color: 'blue' }), label: 'lion, blue' },
  { parts: animal('cat', 'waving', { color: 'pink' }), label: 'cat, pink' },
  { parts: animal('hamster', 'pawUp', { color: 'purple' }), label: 'hamster, purple' },
  { parts: animal('dog', 'explaining', { color: 'green' }), label: 'dog, green' },
  { parts: animal('rabbit', 'asking', { color: '#9E9E9E' }), label: 'rabbit, "gray" (#9E9E9E)' },
  { parts: animal('bear', 'neutral', { clothes: { kind: 'hoodie', color: '#1CB0F6' } }), label: 'bear, hoodie' },
  { parts: animal('tiger', 'surprised', { clothes: { kind: 'shirt', color: '#FF4B4B' } }), label: 'tiger, shirt' },
]);

const COLS = Math.max(...rows.map((r) => r.length));
const body = rows.flatMap((row, ri) =>
  row.map((cell, ci) => {
    const x = CELL_W / 2 + ci * CELL_W;
    const y = 150 + ri * CELL_H;
    const scale = cell.avatar ? S * 1.25 : S;
    return (
      `<g transform="translate(${x} ${y}) scale(${scale})">${cell.parts.map(partToSvg).join('')}</g>` +
      `<text x="${x}" y="${y + 165}" ${LABEL}>${cell.label}</text>`
    );
  }),
);
const W = COLS * CELL_W;
const H = rows.length * CELL_H + 20;
fs.writeFileSync(
  path.join(out, 'sheet.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#FFFFFF"/>${body.join('')}</svg>`,
);
console.log(`wrote ${path.join(out, 'sheet.svg')}`);
