// scripts/make-video.mjs
// Writes the frames of a short square promo video (1080 x 1080, 30 fps, 14 s) as SVG files:
//   0-4 s   the ten animals pop in, wave, blink and cheer
//   4-10 s  one tiger moves smoothly through its poses, up to waiting and sleeping
//   10-12 s a lion hops and changes color on every landing
//   12-14 s end card with the avatars and the demo address
// Usage: node scripts/make-video.mjs <folder>
// Then screenshot every frame at 1080 x 1080 and encode, for example:
//   ffmpeg -framerate 30 -i <folder>/frame-%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 roundimals.mp4
import fs from 'node:fs';
import path from 'node:path';
import { custom, avatar, partToSvg, SHOULDER, zzz, thoughtDots } from '../roundimals/reference/kit.mjs';

const out = process.argv[2] ?? 'video-frames';
fs.mkdirSync(out, { recursive: true });

const W = 1080;
const FPS = 30;
const DURATION = 14;
const BG = '#F7F7F7';
const INK = '#3C3C3C';
const MUTED = '#777777';
const FONT = 'font-family="Helvetica, Arial, sans-serif" text-anchor="middle"';
const S = SHOULDER;
const TAU = Math.PI * 2;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const backOut = (k) => 1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2);
const text = (x, y, s, size, fill = INK, weight = 700) => `<text x="${x}" y="${y}" ${FONT} font-size="${size}" font-weight="${weight}" fill="${fill}">${s}</text>`;
const svgOf = (parts) => parts.map(partToSvg).join('');
const hang = (side, x = 74) => ({ from: [side * S.x, S.y], to: [side * x, 150], side });
const swing = (elbow, len, deg) => {
  const a = (deg * Math.PI) / 180;
  return [elbow[0] + Math.sin(a) * len, elbow[1] - Math.cos(a) * len];
};
const blinkAt = (t, at) => ((t - at) % 3 + 3) % 3 < 0.1;

/** A whole animal: the floor shadow stays down, the rest can hop; `pop` scales it in. */
function actor(species, e, arms, { x, y, scale, hop = 0, pop = 1, color, over } = {}) {
  if (pop <= 0) return '';
  const [shadow, ...rest] = custom(species, e, arms, { ...(color ? { color } : {}), over });
  const sx = 1 - hop / 80;
  return (
    `<g transform="translate(${x} ${y}) scale(${(scale * pop).toFixed(4)})">` +
    `<g transform="translate(0 186) scale(${sx.toFixed(3)} 1) translate(0 -186)">${partToSvg(shadow)}</g>` +
    `<g transform="translate(0 ${(-hop).toFixed(2)})">${svgOf(rest)}</g></g>`
  );
}

