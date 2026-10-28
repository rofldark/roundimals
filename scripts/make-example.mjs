// scripts/make-example.mjs
// Writes the README title image as SVG: all ten animals side by side.
// Usage: node scripts/make-example.mjs example.svg
// Turn it into example.png with any browser screenshot (2500 x 520).
import fs from 'node:fs';
import { animal, partToSvg } from '../roundimals/reference/kit.mjs';

const cast = [
  ['dog', 'waving'],
  ['cat', 'asking'],
  ['lion', 'cheering'],
  ['tiger', 'pawUp'],
  ['bear', 'explaining'],
  ['hamster', 'surprised'],
  ['rabbit', 'neutral'],
  ['panda', 'pawUp'],
  ['monkey', 'cheering'],
  ['capybara', 'waving'],
];
const W = 2500;
const H = 520;
const STEP = 240;
const body = cast
  .map(([species, pose], i) => `<g transform="translate(${170 + i * STEP} 250) scale(0.95)">${animal(species, pose).map(partToSvg).join('')}</g>`)
  .join('');
fs.writeFileSync(
  process.argv[2] ?? 'example.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#F7F7F7"/>${body}</svg>`,
);
