// reference/render.mjs
// Writes one animal as a standalone SVG file.
// Usage:
//   node reference/render.mjs <animal> <pose> [options] > out.svg
//   node reference/render.mjs <animal> avatar:<expression> [options] > out.svg
// Options:
//   --color <name|#hex>        fantasy color (blue, purple, pink, green, red, yellow or any hex)
//   --clothes <shirt|hoodie>:<#hex>   optional clothes, e.g. hoodie:#1CB0F6
//   --size <px>                output width (default 400)
//   --background <#hex>        fill behind the animal
//   --round                    clip to a circle (chat avatars)
import { SPECIES, POSES, EXPRESSIONS, animal, avatar, toSvg, frameFor } from './kit.mjs';

const args = process.argv.slice(2);
const [species, what = 'neutral'] = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] ?? '').match(/^--(color|clothes|size|background)$/));
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

if (!species) {
  console.error(`animals: ${Object.keys(SPECIES).join(', ')}`);
  console.error(`poses: ${Object.keys(POSES).join(', ')}`);
  console.error(`avatar expressions: ${Object.keys(EXPRESSIONS).map((e) => `avatar:${e}`).join(', ')}`);
  process.exit(1);
}

const opts = {};
if (opt('color')) opts.color = opt('color');
if (opt('clothes')) {
  const [kind, color] = opt('clothes').split(':');
  opts.clothes = { kind, color };
}
const isAvatar = what.startsWith('avatar');
const parts = isAvatar ? avatar(species, what.split(':')[1] ?? 'neutral', opts) : animal(species, what, opts);
process.stdout.write(
  toSvg(parts, {
    frame: frameFor(species, isAvatar ? 'avatar' : 'body'),
    size: Number(opt('size') ?? 400),
    background: opt('background'),
    round: args.includes('--round'),
  }),
);