// ── scene 1: the cast ───────────────────────────────────────────────────────
const HAPPY = { eyes: 'open', mouth: 'laugh', cheek: true };
const SMILE = { eyes: 'open', mouth: 'smile' };
const CAST = [
  ['dog', (t) => ({ e: HAPPY, arms: [hang(-1), { from: [S.x, S.y], elbow: [104, 100], to: swing([104, 100], 71, 8 + 22 * Math.sin(TAU * 1.5 * t)), paw: 'wave', side: 1 }] })],
  ['cat', (t) => ({ e: blinkAt(t, 1.1) ? { eyes: 'blink', mouth: 'smile' } : SMILE, arms: [hang(-1), hang(1)] })],
  ['lion', (t) => {
    const k = Math.sin(TAU * 1.2 * t);
    return { e: { eyes: 'closedHappy', mouth: 'laugh' }, arms: [-1, 1].map((s) => ({ from: [s * S.x, S.y], to: [s * 110, -26 + 14 * k], side: s })), hop: 10 * Math.max(0, -k) };
  }],
  ['tiger', (t) => ({ e: HAPPY, arms: [hang(1), { from: [-S.x, S.y], elbow: [-100, 128], to: swing([-100, 128], 68, -8 * Math.max(0, Math.sin(TAU * 1.3 * t))), paw: 'thumb', side: -1 }] })],
  ['bear', (t) => ({ e: blinkAt(t, 1.7) ? { eyes: 'blink', mouth: 'smile' } : SMILE, arms: [hang(-1), hang(1)] })],
  ['hamster', (t) => ({ e: { eyes: 'wide', mouth: 'o' }, arms: [-1, 1].map((s) => ({ from: [s * S.x, S.y], elbow: [s * 102, 112], to: [s * 74, 40], side: s })), hop: 14 * Math.max(0, Math.sin(TAU * 1.4 * t + 1)) })],
  ['rabbit', (t) => ({ e: SMILE, arms: [hang(-1), hang(1)], hop: 12 * Math.max(0, Math.sin(TAU * 1.1 * t + 2)) })],
  ['panda', (t) => ({ e: HAPPY, arms: [hang(-1), { from: [S.x, S.y], elbow: [104, 100], to: swing([104, 100], 71, 8 + 22 * Math.sin(TAU * 1.5 * t + 2)), paw: 'wave', side: 1 }] })],
  ['monkey', (t) => {
    const k = Math.sin(TAU * 1.2 * t + 2);
    return { e: { eyes: 'closedHappy', mouth: 'laugh' }, arms: [-1, 1].map((s) => ({ from: [s * S.x, S.y], to: [s * 110, -26 + 14 * k], side: s })), hop: 10 * Math.max(0, -k) };
  }],
  ['capybara', (t) => ({ e: blinkAt(t, 0.6) ? { eyes: 'blink', mouth: 'smile' } : SMILE, arms: [hang(-1), hang(1)] })],
];
function sceneCast(t) {
  let s = text(W / 2, 150, 'Roundimals', 96) + text(W / 2, 214, '10 cute animal mascots for your apps', 40, MUTED, 400);
  CAST.forEach(([species, act], i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const pop = backOut(clamp((t - 0.3 - i * 0.16) / 0.4));
    const a = act(t);
    s += actor(species, a.e, a.arms, { x: 132 + col * 204, y: 420 + row * 360, scale: 0.68, hop: a.hop ?? 0, pop: t < 0.3 + i * 0.16 ? 0 : pop });
  });
  return s;
}

// ── scene 2: one tiger, smooth poses ────────────────────────────────────────
/** Each pose as [name, [left arm, right arm], expression, accents]; a straight arm gets its elbow halfway. */
const mid = (a) => ({ ...a, elbow: a.elbow ?? [(a.from[0] + a.to[0]) / 2, (a.from[1] + a.to[1]) / 2] });
const POSE_SEQ = [
  ['neutral', [hang(-1), hang(1)], SMILE],
  ['waving', [hang(-1), { from: [S.x, S.y], elbow: [104, 100], to: [114, 30], paw: 'wave', side: 1 }], HAPPY],
  ['paw up', [{ from: [-S.x, S.y], elbow: [-100, 128], to: [-100, 60], paw: 'thumb', side: -1 }, hang(1)], HAPPY],
  ['cheering', [{ from: [-S.x, S.y], to: [-110, -26], side: -1 }, { from: [S.x, S.y], to: [110, -26], side: 1 }], { eyes: 'closedHappy', mouth: 'laugh' }],
  ['asking', [hang(-1), { from: [S.x, S.y], elbow: [98, 122], to: [30, 64], side: 1, front: true, shade: true }], { eyes: 'open', mouth: 'flat', look: [5, -4] }],
  ['waiting', [hang(-1), { from: [S.x, S.y], elbow: [98, 122], to: [30, 64], side: 1, front: true, shade: true }], { eyes: 'open', mouth: 'flat', look: [5, -5] }, thoughtDots],
  ['sleeping', [hang(-1, 66), hang(1, 66)], { eyes: 'sleep', mouth: 'snore' }, zzz],
  ['neutral', [hang(-1), hang(1)], SMILE],
].map(([name, arms, e, over]) => [name, arms.map(mid), e, over]);
function blendArm(a, b, k) {
  const p = (u, v) => [lerp(u[0], v[0], k), lerp(u[1], v[1], k)];
  const late = k > 0.5 ? b : a;
  return { from: p(a.from, b.from), elbow: p(a.elbow, b.elbow), to: p(a.to, b.to), side: a.side, paw: late.paw, front: late.front, shade: late.shade };
}
function scenePoses(t) {
  const STEP = 0.8;
  const i = Math.min(POSE_SEQ.length - 2, Math.floor(t / STEP));
  const local = t - i * STEP;
  const k = ease(clamp((local - 0.45) / 0.35));
  const [nameA, armsA, eA, overA] = POSE_SEQ[i];
  const [nameB, armsB, eB, overB] = POSE_SEQ[i + 1];
  const arms = [0, 1].map((j) => blendArm(armsA[j], armsB[j], k));
  const e = k > 0.5 ? eB : eA;
  const name = k > 0.5 ? nameB : nameA;
  // accents (dots, Z's) build up one by one while their pose holds
  const accent = k > 0.5 ? overB : overA;
  const shown = 1 + Math.floor((k > 0.5 ? local - 0.6 : local + 0.2) * 5);
  const over = accent ? (p) => accent(p, Math.max(0, Math.min(3, shown))) : undefined;
  return text(W / 2, 150, '10 poses for app moments', 64) + text(W / 2, 214, name, 44, MUTED, 400) + actor('tiger', e, arms, { x: W / 2, y: 520, scale: 1.45, over });
}

