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
  // render ke canvas kecil dulu (85%)
  const small = Math.round(width * 0.85);
  const tmp = createCanvas(small, small);
  const tCtx = tmp.getContext('2d');
  const pad = small * 0.06;
  const maxW = small - pad * 2;

  tCtx.fillStyle = bg;
  tCtx.fillRect(0, 0, small, small);

  tCtx.globalAlpha = opacity;
  tCtx.fillStyle = fg;
  tCtx.textAlign = 'left';
  tCtx.textBaseline = 'top';

  const size = fitSize(tCtx, text, maxW, small - pad * 2, small * 0.08, small);
  tCtx.font = `${size}px "Arial Narrow", sans-serif`;

  const lines = wrapText(tCtx, text, maxW);
  const lineH = size * 1.15;
  let y = (small - lines.length * lineH) / 2;
  for (const line of lines) { tCtx.fillText(line, pad, y); y += lineH; }
  tCtx.globalAlpha = 1;

  // upscale balik — nearest neighbor = pixelated
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, 0, 0, width, height);

  // blur
  ctx.filter = 'blur(1.5px)';
  const tmp2 = createCanvas(width, height);
  tmp2.getContext('2d').drawImage(canvas, 0, 0);
  ctx.drawImage(tmp2, 0, 0);
  ctx.filter = 'none';

  return canvas;
}
