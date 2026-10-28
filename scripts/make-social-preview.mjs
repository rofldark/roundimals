// scripts/make-social-preview.mjs
// Writes the GitHub social preview (the card shown when the repo link is shared) as SVG, 1280 x 640.
// Usage: node scripts/make-social-preview.mjs social-preview.svg
// Screenshot it at 1280 x 640 and upload the PNG under Settings > Social preview.
import fs from 'node:fs';
import { animal, partToSvg } from '../roundimals/reference/kit.mjs';

const W = 1280;
const H = 640;
const rows = [
  [['dog', 'waving'], ['cat', 'asking'], ['lion', 'cheering'], ['tiger', 'pawUp'], ['bear', 'explaining']],
  [['hamster', 'surprised'], ['rabbit', 'waiting'], ['panda', 'pawUp'], ['monkey', 'cheering'], ['capybara', 'sleeping']],
];
const STEP = 230;
const SCALE = 0.6;
const body = rows
  .flatMap((row, r) =>
    row.map(([species, pose], i) => {
      const x = W / 2 + (i - 2) * STEP;
      const y = 258 + r * 225;
      return `<g transform="translate(${x} ${y}) scale(${SCALE})">${animal(species, pose).map(partToSvg).join('')}</g>`;
    }),
  )
  .join('');
const FONT = 'font-family="Helvetica, Arial, sans-serif" text-anchor="middle"';
fs.writeFileSync(
  process.argv[2] ?? 'social-preview.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="#F7F7F7"/>` +
    `<text x="${W / 2}" y="92" ${FONT} font-size="64" font-weight="700" fill="#3C3C3C">Roundimals</text>` +
    `<text x="${W / 2}" y="140" ${FONT} font-size="28" fill="#777777">Cute, consistent SVG animal mascots — a Claude skill</text>` +
    `${body}</svg>`,
);
