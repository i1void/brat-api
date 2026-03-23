function wrapText(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function fitSize(ctx, text, maxW, maxH, min, max) {
  let size = max;
  while (size > min) {
    ctx.font = `${size}px "Arial Narrow", sans-serif`;
    const lines = wrapText(ctx, text, maxW);
    const h = lines.length * size * 1.15;
    const w = lines.reduce((a, l) => Math.max(a, ctx.measureText(l).width), 0);
    if (w <= maxW && h <= maxH) break;
    size -= 2;
  }
  return Math.max(size, min);
}

export function renderBrat(createCanvas, text, bg, fg, opacity = 1, width = 800, height = 800) {
  // Step 1: render teks ke canvas sementara (full size)
  const raw = createCanvas(width, height);
  const rawCtx = raw.getContext('2d');
  const pad = width * 0.06;
  const maxW = width - pad * 2;

  // background
  rawCtx.fillStyle = bg;
  rawCtx.fillRect(0, 0, width, height);

  // teks
  rawCtx.globalAlpha = opacity;
  rawCtx.fillStyle = fg;
  rawCtx.textAlign = 'center';
  rawCtx.textBaseline = 'middle';

  const size = fitSize(rawCtx, text, maxW, height - pad * 2, width * 0.08, width);
  rawCtx.font = `${size}px "Arial Narrow", sans-serif`;

  const lines = wrapText(rawCtx, text, maxW);
  const lineH = size * 1.15;
  const totalH = lines.length * lineH;
  let y = (height - totalH) / 2 + size / 2;
  const cx = width / 2;
  for (const line of lines) {
    rawCtx.fillText(line, cx, y);
    y += lineH;
  }
  rawCtx.globalAlpha = 1;

  // Step 2: pixelate — scale down ke 85% lalu scale up balik, tanpa smoothing
  const scaledW = Math.round(width * 0.85);
  const scaledH = Math.round(height * 0.85);

  const small = createCanvas(scaledW, scaledH);
  const smallCtx = small.getContext('2d');
  smallCtx.imageSmoothingEnabled = false;
  smallCtx.drawImage(raw, 0, 0, scaledW, scaledH);

  const final = createCanvas(width, height);
  const finalCtx = final.getContext('2d');
  finalCtx.imageSmoothingEnabled = false;

  // Step 3: blur 1px — pakai filter kalau support (browser), fallback tanpa blur (server)
  try {
    finalCtx.filter = 'blur(1px)';
  } catch (_) { /* server-side canvas mungkin ga support filter */ }

  finalCtx.drawImage(small, 0, 0, width, height);

  try {
    finalCtx.filter = 'none';
  } catch (_) {}

  return final;
}
