// scripts/make-mockups.mjs
// Writes three phone mockups as one SVG, to show how the animals look inside an app:
// a quiz question, a lesson-complete screen and a chat with avatars.
// Usage: node scripts/make-mockups.mjs mockups.svg   (then screenshot at 1400 x 980)
import fs from 'node:fs';
import { animal, avatar, partToSvg } from '../roundimals/reference/kit.mjs';

const W = 1400;
const H = 980;
const PHONE = { w: 390, h: 844, r: 48, bezel: 14 };
const UI = { bg: '#FFFFFF', text: '#1F2328', muted: '#6E7781', line: '#E3E6EA', accent: '#4F6BED', accentDark: '#3A51C4', soft: '#EEF1FD', ok: '#2EAD6B', okSoft: '#E5F6EC' };
const FONT = 'font-family="Helvetica, Arial, sans-serif"';

const parts = (list) => list.map(partToSvg).join('');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const text = (x, y, s, { size = 16, weight = 400, fill = UI.text, anchor = 'start' } = {}) =>
  `<text x="${x}" y="${y}" ${FONT} font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const rect = (x, y, w, h, r, fill, stroke) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="2"` : ''}/>`;
/** An animal (full body) with its head center at (x, y), `s` = scale. */
const place = (list, x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${parts(list)}</g>`;
let clipId = 0;
/** A round avatar of radius r centered at (cx, cy). */
function roundAvatar(species, expression, cx, cy, r, bg) {
  const id = `av${clipId++}`;
  const s = r / 100;
  return (
    `<g transform="translate(${cx} ${cy + 10 * s}) scale(${s})">` +
    `<defs><clipPath id="${id}"><circle cx="0" cy="-10" r="100"/></clipPath></defs>` +
    `<g clip-path="url(#${id})"><circle cx="0" cy="-10" r="100" fill="${bg}"/>${parts(avatar(species, expression))}</g></g>`
  );
}
/** A speech bubble with a tail on its left side pointing toward (tx, ty). */
function bubble(x, y, w, h, tx, ty, lines) {
  const my = y + h / 2 + 10;
  const tail = `<path d="M${x + 2} ${my - 14}L${tx} ${ty}L${x + 2} ${my + 10}Z" fill="${UI.bg}" stroke="${UI.line}" stroke-width="2" stroke-linejoin="round"/>`;
  const cover = `<rect x="${x}" y="${my - 13}" width="5" height="22" fill="${UI.bg}"/>`;
  const body = lines.map((l, i) => text(x + 20, y + 34 + i * 24, l, { size: 19, weight: i === 0 ? 600 : 400 })).join('');
  return rect(x, y, w, h, 18, UI.bg, UI.line) + tail + cover + body;
}
function statusBar() {
  return text(32, 34, '9:41', { size: 15, weight: 600 }) + rect(PHONE.w - 64, 22, 30, 13, 4, 'none', UI.text);
}

// ── screen 1: a quiz question ───────────────────────────────────────────────
function quiz() {
  let s = statusBar();
  s += text(26, 82, '✕', { size: 22, fill: UI.muted });
  s += rect(60, 70, 300, 14, 7, UI.line) + rect(60, 70, 130, 14, 7, UI.accent);
  s += text(24, 132, 'Spanish · Lesson 3', { size: 15, fill: UI.muted });
  s += text(24, 162, 'Choose the right word', { size: 24, weight: 700 });
  s += place(animal('tiger', 'asking'), 98, 268, 0.78);
  s += bubble(172, 196, 204, 92, 146, 252, ['How do you say', '"apple" in Spanish?']);
  const answers = ['la manzana', 'el perro', 'la casa', 'el libro'];
  answers.forEach((a, i) => {
    const x = 24 + (i % 2) * 176;
    const y = 446 + Math.floor(i / 2) * 82;
    const picked = i === 0;
    s += rect(x, y, 166, 66, 16, picked ? UI.soft : UI.bg, picked ? UI.accent : UI.line);
    s += text(x + 83, y + 40, a, { size: 18, weight: 600, fill: picked ? UI.accentDark : UI.text, anchor: 'middle' });
  });
  s += rect(24, 742, 342, 58, 16, UI.accent) + text(195, 778, 'Check', { size: 19, weight: 700, fill: '#FFFFFF', anchor: 'middle' });
  return s;
}

