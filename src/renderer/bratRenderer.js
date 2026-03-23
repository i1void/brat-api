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
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const pad = width * 0.06;
  const maxW = width - pad * 2;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = opacity;
  ctx.fillStyle = fg;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const size = fitSize(ctx, text, maxW, height - pad * 2, width * 0.08, width);
  ctx.font = `${size}px "Arial Narrow", sans-serif`;

  const lines = wrapText(ctx, text, maxW);
  const lineH = size * 1.15;
  let y = (height - lines.length * lineH) / 2;
  for (const line of lines) { ctx.fillText(line, pad, y); y += lineH; }
  ctx.globalAlpha = 1;

  return canvas;
}
