// Wires up the page: live preview, presets, custom colors, export and the API URL box.
import { drawToCanvas, exportPng, copyImage } from './canvas.js';
import { albumColors } from '../lib/colors.js';
import { randomText } from '../lib/texts.js';

const CUSTOM = 'custom';
const $ = (id) => document.getElementById(id);

function flash(btn, msg) {
  if (!btn.dataset.label) btn.dataset.label = btn.textContent;
  btn.textContent = msg;
  clearTimeout(btn._t);
  btn._t = setTimeout(() => { btn.textContent = btn.dataset.label; }, 1500);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // older browsers / non-secure pages
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (!ok) throw new Error('copy failed');
  }
}

export function init() {
  const canvas = $('preview-canvas');
  const textEl = $('text-input');
  const presetEl = $('preset-select');
  const bgEl = $('bg-color');
  const fgEl = $('fg-color');
  const opacityEl = $('opacity-range');
  const opacityOut = $('opacity-value');
  const apiEl = $('api-url');

  // the API lives on whatever domain this page is served from
  const base = location.origin;
  const drawerUrl = $('drawer-api-url');
  if (drawerUrl) drawerUrl.textContent = base;

  // presets
  presetEl.innerHTML =
    Object.entries(albumColors).map(([key, p]) => `<option value="${key}">${p.name}</option>`).join('') +
    `<option value="${CUSTOM}">custom colors</option>`;
  presetEl.value = 'brat';

  const text = () => textEl.value.trim() || 'brat';
  const opacity = () => parseFloat(opacityEl.value);
  const colors = () => (presetEl.value === CUSTOM
    ? { bg: bgEl.value, fg: fgEl.value }
    : { bg: albumColors[presetEl.value].bg, fg: albumColors[presetEl.value].fg });

  function syncColorInputs() {
    const custom = presetEl.value === CUSTOM;
    if (!custom) { bgEl.value = albumColors[presetEl.value].bg; fgEl.value = albumColors[presetEl.value].fg; }
    bgEl.disabled = fgEl.disabled = !custom;
  }

  function apiUrl() {
    const p = new URLSearchParams({ text: text() });
    if (presetEl.value === CUSTOM) {
      p.set('bg', bgEl.value.replace('#', ''));
      p.set('fg', fgEl.value.replace('#', ''));
    } else {
      p.set('preset', presetEl.value);
    }
    if (opacity() !== 1) p.set('opacity', opacity().toFixed(2));
    return `${base}/api?${p}`;
  }

  let queued = false;
  function render() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const { bg, fg } = colors();
      drawToCanvas(canvas, text(), bg, fg, opacity());
      apiEl.textContent = apiUrl();
      opacityOut.textContent = opacity().toFixed(2);
    });
  }

  // events
  textEl.addEventListener('input', render);
  presetEl.addEventListener('change', () => { syncColorInputs(); render(); });
  bgEl.addEventListener('input', render);
  fgEl.addEventListener('input', render);
  opacityEl.addEventListener('input', render);
  $('btn-random').addEventListener('click', () => { textEl.value = randomText(); render(); });

  $('btn-download').addEventListener('click', () => {
    const { bg, fg } = colors();
    const slug = text().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image';
    exportPng(text(), bg, fg, opacity(), `brat-${slug}.png`);
  });

  // note: e.currentTarget is null after an await, so keep the button in a variable first
  $('btn-copy').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const { bg, fg } = colors();
    try { await copyImage(text(), bg, fg, opacity()); flash(btn, 'copied ✓'); }
    catch { flash(btn, 'not supported'); }
  });

  $('btn-copy-api').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    try { await copyText(apiUrl()); flash(btn, 'copied ✓'); }
    catch { flash(btn, 'failed'); }
  });

  // first paint, then again once the Arial Narrow web font is ready (canvas needs it loaded)
  syncColorInputs();
  render();
  if (document.fonts) {
    const wait = Promise.race([document.fonts.load('100px "Arial Narrow"'), new Promise((r) => setTimeout(r, 3000))]);
    wait.catch(() => {}).then(render);
    document.fonts.ready.then(render);
  }
}