// ── screen 2: lesson complete ───────────────────────────────────────────────
function success() {
  let s = statusBar();
  // a few floating accents, rounded and few
  for (const [x, y, r, c] of [[70, 150, 7, '#FFC800'], [320, 130, 9, '#FF8FB1'], [300, 260, 6, UI.accent], [88, 290, 8, UI.ok], [200, 110, 5, '#FF9600']]) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  s += place(animal('lion', 'cheering', { color: '#4F6BED' }), 195, 250, 0.95);
  s += text(195, 488, 'Lesson complete!', { size: 30, weight: 700, anchor: 'middle' });
  s += text(195, 520, 'You learned 8 new words.', { size: 17, fill: UI.muted, anchor: 'middle' });
  const stats = [['XP', '+20'], ['Accuracy', '95%'], ['Streak', '4 days']];
  stats.forEach(([k, v], i) => {
    const x = 24 + i * 116;
    s += rect(x, 556, 106, 92, 16, UI.bg, UI.line);
    s += text(x + 53, 590, k, { size: 14, fill: UI.muted, anchor: 'middle' });
    s += text(x + 53, 626, v, { size: 22, weight: 700, fill: i === 0 ? UI.accent : UI.text, anchor: 'middle' });
  });
  s += rect(24, 742, 342, 58, 16, UI.ok) + text(195, 778, 'Continue', { size: 19, weight: 700, fill: '#FFFFFF', anchor: 'middle' });
  return s;
}

// ── screen 3: a chat with avatars ───────────────────────────────────────────
function chat() {
  let s = statusBar();
  s += `<line x1="0" y1="116" x2="${PHONE.w}" y2="116" stroke="${UI.line}" stroke-width="2"/>`;
  s += text(22, 92, '‹', { size: 30, fill: UI.accent });
  s += roundAvatar('panda', 'happy', 70, 84, 22, '#EEF1FD');
  s += text(102, 80, 'Study buddies', { size: 18, weight: 700 }) + text(102, 101, 'Pip, Mo and you', { size: 13, fill: UI.muted });
  const msgs = [
    ['panda', 'happy', 'Morning! Ready for today\'s quiz?', '#EEF1FD'],
    ['me', null, 'Yes! 10 words, let\'s go', null],
    ['hamster', 'surprised', 'Wait, it\'s Friday already?', '#FFF4E0'],
    ['panda', 'laugh', 'It is. Last one to finish', '#EEF1FD', 'buys the snacks'],
    ['me', null, 'Challenge accepted', null],
    ['hamster', 'sad', 'I always lose this one…', '#FFF4E0'],
  ];
  let y = 146;
  for (const [who, expr, line1, bg, line2] of msgs) {
    const lines = line2 ? [line1, line2] : [line1];
    const h = 26 + lines.length * 22;
    if (who === 'me') {
      const w = Math.max(...lines.map((l) => l.length)) * 9 + 32;
      s += rect(PHONE.w - 18 - w, y, w, h, 18, UI.accent);
      lines.forEach((l, i) => (s += text(PHONE.w - 18 - w + 16, y + 30 + i * 22, l, { size: 16, fill: '#FFFFFF' })));
    } else {
      const w = Math.max(...lines.map((l) => l.length)) * 8.2 + 32;
      s += roundAvatar(who, expr, 40, y + h - 22, 22, bg);
      s += rect(72, y, w, h, 18, '#F3F4F6');
      lines.forEach((l, i) => (s += text(88, y + 30 + i * 22, l, { size: 16 })));
    }
    y += h + 16;
  }
  s += rect(16, 752, 296, 50, 25, '#F3F4F6') + text(38, 783, 'Message', { size: 16, fill: UI.muted });
  s += `<circle cx="345" cy="777" r="25" fill="${UI.accent}"/>` + `<path d="M335 777H353M346 769L354 777L346 785" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
}

function phone(x, y, screen, caption) {
  const { w, h, r, bezel } = PHONE;
  const id = `scr${clipId++}`;
  return (
    rect(x - bezel, y - bezel, w + 2 * bezel, h + 2 * bezel, r + bezel, '#1F2328') +
    `<defs><clipPath id="${id}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}"/></clipPath></defs>` +
    `<g transform="translate(${x} ${y})"><g clip-path="url(#${id})"><rect width="${w}" height="${h}" fill="${UI.bg}"/>${screen}</g></g>` +
    text(x + w / 2, y + h + bezel + 40, caption, { size: 20, fill: UI.muted, anchor: 'middle' })
  );
}

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<rect width="${W}" height="${H}" fill="#F7F7F7"/>` +
  phone(60, 40, quiz(), 'Quiz host') +
  phone(505, 40, success(), 'Lesson complete') +
  phone(950, 40, chat(), 'Chat avatars') +
  `</svg>`;
fs.writeFileSync(process.argv[2] ?? 'mockups.svg', svg);
