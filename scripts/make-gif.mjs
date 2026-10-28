// scripts/make-gif.mjs
// Writes the frames of the README's animated title as SVG files: all ten
// animals, each with its own small loop (waving, cheering, a paw up, a hop,
// a blink), offset in time so they never move in sync.
// Usage: node scripts/make-gif.mjs <folder> [frames]
// Then screenshot each frame (W x H below) and join them into a GIF at 50 ms per frame.
import fs from 'node:fs';
import path from 'node:path';
import { custom, partToSvg, SHOULDER, zzz, thoughtDots } from '../roundimals/reference/kit.mjs';

const out = process.argv[2] ?? 'gif-frames';
const FRAMES = Number(process.argv[3] ?? 40);
fs.mkdirSync(out, { recursive: true });

const S = SHOULDER;
const TAU = Math.PI * 2;
const hang = (side) => ({ from: [side * S.x, S.y], to: [side * 74, 150], side });
/** A forearm turning around its elbow: the paw sits `len` from the elbow at `deg` from straight up. */
const swing = (elbow, len, deg) => {
  const a = (deg * Math.PI) / 180;
  return [elbow[0] + Math.sin(a) * len, elbow[1] - Math.cos(a) * len];
};
/** Eyes closed for 2 of every FRAMES frames, starting at `at`. */
const blink = (t, at, e) => ((t * FRAMES - at * FRAMES + FRAMES) % FRAMES < 2 ? { ...e, eyes: 'blink' } : e);

const HAPPY = { eyes: 'open', mouth: 'laugh', cheek: true };
const SMILE = { eyes: 'open', mouth: 'smile' };

// each actor: (t in 0..1) => { expression, arms, hop (units up) }
const cast = [
  ['dog', (t) => ({ e: HAPPY, arms: [hang(-1), { from: [S.x, S.y], elbow: [104, 100], to: swing([104, 100], 71, 8 + 22 * Math.sin(TAU * 2 * t)), paw: 'wave', side: 1 }] })],
  ['cat', (t) => ({ e: blink(t, 0.3, { eyes: 'open', mouth: 'flat', look: [5, -4] }), arms: [hang(-1), { from: [S.x, S.y], elbow: [98, 122], to: [30, 64 + 3 * Math.sin(TAU * t)], side: 1, front: true, shade: true }] })],
  ['lion', (t) => {
    const k = Math.sin(TAU * 2 * t + 1);
    return { e: { eyes: 'closedHappy', mouth: 'laugh' }, arms: [-1, 1].map((s) => ({ from: [s * S.x, S.y], to: [s * 110, -26 + 16 * k], side: s })), hop: 10 * Math.max(0, -k) };
  }],
  ['tiger', (t) => ({ e: blink(t, 0.7, HAPPY), arms: [hang(1), { from: [-S.x, S.y], elbow: [-100, 128], to: swing([-100, 128], 68, -8 * Math.max(0, Math.sin(TAU * 2 * t + 2))), paw: 'thumb', side: -1 }] })],
  ['bear', (t) => ({ e: { eyes: 'open', mouth: Math.sin(TAU * 4 * t) > 0 ? 'talk' : 'smile', look: [2, 0] }, arms: [hang(-1), { from: [S.x, S.y], to: [120, 72 + 6 * Math.sin(TAU * t)], paw: 'point', side: 1 }] })],
  ['hamster', (t) => {
    const h = Math.max(0, Math.sin(TAU * 2 * t + 3));
    return { e: { eyes: 'wide', mouth: 'o' }, arms: [-1, 1].map((s) => ({ from: [s * S.x, S.y], elbow: [s * 102, 112], to: [s * 74, 40], side: s })), hop: 16 * h };
  }],
  // waiting: the three dots appear one after another, like a chat's "typing…"
  ['rabbit', (t) => ({ e: { eyes: 'open', mouth: 'flat', look: [5, -5] }, arms: [hang(-1), { from: [S.x, S.y], elbow: [98, 122], to: [30, 64], side: 1, front: true, shade: true }], over: (p) => thoughtDots(p, Math.floor(t * 8) % 4) })],
  ['panda', (t) => ({ e: blink(t, 0.55, HAPPY), arms: [hang(-1), { from: [S.x, S.y], elbow: [104, 100], to: swing([104, 100], 71, 8 + 22 * Math.sin(TAU * 2 * t + 2)), paw: 'wave', side: 1 }] })],
  ['monkey', (t) => {
    const k = Math.sin(TAU * 2 * t + 2.5);
    return { e: { eyes: 'closedHappy', mouth: 'laugh' }, arms: [-1, 1].map((s) => ({ from: [s * S.x, S.y], to: [s * 110, -26 + 16 * k], side: s })), hop: 10 * Math.max(0, -k) };
  }],
  // sleeping: the Z's rise one after another
  ['capybara', (t) => ({ e: { eyes: 'sleep', mouth: 'snore' }, arms: [hang(-1, 66), hang(1, 66)], over: (p) => zzz(p, Math.floor(t * 4) % 4) })],
];

export const W = 2500;
export const H = 520;
const STEP = 240;
for (let f = 0; f < FRAMES; f++) {
  const t = f / FRAMES;
  const body = cast
    .map(([species, act], i) => {
      const { e, arms, hop = 0, over } = act(t);
      const [shadow, ...rest] = custom(species, e, arms, { over });
      // the shadow stays on the ground and shrinks a little while the animal is in the air
      const sx = 1 - hop / 80;
      return (
        `<g transform="translate(${170 + i * STEP} 250) scale(0.95)">` +
        `<g transform="translate(0 186) scale(${sx.toFixed(3)} 1) translate(0 -186)">${partToSvg(shadow)}</g>` +
        `<g transform="translate(0 ${(-hop).toFixed(2)})">${rest.map(partToSvg).join('')}</g></g>`
      );
    })
    .join('');
  fs.writeFileSync(
    path.join(out, `frame-${String(f).padStart(3, '0')}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#F7F7F7"/>${body}</svg>`,
  );
}
console.log(`${FRAMES} frames ${W}x${H} in ${out}`);
