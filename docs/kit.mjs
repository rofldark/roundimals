// reference/kit.mjs
// A dependency-free kit that draws upright cartoon animals in the flat,
// rounded Roundimals style, following SKILL.md. Every function returns plain shape
// data ("parts"); toSvg() turns parts into an SVG string. Port the geometry
// unchanged to React Native SVG, Skia or canvas: it is plain path data.
//
// THE FRAME: the head is 100 units wide and its center is (0, 0); y grows
// down. The head spans y -58 to 54, the torso starts at y 44 (hidden behind
// the chin) and ends at 160, the feet reach 181. Translate and scale the
// whole group to place an animal in a scene.
//
// Part kinds:
//   { d, fill, evenOdd? }   a filled path
//   { d, stroke, sw }       a stroke with round caps and joins (capsules, closed eyes)
//   { t, kids }             a group with an SVG transform

// ── parts and the three shapes ──────────────────────────────────────────────
export const g = (t, ...kids) => ({ t, kids });
export const fill = (d, color, evenOdd = false) => ({ d, fill: color, evenOdd });
export const line = (d, color, sw) => ({ d, stroke: color, sw });

const f = (n) => Math.round(n * 100) / 100;

export function circle(cx, cy, r) {
  return `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
}

/** The rounded rectangle (the most used shape). */
export function rrect(x, y, w, h, r) {
  const q = Math.min(r, w / 2, h / 2);
  return (
    `M${f(x + q)} ${f(y)}H${f(x + w - q)}A${f(q)} ${f(q)} 0 0 1 ${f(x + w)} ${f(y + q)}` +
    `V${f(y + h - q)}A${f(q)} ${f(q)} 0 0 1 ${f(x + w - q)} ${f(y + h)}` +
    `H${f(x + q)}A${f(q)} ${f(q)} 0 0 1 ${f(x)} ${f(y + h - q)}V${f(y + q)}A${f(q)} ${f(q)} 0 0 1 ${f(x + q)} ${f(y)}Z`
  );
}

/** The pill: a fully rounded rectangle centered at (cx, cy). */
export function pill(cx, cy, w, h) {
  return rrect(cx - w / 2, cy - h / 2, w, h, Math.min(w, h) / 2);
}

/** The tombstone: a half-circle top (radius w/2), straight sides and bottom corners of radius r. */
export function tomb(cx, top, w, h, r) {
  const R = w / 2;
  const yb = top + h;
  const q = Math.min(r, R, h - R);
  return (
    `M${f(cx - R)} ${f(top + R)}A${f(R)} ${f(R)} 0 0 1 ${f(cx + R)} ${f(top + R)}` +
    `V${f(yb - q)}A${f(q)} ${f(q)} 0 0 1 ${f(cx + R - q)} ${f(yb)}H${f(cx - R + q)}A${f(q)} ${f(q)} 0 0 1 ${f(cx - R)} ${f(yb - q)}Z`
  );
}

/** The rounded triangle with corners a, b, c and corner radius r. */
export function rtri(a, b, c, r) {
  const pts = [a, b, c];
  let d = '';
  pts.forEach((p, i) => {
    const toPrev = unit(pts[(i + 2) % 3], p);
    const toNext = unit(pts[(i + 1) % 3], p);
    const s = [p[0] + toPrev[0] * r, p[1] + toPrev[1] * r];
    const e = [p[0] + toNext[0] * r, p[1] + toNext[1] * r];
    d += `${i === 0 ? 'M' : 'L'}${f(s[0])} ${f(s[1])}Q${f(p[0])} ${f(p[1])} ${f(e[0])} ${f(e[1])}`;
  });
  return `${d}Z`;
}
function unit(to, from) {
  const x = to[0] - from[0];
  const y = to[1] - from[1];
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
}

/** Mirror a point list or a point to the other side of the face. */
const mx = (s, pts) => pts.map(([x, y]) => [s * x, y]);

// ── proportions (head = 100) ────────────────────────────────────────────────
/** The head: a rounded rectangle so round it is nearly a capsule. */
export const HEAD = { x: -50, y: -58, w: 100, h: 112, r: 46 };
/** The torso: a tombstone (round shoulders), its top hidden behind the chin. */
export const BODY = { top: 44, bottom: 160, w: 128, r: 28 };
/** The arm: thickness about a third of the head; the paw is a circle a bit under half the head. `cuff` = sleeve end to paw center. */
export const ARM = { w: 36, paw: 23, cuff: 30 };
/** Thumb, index finger and waving toes, as fractions of the paw and the arm. */
export const DIGIT = { w: 15, thumbOut: 15, indexPast: 37 };
/** The shoulder: the center of the arm's round end, fully inside the torso. */
export const SHOULDER = { x: 38, y: 98 };
const FEET = { x: 30, y: 166, w: 50, h: 30 };
const EYE = { x: 19, y: -10, w: 28, h: 38, pw: 12, ph: 19, shine: 2.6 };
/** The muzzle: a light pill on the lower face, carrying the nose and the mouth. */
const MUZZLE = { y: 30, w: 60, h: 38 };
const FEATURE_W = 4.6;

// ── colors ──────────────────────────────────────────────────────────────────
/** Fixed face colors, the same for every animal. */
export const FACE = { eyeWhite: '#FFFFFF', pupil: '#3C3C3C', mouth: '#B03A3A', tongue: '#F15A5A', teeth: '#FFFFFF', tear: '#7FD4FF', zzz: '#8C93D9', bubble: '#E3E6FA' };

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(rgb) {
  return `#${rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}
function rgbToHsl([r, gg, b]) {
  r /= 255;
  gg /= 255;
  b /= 255;
  const max = Math.max(r, gg, b);
  const min = Math.min(r, gg, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (gg - b) / d + (gg < b ? 6 : 0);
  else if (max === gg) h = (b - r) / d + 2;
  else h = (r - gg) / d + 4;
  return [h * 60, s, l];
}
function hslToHex(h, s, l) {
  const clamp = (v) => Math.min(1, Math.max(0, v));
  s = clamp(s);
  l = clamp(l);
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const ch = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex([ch(0) * 255, ch(8) * 255, ch(4) * 255]);
}

/**
 * A whole palette from one color ("make me a blue lion"). Gray is never
 * allowed: a color with almost no saturation becomes a cool pastel.
 *   fur, furShade (one step darker: a paw over the face, the far ear),
 *   light (muzzle, belly, inner ear), feature (closed eyes, mouth strokes),
 *   nose, pattern (mane, stripes, floppy ears), inner (inner ear).
 */
export function paletteFromColor(hex) {
  let [h, s, l] = rgbToHsl(hexToRgb(hex));
  if (s < 0.15) {
    h = 245;
    s = 0.45;
    l = Math.min(Math.max(l, 0.6), 0.8);
  }
  l = Math.min(Math.max(l, 0.42), 0.8);
  const light = hslToHex(h, Math.min(s, 0.9), Math.max(0.93, l + 0.25));
  return {
    fur: hslToHex(h, s, l),
    furShade: hslToHex(h, s, l - 0.07),
    light,
    inner: light,
    feature: hslToHex(h, Math.min(1, s + 0.1), l * 0.45),
    nose: hslToHex(h, Math.min(1, s + 0.1), l * 0.35),
    pattern: hslToHex(h, Math.min(1, s + 0.05), l - 0.2),
  };
}

// ── the ten animals ─────────────────────────────────────────────────────────
/**
 * Each animal changes only a few big shapes on the shared body: the ears,
 * the markings on the head, the tail, sometimes the torso width. Natural
 * colors by default; pass `color` or `palette` to animal() for others.
 */
export const SPECIES = {
  dog: {
    ears: 'floppy',
    tail: 'wag',
    palette: { fur: '#E5A259', furShade: '#D18E46', light: '#FFF1DC', inner: '#FFF1DC', feature: '#7A4325', nose: '#4B2A1A', pattern: '#A56644' },
  },
  cat: {
    // a "gray" cat: gray is off-style, so it is a cool pastel
    ears: 'pointed',
    tail: 'curl',
    palette: { fur: '#A9A5DE', furShade: '#9590CF', light: '#ECEBFF', inner: '#FFB2B2', feature: '#4A4680', nose: '#F5A4A4', pattern: '#8580C4' },
  },
  lion: {
    ears: 'round',
    earR: 14,
    mane: true,
    tail: 'tuft',
    palette: { fur: '#FFC24A', furShade: '#F2AF30', light: '#FFF3CF', inner: '#FFF3CF', feature: '#8A4A12', nose: '#6B3410', pattern: '#E0761F' },
  },
  tiger: {
    ears: 'round',
    earR: 17,
    stripes: true,
    tail: 'curl',
    palette: { fur: '#FF9600', furShade: '#EB8500', light: '#FFF6E8', inner: '#FFF6E8', feature: '#5A2E14', nose: '#4B2A1A', pattern: '#5A2E14' },
  },
  bear: {
    ears: 'round',
    earR: 20,
    body: 140,
    palette: { fur: '#A56644', furShade: '#925638', light: '#E8BC8E', inner: '#E8BC8E', feature: '#4A2615', nose: '#3C1F12', pattern: '#7E4A30' },
  },
  hamster: {
    ears: 'round',
    earR: 15,
    cheeks: true,
    body: 140,
    palette: { fur: '#FFB863', furShade: '#F2A64C', light: '#FFF6EA', inner: '#FFB2B2', feature: '#9A5520', nose: '#F57F86', pattern: '#E89A3C' },
  },
  rabbit: {
    ears: 'long',
    tail: 'puff',
    palette: { fur: '#F2D3B6', furShade: '#E6C19E', light: '#FFFFFF', inner: '#FFB2B2', feature: '#9A6440', nose: '#F57F86', pattern: '#E6C19E' },
  },
  panda: {
    // white head and belly; ears, eye patches, body, arms and feet in the dark pattern color
    ears: 'round',
    earR: 19,
    dark: true,
    patches: true,
    body: 140,
    palette: { fur: '#FFFFFF', furShade: '#F2F0FA', light: '#FFFFFF', inner: '#3D3B4F', feature: '#3D3B4F', nose: '#3D3B4F', pattern: '#3D3B4F' },
  },
  monkey: {
    // a light face mask (two eye circles plus a wide muzzle), ears on the sides
    ears: 'side',
    mask: true,
    tail: 'long',
    palette: { fur: '#7A4B33', furShade: '#6A3F2A', light: '#F4CDA5', inner: '#F4CDA5', feature: '#5A3220', nose: '#5A3220', pattern: '#5A3220' },
  },
  capybara: {
    // a wider, boxier head; a big blunt muzzle one step DARKER than the fur, slanted nostrils, a split smile
    ears: 'round',
    earR: 11,
    head: { x: -56, y: -52, w: 112, h: 106, r: 32 },
    snout: true,
    body: 144,
    palette: { fur: '#C0824F', furShade: '#AE7343', light: '#E9C29A', inner: '#9C6237', feature: '#4A2812', nose: '#4A2812', pattern: '#9C6237' },
  },
};

/** Fantasy colors that are tested to read well, by name. */
export const FANTASY = {
  blue: '#1CB0F6',
  purple: '#CE82FF',
  pink: '#FFAADE',
  green: '#58CC02',
  red: '#FF4B4B',
  yellow: '#FFC800',
};

// ── the face ────────────────────────────────────────────────────────────────
export const EXPRESSIONS = {
  neutral: { eyes: 'open', mouth: 'smile' },
  happy: { eyes: 'open', mouth: 'laugh', cheek: true },
  laugh: { eyes: 'closedHappy', mouth: 'laugh' },
  thinking: { eyes: 'open', mouth: 'flat', look: [5, -4] },
  surprised: { eyes: 'wide', mouth: 'o' },
  sad: { eyes: 'sad', mouth: 'sad', look: [0, 6], tear: true },
  talking: { eyes: 'open', mouth: 'talk', look: [2, 0] },
  sleeping: { eyes: 'sleep', mouth: 'snore' },
};

/** Eye cuts in units from the eye center: `lid` [outer, inner] hides everything above; `cheek` [outer, inner] everything below. */
const CUTS = {
  sad: { lid: [-4, -17] },
};

function eye(side, e, p, around) {
  const cx = side * EYE.x;
  const cy = EYE.y;
  const [lx, ly] = e.look ?? [0, 0];
  // a closed eye on a dark eye patch is light, everywhere else the feature color
  const closed = around === p.pattern ? p.light : p.feature;
  // a blink: a flat closed eye, for animation frames
  if (e.eyes === 'blink') return [line(`M${cx - 10} ${cy + 3}H${cx + 10}`, closed, FEATURE_W)];
  // asleep: a relaxed downward arc, the opposite of the happy closed eye
  if (e.eyes === 'sleep') return [line(`M${cx - 10} ${cy + 1}Q${cx} ${cy + 10} ${cx + 10} ${cy + 1}`, closed, FEATURE_W)];
  if (e.eyes === 'closedHappy') return [line(`M${cx - 10} ${cy + 5}Q${cx} ${cy - 9} ${cx + 10} ${cy + 5}`, closed, FEATURE_W)];
  const out = [fill(pill(cx, cy, EYE.w, EYE.h), p.eyeWhite)];
  const wide = e.eyes === 'wide';
  const pw = wide ? 9 : EYE.pw;
  const ph = wide ? 13 : EYE.ph;
  const top = cy - EYE.h / 2 + (wide ? 9 : 6) + ly;
  const px = cx + lx - side * 2;
  out.push(fill(pill(px, top + ph / 2, pw, ph), p.pupil));
  // the shine dot, on the same side in both eyes
  out.push(fill(circle(px - pw * 0.22, top + EYE.shine + 1.5, EYE.shine), p.eyeWhite));
  const cut = { ...(CUTS[e.eyes] ?? {}), ...(e.cheek ? { cheek: [9, 13] } : {}) };
  // cuts stay inside the eye's box and take the color around the eye (fur, a face mask or an eye patch)
  const xo = cx + side * (EYE.w / 2 + 0.5);
  const xi = cx - side * (EYE.w / 2 + 0.5);
  const yt = cy - EYE.h / 2 - 0.5;
  const yb = cy + EYE.h / 2 + 0.5;
  if (cut.lid) {
    const [o, i] = cut.lid;
    out.push(fill(`M${xo} ${yt}L${xi} ${yt}L${xi} ${cy + i}L${xo} ${cy + o}Z`, around));
  }
  if (cut.cheek) {
    const [o, i] = cut.cheek;
    out.push(fill(`M${xo} ${cy + o}L${xi} ${cy + i}L${xi} ${yb}L${xo} ${yb}Z`, around));
  }
  return out;
}

/** The mouth, on the muzzle under the nose, pulled a little to one side. */
function mouth(e, p, sp) {
  const out = [];
  // the capybara's split lip: a short line down from the nose, every mouth hangs from it
  if (sp.snout) out.push(line(e.mouth === 'smile' ? 'M0 18V29' : 'M0 18V27', p.feature, FEATURE_W));
  const open = (x0, x1, top, depth, tilt) => {
    const mid = (x0 + x1) / 2;
    out.push(fill(`M${x0} ${top}L${x1} ${top - tilt}Q${x1 + 1} ${top + depth} ${mid} ${top + depth}Q${x0 - 1} ${top + depth} ${x0} ${top}Z`, p.mouth));
    const tr = Math.min(depth * 0.36, (x1 - x0) * 0.22);
    out.push(fill(circle(mid + 1, top + depth - tr - 1.2, tr), p.tongue));
  };
  switch (e.mouth) {
    case 'smile':
      // the capybara smiles with both halves of the split lip
      if (sp.snout) out.push(line('M-13 30Q-6 37 0 29Q6 37 13 30', p.feature, FEATURE_W));
      else out.push(line('M-10 33Q1 42 12 31', p.feature, FEATURE_W));
      break;
    case 'laugh':
      // a big smile on an animal is an open mouth: white teeth alone vanish on the light muzzle
      open(-13, 15, 32, 15, 3);
      break;
    case 'talk':
      open(-7, 11, 33, 10, 2);
      break;
    case 'flat':
      out.push(line('M-4 37H10', p.feature, FEATURE_W));
      break;
    case 'sad':
      out.push(line('M-8 40Q1 33 11 39', p.feature, FEATURE_W));
      break;
    case 'snore':
      // a small, round open mouth, smaller than surprise
      out.push(fill(pill(2, 39, 8, 9), p.mouth));
      break;
    case 'o':
      out.push(fill(pill(1, 38, 11, 13), p.mouth));
      break;
  }
  return out;
}

function tear(p) {
  const x = -EYE.x - 10;
  const y = EYE.y + 24;
  return [fill(circle(x, y, 4.6), p.tear), fill(rtri([x, y - 13], [x - 4.4, y], [x + 4.4, y], 1.4), p.tear)];
}

// ── head: ears, markings, face ──────────────────────────────────────────────
/** Shapes behind the head: mane, upright ears. */
function headBack(sp, p) {
  const out = [];
  if (sp.mane) {
    // one big circle plus a ring of circles of two sizes (rhythm)
    out.push(fill(circle(0, -2, 66), p.pattern));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      out.push(fill(circle(Math.cos(a) * 62, -2 + Math.sin(a) * 62, i % 2 ? 18 : 23), p.pattern));
    }
  }
  for (const s of [-1, 1]) {
    if (sp.ears === 'pointed') {
      out.push(fill(rtri(...mx(s, [[-49, -30], [-40, -98], [-2, -58]]), 8), p.fur));
      out.push(fill(rtri(...mx(s, [[-38, -46], [-36, -82], [-16, -60]]), 5), p.inner));
    } else if (sp.ears === 'round') {
      const r = sp.earR;
      out.push(fill(circle(s * 38, -48, r), sp.dark ? p.pattern : p.fur));
      if (!sp.dark) out.push(fill(circle(s * 39, -51, r * 0.52), p.inner));
    } else if (sp.ears === 'side') {
      out.push(fill(circle(s * 55, -4, 20), p.fur));
      out.push(fill(circle(s * 57, -4, 11), p.inner));
    } else if (sp.ears === 'long') {
      out.push(line(`M${s * 20} -48L${s * 30} -140`, p.fur, 30));
      out.push(line(`M${s * 21.5} -62L${s * 28.5} -128`, p.inner, 13));
    }
  }
  return out;
}

/** The head with the markings, the face and the ears that hang in front. */
export function head(sp, e, p) {
  const hd = sp.head ?? HEAD;
  const out = [fill(rrect(hd.x, hd.y, hd.w, hd.h, hd.r), p.fur)];
  let around = p.fur;
  if (sp.patches) {
    // eye patches: tilted pills, bottoms pointing outward, big enough to hold every eye cut
    for (const s of [-1, 1]) out.push(g(`rotate(${s * -22} ${s * (EYE.x + 4)} ${EYE.y + 3})`, fill(pill(s * (EYE.x + 4), EYE.y + 3, 37, 52), p.pattern)));
    around = p.pattern;
  }
  if (sp.mask) {
    // the face mask: two circles around the eyes and a wide muzzle, one light shape
    out.push(fill(circle(-EYE.x, EYE.y, 23), p.light), fill(circle(EYE.x, EYE.y, 23), p.light), fill(pill(0, 26, 80, 50), p.light));
    around = p.light;
  }
  // eyes next: their cuts take the color around them, so the light shapes go on top
  out.push(...eye(-1, e, p, around), ...eye(1, e, p, around));
  if (sp.stripes) {
    // forehead and cheek stripes: rounded triangles that start at the head's edge
    out.push(fill(rtri([-6, -55], [6, -55], [0, -36], 2.5), p.pattern));
    out.push(fill(rtri([-24, -52], [-13, -54], [-18, -38], 2.5), p.pattern));
    out.push(fill(rtri([24, -52], [13, -54], [18, -38], 2.5), p.pattern));
    for (const s of [-1, 1]) {
      out.push(fill(rtri(...mx(s, [[-49.5, 6], [-49.5, 16], [-35, 12]]), 2.5), p.pattern));
      out.push(fill(rtri(...mx(s, [[-48, 22], [-46, 31], [-34, 25]]), 2.5), p.pattern));
    }
  }
  if (sp.cheeks) out.push(fill(circle(-41, 33, 19), p.light), fill(circle(41, 33, 19), p.light));
  if (sp.snout) {
    // a blunt, boxy snout in the darker pattern color, with two flat nostrils (slanted ones read as angry brows)
    out.push(fill(rrect(-42, 6, 84, 46, 21), p.pattern));
    out.push(fill(pill(-9, 15, 11, 6), p.nose), fill(pill(9, 15, 11, 6), p.nose));
  } else {
    if (!sp.mask && !sp.patches) out.push(fill(pill(0, MUZZLE.y, MUZZLE.w, MUZZLE.h), p.light));
    out.push(fill(rtri([-10, 15], [10, 15], [0, 25], 4), p.nose));
  }
  out.push(...mouth(e, p, sp));
  if (e.tear) out.push(...tear(p));
  if (sp.ears === 'floppy') {
    for (const s of [-1, 1]) out.push(line(`M${s * 50} -44L${s * 61} 2`, p.pattern, 34));
  }
  return out;
}

// ── the body ────────────────────────────────────────────────────────────────
function tail(sp, p) {
  switch (sp.tail) {
    case 'wag':
      return [line('M-48 138L-86 102', p.fur, 20)];
    case 'curl':
      return [line('M-44 150L-98 146L-106 92', p.fur, 17), ...(sp.stripes ? [fill(circle(-106, 88, 9), p.pattern)] : [])];
    case 'tuft':
      return [line('M-44 150L-98 150L-112 120', p.fur, 12), fill(circle(-113, 114, 15), p.pattern)];
    case 'puff':
      return [fill(circle(-64, 150, 17), p.light)];
    case 'long':
      return [line('M-44 152L-104 150L-112 70', p.fur, 15)];
    default:
      return [];
  }
}

/** The torso with the belly, or with a shirt or hoodie when `clothes` is set. */
function torso(sp, p, clothes, bottom = BODY.bottom) {
  const w = sp.body ?? BODY.w;
  if (!clothes) {
    // a panda's body is dark with a white belly: it joins the dark arms and keeps the panda readable on light backgrounds
    const body = sp.dark ? p.pattern : p.fur;
    return [fill(tomb(0, BODY.top, w, bottom - BODY.top, BODY.r), body), fill(pill(0, 120, w * 0.56, Math.min(74, bottom - 84)), p.light)];
  }
  const out = [];
  if (clothes.kind === 'hoodie') out.push(fill(pill(0, 58, 74, 24), clothes.shade));
  out.push(fill(tomb(0, BODY.top + 4, w + 4, bottom - BODY.top - 4, BODY.r), clothes.color));
  if (clothes.kind === 'hoodie') out.push(line('M-9 66V92', clothes.trim, 4.6), line('M9 66V88', clothes.trim, 4.6));
  return out;
}

function feet(sp, p) {
  const c = sp.dark ? p.pattern : p.fur;
  return [fill(pill(-FEET.x, FEET.y, FEET.w, FEET.h), c), fill(pill(FEET.x, FEET.y, FEET.w, FEET.h), c)];
}

/** A floor shadow: a pill, never an oval. */
export function floorShadow(cx, y, w, color = '#E5E5E5') {
  return fill(pill(cx, y, w, 10), color);
}

// ── arms and paws ───────────────────────────────────────────────────────────
/** The paw in its own frame: center at (0, 0), the forearm arriving from below (the paw points to -y). */
function pawLocal(kind, side, color) {
  const r = ARM.paw;
  const ball = fill(circle(0, 0, r), color);
  const w = DIGIT.w;
  if (kind === 'thumb') {
    const top = -r - DIGIT.thumbOut;
    return [ball, fill(rrect(-side * 0.42 * r - w / 2, top, w, -top, w / 2), color)];
  }
  if (kind === 'point') {
    // the index runs along the top edge of the fist and sticks out past it
    return [ball, fill(rrect(-side * 0.5 * r - w / 2, -DIGIT.indexPast, w, DIGIT.indexPast + r * 0.2, w / 2), color)];
  }
  if (kind === 'wave') {
    // four short toes fanned out from the arm's end, no extra palm
    const tw = ARM.w * 0.46;
    const len = ARM.w * 1.1;
    return [-54, -18, 18, 54].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return line(`M0 6L${f(Math.sin(a) * len)} ${f(6 - Math.cos(a) * len)}`, color, tw);
    });
  }
  return [ball];
}

