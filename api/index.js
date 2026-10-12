import { createCanvas } from '@napi-rs/canvas';
import { albumColors } from '../src/lib/colors.js';
import { renderBrat } from '../src/renderer/bratRenderer.js';
import { ensureFont } from '../src/server/font.js';

const MAX_TEXT = 500;
const HEX = /^([0-9a-f]{3}|[0-9a-f]{6})$/i;

const first = (v) => (Array.isArray(v) ? v[0] : v);
const num = (v, fallback) => { const n = parseFloat(first(v)); return Number.isFinite(n) ? n : fallback; };
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const hex = (v) => `#${String(v).replace('#', '')}`;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const q = req.query ?? {};
  const text = String(first(q.text) ?? '').trim();

  if (!text) {
    return res.status(400).json({
      error: 'Missing param: text',
      example: '/api?text=hello&preset=brat',
      presets: Object.keys(albumColors),
    });
  }
  if (text.length > MAX_TEXT) {
    return res.status(400).json({ error: `Text too long (max ${MAX_TEXT} characters)` });
  }

  // colors: bg/fg win over preset; nothing set = classic brat green
  const bgParam = first(q.bg), fgParam = first(q.fg), presetParam = first(q.preset);
  let background, foreground;
  if (bgParam || fgParam) {
    if ((bgParam && !HEX.test(String(bgParam).replace('#', ''))) ||
        (fgParam && !HEX.test(String(fgParam).replace('#', '')))) {
      return res.status(400).json({ error: 'bg / fg must be a hex color, e.g. 8ace00' });
    }
    background = bgParam ? hex(bgParam) : '#ffffff';
    foreground = fgParam ? hex(fgParam) : '#000000';
  } else {
    if (presetParam && !albumColors[presetParam]) {
      return res.status(400).json({ error: `Unknown preset "${presetParam}"`, presets: Object.keys(albumColors) });
    }
    const p = albumColors[presetParam] ?? albumColors.brat;
    background = p.bg;
    foreground = p.fg;
  }

  const opacity = clamp(num(q.opacity, 1), 0, 1);
  const width = clamp(Math.round(num(q.width, 800)), 200, 2000);
  const height = clamp(Math.round(num(q.height, 800)), 200, 2000);

  if (!ensureFont()) {
    return res.status(500).json({ error: 'Font could not be loaded on the server (public/fonts/arialnarrow.ttf)' });
  }

  try {
    const canvas = renderBrat(createCanvas, text, background, foreground, opacity, width, height);
    const png = canvas.toBuffer('image/png');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).send(png);
  } catch (err) {
    return res.status(500).json({ error: 'Render failed', detail: String(err?.message ?? err) });
  }
}
