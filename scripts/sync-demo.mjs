// scripts/sync-demo.mjs
// Copies the drawing kit into docs/ for the GitHub Pages demo (Pages only serves docs/).
// Run it after every change to roundimals/reference/kit.mjs.
// Usage: node scripts/sync-demo.mjs        (copy)
//        node scripts/sync-demo.mjs --check (exit 1 if the copy is out of date)
import fs from 'node:fs';

const src = new URL('../roundimals/reference/kit.mjs', import.meta.url);
const dst = new URL('../docs/kit.mjs', import.meta.url);
const kit = fs.readFileSync(src, 'utf8');

if (process.argv.includes('--check')) {
  const same = fs.existsSync(dst) && fs.readFileSync(dst, 'utf8') === kit;
  console.log(same ? 'docs/kit.mjs is up to date' : 'docs/kit.mjs is out of date: run node scripts/sync-demo.mjs');
  process.exit(same ? 0 : 1);
}
fs.writeFileSync(dst, kit);
console.log('copied kit.mjs to docs/');