/**
 * One arm. A bare arm is a fur capsule with the paw on top of its end; a
 * sleeve (clothes) covers the top of the paw instead.
 *   spec = { from: [x, y] shoulder inside the torso, elbow?: [x, y], to: [x, y] paw center,
 *            paw: 'ball' | 'thumb' | 'point' | 'wave', side: -1 (left of the image) | 1,
 *            front?: arm in front of the body, shade?: paw over the face (one step darker) }
 */
export function arm(spec, p, clothes, only) {
  const [hx, hy] = spec.to;
  const [bx, by] = spec.elbow ?? spec.from;
  const len = Math.hypot(hx - bx, hy - by) || 1;
  const ux = (hx - bx) / len;
  const uy = (hy - by) / len;
  const angle = (Math.atan2(uy, ux) * 180) / Math.PI + 90;
  const pawColor = spec.shade ? p.furShade : p.fur;
  const paw = g(`translate(${f(hx)} ${f(hy)}) rotate(${f(angle)})`, ...pawLocal(spec.paw ?? 'ball', spec.side, pawColor));
  const end = clothes ? [hx - ux * ARM.cuff, hy - uy * ARM.cuff] : spec.paw === 'wave' ? [hx, hy] : [hx - ux * 6, hy - uy * 6];
  const pts = spec.elbow ? [spec.from, spec.elbow, end] : [spec.from, end];
  const capsule = line(`M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}`, clothes ? clothes.color : p.fur, ARM.w);
  // a paw gripping an object goes on top of it: the caller draws the arm, the object, then the paw
  if (spec.grip) return only === 'paw' ? [paw] : [capsule];
  if (only === 'paw') return [];
  return clothes ? [paw, capsule] : [capsule, paw];
}

