// Registers Arial Narrow for server-side rendering.
// Serverless machines have no system fonts, so without this the image would come out blank.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GlobalFonts } from '@napi-rs/canvas';

const FAMILY = 'Arial Narrow';
let ready = false;

export function ensureFont() {
  if (ready) return true;

  const candidates = [
    // `new URL(..., import.meta.url)` is detected by Vercel's file tracing, so the font ships with the function
    fileURLToPath(new URL('../../public/fonts/arialnarrow.ttf', import.meta.url)),
    join(process.cwd(), 'public/fonts/arialnarrow.ttf'),
  ];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      GlobalFonts.registerFromPath(path, FAMILY);
      ready = typeof GlobalFonts.has === 'function' ? GlobalFonts.has(FAMILY) : true;
      if (ready) return true;
    } catch { /* try the next path */ }
  }
  return false;
}
