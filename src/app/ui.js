import { albumColors } from '../lib/colors.js';
import { randomText } from '../lib/texts.js';
import { drawToCanvas, exportPng, copyImage } from './canvas.js';

const state = {
  text: randomText(),
  preset: 'brat',
  bg: albumColors['brat'].bg,
  fg: albumColors['brat'].fg,
  opacity: 1,
};

const $ = id => document.getElementById(id);
const canvas     = $('preview-canvas');
const txtInput   = $('text-input');
const selPreset  = $('preset-select');
const inBg       = $('bg-color');
const inFg       = $('fg-color');
const inOpacity  = $('opacity-range');
const lblOpacity = $('opacity-value');
const btnRandom  = $('btn-random');
const btnDl      = $('btn-download');
const btnCopy    = $('btn-copy');
const apiUrl     = $('api-url');
const btnCpApi   = $('btn-copy-api');

// build preset options
Object.entries(albumColors).forEach(([key, val]) => {
  const opt = document.createElement('option');
  opt.value = key; opt.textContent = val.name;
  selPreset.appendChild(opt);
});
const customOpt = document.createElement('option');
customOpt.value = 'custom'; customOpt.textContent = 'custom color';
selPreset.appendChild(customOpt);
selPreset.value = state.preset;
txtInput.value = state.text;
inBg.value = state.bg;
inFg.value = state.fg;
inBg.disabled = true;
inFg.disabled = true;

function updateApiUrl() {
  const p = new URLSearchParams({ text: state.text });
  if (state.preset !== 'custom') p.set('preset', state.preset);
  else { p.set('bg', state.bg.replace('#', '')); p.set('fg', state.fg.replace('#', '')); }
  if (state.opacity < 1) p.set('opacity', state.opacity);
  apiUrl.textContent = `${location.origin}/api?${p}`;
}

let timer = null;
export function render() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    drawToCanvas(canvas, state.text || 'brat', state.bg, state.fg, state.opacity);
    updateApiUrl();
  }, 80);
}

selPreset.addEventListener('change', () => {
  state.preset = selPreset.value;
  if (state.preset !== 'custom' && albumColors[state.preset]) {
    state.bg = albumColors[state.preset].bg;
    state.fg = albumColors[state.preset].fg;
    inBg.value = state.bg; inFg.value = state.fg;
    inBg.disabled = true; inFg.disabled = true;
  } else {
    inBg.disabled = false; inFg.disabled = false;
  }
  render();
});

txtInput.addEventListener('input', () => { state.text = txtInput.value; render(); });
inBg.addEventListener('input', () => { state.bg = inBg.value; state.preset = 'custom'; selPreset.value = 'custom'; inBg.disabled = false; inFg.disabled = false; render(); });
inFg.addEventListener('input', () => { state.fg = inFg.value; state.preset = 'custom'; selPreset.value = 'custom'; inBg.disabled = false; inFg.disabled = false; render(); });
inOpacity.addEventListener('input', () => { state.opacity = parseFloat(inOpacity.value); lblOpacity.textContent = state.opacity.toFixed(2); render(); });
btnRandom.addEventListener('click', () => { state.text = randomText(); txtInput.value = state.text; render(); });

btnDl.addEventListener('click', () => {
  exportPng(state.text || 'brat', state.bg, state.fg, state.opacity, `${(state.text || 'brat').slice(0, 20)}.png`);
});

btnCopy.addEventListener('click', async () => {
  btnCopy.textContent = 'copying...'; btnCopy.disabled = true;
  try {
    await copyImage(state.text || 'brat', state.bg, state.fg, state.opacity);
    btnCopy.textContent = 'copied!';
  } catch { btnCopy.textContent = 'failed!'; }
  finally { btnCopy.disabled = false; setTimeout(() => { btnCopy.textContent = 'copy image'; }, 1500); }
});

btnCpApi.addEventListener('click', async () => {
  await navigator.clipboard.writeText(apiUrl.textContent);
  btnCpApi.textContent = 'copied!';
  setTimeout(() => { btnCpApi.textContent = 'copy url'; }, 1200);
});