/** Floating "Z"s for a sleeping animal: rounded strokes, growing up and away from the head. `n` shows only the first ones (for animation). */
export function zzz(p, n = 3) {
  return [
    [58, -58, 9],
    [76, -84, 12],
    [98, -116, 15],
  ].slice(0, n).map(([x, y, s]) => line(`M${x - s / 2} ${y - s / 2}H${x + s / 2}L${x - s / 2} ${y + s / 2}H${x + s / 2}`, p.zzz, s * 0.32));
}

/** A thought bubble with three dots ("one moment…"), rising from the head: two small circles, then the bubble. `n` shows only the first dots (for animation). */
export function thoughtDots(p, n = 3) {
  return [
    fill(circle(52, -64, 6), p.bubble),
    fill(circle(64, -82, 9), p.bubble),
    fill(rrect(54, -138, 100, 48, 24), p.bubble),
    ...[80, 104, 128].slice(0, n).map((x) => fill(circle(x, -114, 7), p.zzz)),
  ];
}

// ── poses ───────────────────────────────────────────────────────────────────
const S = SHOULDER;
const hanging = (side, x = 74) => ({ from: [side * S.x, S.y], to: [side * x, 150], side });

/**
 * The whole animal in the layer order of SKILL.md: tail, arms behind, torso
 * and belly, feet, mane and ears, head, front arms (paws on top).
 */
