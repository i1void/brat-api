import { createCanvas } from '@napi-rs/canvas';
import { albumColors } from '../src/lib/colors.js';
import { renderBrat } from '../src/renderer/bratRenderer.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const url = req.url ?? '';

  if (url.includes('/api/health')) {
    return res.status(200).json({ ok: true });
  }

  if (url.includes('/api/presets')) {
    return res.status(200).json(Object.entries(albumColors).map(([key, val]) => ({ key, ...val })));
  }

  const { text, preset, bg, fg, opacity, width, height } = req.query ?? {};

  if (!text?.trim()) {
    return res.status(400).json({ error: 'Missing param: text', presets: Object.keys(albumColors) });
  }

  let background, foreground;
  if (bg || fg) {
    background = `#${(bg ?? 'ffffff').replace('#', '')}`;
    foreground = `#${(fg ?? '000000').replace('#', '')}`;
  } else if (preset && albumColors[preset]) {
    background = albumColors[preset].bg;
    foreground = albumColors[preset].fg;
  } else {
    background = '#ffffff';
    foreground = '#000000';
  }

  const op = Math.min(1, Math.max(0, parseFloat(opacity ?? '1') || 1));
  const w  = Math.min(2000, Math.max(200, parseInt(width  ?? '800') || 800));
  const h  = Math.min(2000, Math.max(200, parseInt(height ?? '800') || 800));

  try {
    const canvas = renderBrat(createCanvas, text.trim(), background, foreground, op, w, h);
    const buffer = canvas.toBuffer('image/png');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Render failed', detail: String(err) });
  }
}
