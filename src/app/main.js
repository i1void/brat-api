import { init } from './ui.js';

window.addEventListener('load', () => {
  try {
    init();
  } catch(e) {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:0;left:0;right:0;background:red;color:#fff;padding:1rem;font-size:12px;z-index:9999;word-break:break-all;';
    d.textContent = 'ERROR: ' + e;
    document.body.appendChild(d);
  }
});