function fullBody(sp, e, p, arms, clothes, extra = {}) {
  // a panda's arms and paws are dark: the pattern color, with no lighter or darker step
  const pa = sp.dark ? { ...p, fur: p.pattern, furShade: p.pattern } : p;
  const front = arms.filter((a) => a.front);
  return [
    floorShadow(0, 186, 150),
    ...tail(sp, p),
    ...arms.filter((a) => !a.front).flatMap((a) => arm(a, pa, clothes)),
    ...torso(sp, p, clothes),
    ...feet(sp, p),
    ...headBack(sp, p),
    ...head(sp, e, p),
    // front arms, then a held object, then the paws that grip it
    ...front.flatMap((a) => arm(a, pa, clothes)),
    ...(extra.held ?? []),
    ...front.filter((a) => a.grip).flatMap((a) => arm(a, pa, clothes, 'paw')),
    ...(extra.over ?? []),
  ];
}

export const POSES = {
  /** Standing, arms hanging, a friendly smile. */
  neutral: (sp, p, c) => fullBody(sp, EXPRESSIONS.neutral, p, [hanging(-1), hanging(1)], c),

  /** Asking a question: paw under the chin (one shade darker over the face), eyes up to the side. */
  asking: (sp, p, c) =>
    fullBody(sp, EXPRESSIONS.thinking, p, [hanging(-1), { from: [S.x, S.y], elbow: [98, 122], to: [30, 64], side: 1, front: true, shade: true }], c),

  /** Explaining: one straight arm pointing to the side (room for a speech bubble), talking. */
  explaining: (sp, p, c) =>
    fullBody(sp, EXPRESSIONS.talking, p, [hanging(-1), { from: [S.x, S.y], to: [120, 72], paw: 'point', side: 1 }], c),

  /** Right answer: paw up (thumbs up), elbow out, forearm standing, segments of equal length. */
  pawUp: (sp, p, c) =>
    fullBody(sp, EXPRESSIONS.happy, p, [hanging(1), { from: [-S.x, S.y], elbow: [-100, 128], to: [-100, 60], paw: 'thumb', side: -1 }], c),

  /** Cheering: both arms up in a V, laughing. */
  cheering: (sp, p, c) =>
    fullBody(
      sp,
      EXPRESSIONS.laugh,
      p,
      [
        { from: [-S.x, S.y], to: [-110, -26], side: -1 },
        { from: [S.x, S.y], to: [110, -26], side: 1 },
      ],
      c,
    ),

  /** Wrong answer: arms close to the body, sad eyes, a tear. */
  sad: (sp, p, c) => fullBody(sp, EXPRESSIONS.sad, p, [hanging(-1, 66), hanging(1, 66)], c),

  /** Waving hello: bent arm up, four toes fanned out. */
  waving: (sp, p, c) =>
    fullBody(sp, EXPRESSIONS.happy, p, [hanging(-1), { from: [S.x, S.y], elbow: [104, 100], to: [114, 30], paw: 'wave', side: 1 }], c),

  /** Surprised: both paws up beside the face at the silhouette edge, wide eyes, an "o" mouth. */
  surprised: (sp, p, c) =>
    fullBody(
      sp,
      EXPRESSIONS.surprised,
      p,
      [
        { from: [-S.x, S.y], elbow: [-102, 112], to: [-74, 40], side: -1 },
        { from: [S.x, S.y], elbow: [102, 112], to: [74, 40], side: 1 },
      ],
      c,
    ),

  /** Empty states ("no messages yet"): asleep, arms relaxed close to the body, three floating Z's. */
  sleeping: (sp, p, c) => fullBody(sp, EXPRESSIONS.sleeping, p, [hanging(-1, 66), hanging(1, 66)], c, { over: zzz(p) }),

  /** Wait and loading screens: paw at the chin, eyes up, a thought bubble with three dots. */
  waiting: (sp, p, c) =>
    fullBody(
      sp,
      { eyes: 'open', mouth: 'flat', look: [5, -5] },
      p,
      [hanging(-1), { from: [S.x, S.y], elbow: [98, 122], to: [30, 64], side: 1, front: true, shade: true }],
      c,
      { over: thoughtDots(p) },
    ),
};

