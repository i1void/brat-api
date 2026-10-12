import { albumColors } from '../src/lib/colors.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).json(Object.entries(albumColors).map(([key, val]) => ({ key, ...val })));
}