// ── scene 3: a lion changing color ──────────────────────────────────────────
const COLORS = [null, '#1CB0F6', '#FF86C8', '#9B6BFF', '#2EAD6B', '#FF4B4B'];
function sceneColors(t) {
  const HOP = 0.5;
  const n = Math.floor(t / HOP);
  const k = (t % HOP) / HOP;
  const hop = 60 * Math.sin(Math.PI * k);
  const color = COLORS[n % COLORS.length];
  const arms = [-1, 1].map((s) => ({ from: [s * S.x, S.y], to: [s * 110, -26 + 20 * Math.cos(Math.PI * k)], side: s }));
  return (
    text(W / 2, 150, 'Any color, from one value', 64) +
    text(W / 2, 214, 'natural · blue · pink · purple · green · red', 36, MUTED, 400) +
    actor('lion', { eyes: 'closedHappy', mouth: 'laugh' }, arms, { x: W / 2, y: 520, scale: 1.45, hop, color })
  );
}

// ── scene 4: end card ───────────────────────────────────────────────────────
const AV = [['dog', 'happy'], ['cat', 'neutral'], ['lion', 'laugh'], ['tiger', 'happy'], ['bear', 'talking'], ['hamster', 'surprised'], ['rabbit', 'neutral'], ['panda', 'happy'], ['monkey', 'laugh'], ['capybara', 'neutral']];
function sceneEnd(t) {
  let s = text(W / 2, 180, 'Try it in your browser', 72);
  AV.forEach(([species, ex], i) => {
    const x = 156 + (i % 5) * 192;
    const y = 360 + Math.floor(i / 5) * 200;
    const pop = backOut(clamp((t - i * 0.05) / 0.35));
    const sc = 0.78 * pop;
    s +=
      `<g transform="translate(${x} ${y}) scale(${sc.toFixed(4)})"><defs><clipPath id="c${i}"><circle cx="0" cy="-10" r="100"/></clipPath></defs>` +
      `<g clip-path="url(#c${i})"><circle cx="0" cy="-10" r="100" fill="#DDF4FF"/>${svgOf(avatar(species, ex))}</g></g>`;
  });
  s += text(W / 2, 800, 'rofldark.github.io/roundimals', 52, '#0969DA');
  s += text(W / 2, 870, 'Free · MIT · SVG · Claude skill', 38, MUTED, 400);
  return s;
}

const SCENES = [
  [0, 4, sceneCast],
  [4, 9.8, scenePoses],
  [9.8, 12.4, sceneColors],
  [12.4, DURATION, sceneEnd],
];
const FADE = 0.25;
const total = Math.round(DURATION * FPS);
for (let f = 0; f < total; f++) {
  const time = f / FPS;
  const [start, end, scene] = SCENES.find(([a, b]) => time >= a && time < b) ?? SCENES[SCENES.length - 1];
  const t = time - start;
  // fade in at the start of each scene, fade out before the next one (the last scene stays)
  const fin = start === 0 ? 1 : clamp(t / FADE);
  const fout = end === DURATION ? 1 : clamp((end - time) / FADE);
  const op = Math.min(fin, fout);
  fs.writeFileSync(
    path.join(out, `frame-${String(f).padStart(4, '0')}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}"><rect width="${W}" height="${W}" fill="${BG}"/>` +
      `<g opacity="${op.toFixed(3)}">${scene(t)}</g></svg>`,
  );
}
console.log(`${total} frames ${W}x${W} at ${FPS} fps in ${out}`);