// ── public entry points ─────────────────────────────────────────────────────
function resolve(species, { color, palette, clothes } = {}) {
  const sp = SPECIES[species];
  if (!sp) throw new Error(`Unknown animal "${species}". Use one of: ${Object.keys(SPECIES).join(', ')}`);
  const base = palette ?? (color ? paletteFromColor(FANTASY[color] ?? color) : sp.palette);
  const p = { ...FACE, ...base };
  let c = null;
  if (clothes) {
    const [ch, , cl] = rgbToHsl(hexToRgb(clothes.color));
    c = { kind: clothes.kind ?? 'shirt', color: clothes.color, shade: hslToHex(ch, 0.8, cl - 0.08), trim: '#FFFFFF' };
  }
  return { sp, p, c };
}

/** Parts for one full-body pose: animal('lion', 'cheering', { color: 'blue', clothes: { kind: 'hoodie', color: '#58CC02' } }). */
export function animal(species, poseId = 'neutral', opts = {}) {
  const { sp, p, c } = resolve(species, opts);
  if (!POSES[poseId]) throw new Error(`Unknown pose "${poseId}". Use one of: ${Object.keys(POSES).join(', ')}`);
  return POSES[poseId](sp, p, c);
}

/**
 * Parts for a pose of your own: an expression (an EXPRESSIONS id or an object
 * like { eyes: 'blink', mouth: 'smile' }) and arm specs as described at arm().
 * The first part is the floor shadow, so an animation can lift the rest.
 *   custom('dog', 'happy', [{ from: [38, 98], elbow: [104, 100], to: [114, 30], paw: 'wave', side: 1 }])
 * Arms you leave out are not drawn: pass hanging ones for an idle side.
 */
