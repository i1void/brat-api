import { renderBrat } from '../renderer/bratRenderer.js';

function createBrowserCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

export function drawToCanvas(target, text, bg, fg, opacity = 1) {
  const off = renderBrat(createBrowserCanvas, text, bg, fg, opacity);
  target.width = off.width;
  target.height = off.height;
  target.getContext('2d').drawImage(off, 0, 0);
}

export function exportPng(text, bg, fg, opacity, filename) {
  const off = renderBrat(createBrowserCanvas, text, bg, fg, opacity);
  const a = document.createElement('a');
  a.href = off.toDataURL('image/png');
  a.download = filename;
  a.click();
}

export async function copyImage(text, bg, fg, opacity) {
  const off = renderBrat(createBrowserCanvas, text, bg, fg, opacity);
  const blob = await new Promise(r => off.toBlob(r, 'image/png'));
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
