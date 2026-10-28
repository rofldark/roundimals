// docs/app.js – the browser demo. All drawing comes from kit.mjs, a copy of
// roundimals/reference/kit.mjs (refresh it with node scripts/sync-demo.mjs).
import { SPECIES, POSES, EXPRESSIONS, animal, avatar, toSvg, frameFor } from './kit.mjs';

const $ = (id) => document.getElementById(id);
const state = { species: 'dog' };

// readable labels for the kit's ids
const label = (id) => id.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

// animal buttons, each with a small avatar
for (const species of Object.keys(SPECIES)) {
  const b = document.createElement('button');
  b.type = 'button';
  b.dataset.species = species;
  const svg = toSvg(avatar(species, 'happy'), { frame: frameFor(species, 'avatar'), size: 88 });
  const img = document.createElement('img');
  img.alt = '';
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  b.append(img, document.createTextNode(label(species)));
  b.addEventListener('click', () => {
    state.species = species;
    render();
  });
  $('animals').append(b);
}
for (const id of Object.keys(POSES)) $('pose').add(new Option(label(id), id));
for (const id of Object.keys(EXPRESSIONS)) $('expression').add(new Option(label(id), id));

const radio = (name) => document.querySelector(`input[name="${name}"]:checked`).value;

function options() {
  const opts = {};
  if (radio('colorMode') === 'custom') opts.color = $('color').value;
  if ($('clothes').value) opts.clothes = { kind: $('clothes').value, color: $('clothesColor').value };
  return opts;
}

/** The current drawing as an SVG string at the given width. */
function currentSvg(size = 420) {
  const isAvatar = radio('kind') === 'avatar';
  const opts = options();
  const parts = isAvatar ? avatar(state.species, $('expression').value, opts) : animal(state.species, $('pose').value, opts);
  return toSvg(parts, {
    frame: frameFor(state.species, isAvatar ? 'avatar' : 'body'),
    size,
    background: $('bgOn').checked ? $('bg').value : undefined,
    round: isAvatar && $('round').checked,
  });
}

function fileName(ext) {
  const what = radio('kind') === 'avatar' ? `avatar-${$('expression').value}` : $('pose').value;
  return `roundimals-${state.species}-${what}.${ext}`;
}

function render() {
  const isAvatar = radio('kind') === 'avatar';
  $('poseBox').hidden = isAvatar;
  $('exprBox').hidden = !isAvatar;
  $('color').disabled = radio('colorMode') !== 'custom';
  $('clothesColor').disabled = !$('clothes').value;
  $('bg').disabled = !$('bgOn').checked;
  for (const b of $('animals').children) b.setAttribute('aria-pressed', String(b.dataset.species === state.species));
  // the kit only builds path data from numbers and fixed colors, so the markup is safe to insert
  $('stage').innerHTML = currentSvg();
  $('status').textContent = '';
}

function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

$('dlSvg').addEventListener('click', () => download(new Blob([currentSvg()], { type: 'image/svg+xml' }), fileName('svg')));

$('dlPng').addEventListener('click', () => {
  const svg = currentSvg(1024);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    c.toBlob((blob) => download(blob, fileName('png')), 'image/png');
  };
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
});

$('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(currentSvg());
    $('status').textContent = 'SVG code copied.';
  } catch {
    $('status').textContent = 'Copying is not allowed here. Use Download SVG instead.';
  }
});

for (const el of document.querySelectorAll('input, select')) el.addEventListener('input', render);
render();