export function custom(species, expression = 'neutral', arms = [], opts = {}) {
  const { sp, p, c } = resolve(species, opts);
  const e = typeof expression === 'string' ? EXPRESSIONS[expression] : expression;
  if (!e) throw new Error(`Unknown expression "${expression}". Use one of: ${Object.keys(EXPRESSIONS).join(', ')}`);
  // held: drawn between the front arms and their gripping paws; over: on top of everything.
  // Either can be a list of parts or a function of the resolved palette.
  const extra = (x) => (typeof x === 'function' ? x(p) : x);
  return fullBody(sp, e, p, arms, c, { held: extra(opts.held), over: extra(opts.over) });
}

/** Parts for a chat avatar: head and shoulders only, no arms. */
export function avatar(species, expressionId = 'neutral', opts = {}) {
  const { sp, p, c } = resolve(species, opts);
  const e = EXPRESSIONS[expressionId];
  if (!e) throw new Error(`Unknown expression "${expressionId}". Use one of: ${Object.keys(EXPRESSIONS).join(', ')}`);
  // no Z's on an avatar: a round crop cuts them off, the closed eyes and the small mouth already say "asleep"
  return [...torso(sp, p, c, 150), ...headBack(sp, p), ...head(sp, e, p)];
}

/** The frame (in head units) that fits an animal: full body or avatar. */
export function frameFor(species, kind = 'body') {
  const tall = SPECIES[species]?.ears === 'long';
  if (kind === 'avatar') return tall ? { x: -115, y: -150, w: 230, h: 230 } : { x: -100, y: -110, w: 200, h: 200 };
  return { x: -160, y: tall ? -150 : -110, w: 320, h: tall ? 345 : 305 };
}

// ── SVG output ──────────────────────────────────────────────────────────────
export function partToSvg(part) {
  if ('kids' in part) return `<g transform="${part.t}">${part.kids.map(partToSvg).join('')}</g>`;
  if (part.stroke) {
    return `<path d="${part.d}" fill="none" stroke="${part.stroke}" stroke-width="${part.sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return `<path d="${part.d}" fill="${part.fill}"${part.evenOdd ? ' fill-rule="evenodd"' : ''}/>`;
}

/**
 * A standalone SVG. `frame` is the visible box in head units (see frameFor);
 * `round` clips to a circle (chat avatars), `background` fills behind.
 */
export function toSvg(parts, { frame = { x: -160, y: -110, w: 320, h: 305 }, size = 400, background, round = false } = {}) {
  const { x, y, w, h } = frame;
  const width = size;
  const height = Math.round((size * h) / w);
  const id = 'clip';
  const clip = round ? `<defs><clipPath id="${id}"><circle cx="${x + w / 2}" cy="${y + h / 2}" r="${w / 2}"/></clipPath></defs>` : '';
  const bg = background ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${background}"/>` : '';
  const body = `${bg}${parts.map(partToSvg).join('')}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x} ${y} ${w} ${h}">${clip}${round ? `<g clip-path="url(#${id})">${body}</g>` : body}</svg>`;
}
