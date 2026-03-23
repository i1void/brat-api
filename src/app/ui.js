<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>Brat API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Unbounded:wght@700;900&display=swap" rel="stylesheet" />
  <style>
    @font-face {
      font-family: 'Arial Narrow';
      src: url('/public/fonts/arial-narrow.woff') format('woff'),
           url('/public/fonts/arialnarrow.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --brat: #8ace00;
      --black: #0a0a0a;
      --white: #f5f5f0;
      --yellow: #ffe600;
      --border: 3px solid #0a0a0a;
      --shadow: 4px 4px 0 #0a0a0a;
      --shadow-lg: 8px 8px 0 #0a0a0a;
    }

    html, body {
      overflow-x: hidden;
      width: 100%;
    }

    body {
      font-family: 'Space Mono', monospace;
      background: var(--white);
      color: var(--black);
      min-height: 100vh;
      background-image:
        linear-gradient(rgba(10,10,10,.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(10,10,10,.06) 1px, transparent 1px);
      background-size: 32px 32px;
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-thumb { background: var(--black); }

    .page {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem 4rem;
    }

    /* ── HEADER ── */
    header {
      background: var(--brat);
      border-bottom: var(--border);
      padding: .85rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .75rem;
      position: sticky;
      top: 0;
      z-index: 200;
      width: 100%;
    }

    .logo {
      font-family: 'Unbounded', sans-serif;
      font-weight: 900;
      font-size: clamp(1.4rem, 6vw, 2.6rem);
      letter-spacing: -2px;
      color: var(--black);
      text-decoration: none;
      flex-shrink: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: .5rem;
      flex-wrap: nowrap;
    }

    .tag {
      font-size: .6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      border: 2px solid #0a0a0a;
      padding: .25rem .5rem;
      background: var(--black);
      color: var(--brat);
      white-space: nowrap;
    }

    @media (max-width: 480px) {
      .tag-secondary { display: none; }
    }

    /* ── BURGER ── */
    .burger-btn {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 34px;
      height: 24px;
      cursor: pointer;
      background: none;
      border: 2px solid var(--black);
      padding: 4px 5px;
      box-shadow: 3px 3px 0 var(--black);
      transition: transform .08s, box-shadow .08s;
      flex-shrink: 0;
    }
    .burger-btn:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--black); }
    .burger-btn span {
      display: block;
      height: 2px;
      background: var(--black);
      transition: transform .25s, opacity .2s;
      transform-origin: center;
    }
    .burger-btn.open span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
    .burger-btn.open span:nth-child(2) { opacity: 0; }
    .burger-btn.open span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

    /* ── DRAWER ── */
    .drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10,10,10,.6);
      z-index: 300;
      opacity: 0;
      pointer-events: none;
      transition: opacity .28s;
    }
    .drawer-overlay.open { opacity: 1; pointer-events: all; }

    .drawer {
      position: fixed;
      top: 0;
      right: -100%;
      width: min(300px, 88vw);
      height: 100dvh;
      background: var(--black);
      border-left: 3px solid var(--brat);
      z-index: 310;
      display: flex;
      flex-direction: column;
      transition: right .3s cubic-bezier(.4,0,.2,1);
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    .drawer.open { right: 0; }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 2px solid var(--brat);
      flex-shrink: 0;
    }
    .drawer-title {
      font-family: 'Unbounded', sans-serif;
      font-size: .95rem;
      font-weight: 900;
      color: var(--brat);
      letter-spacing: -1px;
    }
    .drawer-close {
      width: 30px; height: 30px;
      background: var(--brat);
      border: 2px solid var(--brat);
      color: var(--black);
      font-weight: 900;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Mono', monospace;
      flex-shrink: 0;
    }
    .drawer-close:hover { background: var(--yellow); }

    .drawer-section {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(138,206,0,.18);
    }
    .drawer-section-title {
      font-size: .58rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--brat);
      margin-bottom: .7rem;
    }
    .drawer-link {
      display: flex;
      align-items: center;
      gap: .55rem;
      font-family: 'Space Mono', monospace;
      font-size: .78rem;
      font-weight: 700;
      color: var(--white);
      text-decoration: none;
      letter-spacing: .5px;
      padding: .5rem 0;
      border-bottom: 1px dashed rgba(138,206,0,.12);
      transition: color .12s;
    }
    .drawer-link:last-child { border-bottom: none; }
    .drawer-link:hover { color: var(--brat); }
    .drawer-link-icon { font-size: .8rem; width: 16px; text-align: center; flex-shrink: 0; }

    .drawer-api-label {
      font-size: .6rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(245,245,240,.35);
      margin-bottom: .35rem;
    }
    .drawer-api-url {
      font-size: .65rem;
      color: var(--yellow);
      word-break: break-all;
      line-height: 1.6;
      font-family: 'Space Mono', monospace;
      background: rgba(255,255,255,.04);
      padding: .5rem .6rem;
      border: 1px solid rgba(138,206,0,.18);
    }
    .drawer-badge {
      font-size: .55rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      background: var(--brat);
      color: var(--black);
      padding: .18rem .45rem;
      display: inline-block;
    }

    .header-spacer { height: 1.5rem; }

    /* ── MAIN GRID ── */
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: var(--border);
      box-shadow: var(--shadow-lg);
      width: 100%;
    }
    @media (max-width: 820px) {
      .main-grid {
        grid-template-columns: 1fr;
        box-shadow: var(--shadow);
      }
    }

    .panel-preview {
      border-right: var(--border);
      background: var(--black);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      gap: .6rem;
      min-height: 360px;
    }
    @media (max-width: 820px) {
      .panel-preview {
        border-right: none;
        border-bottom: var(--border);
        min-height: 260px;
        padding: 1.25rem;
      }
    }
    .preview-label {
      font-size: .6rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--brat);
      border: 1px solid var(--brat);
      padding: .15rem .45rem;
      align-self: flex-start;
    }
    #preview-canvas {
      width: 100%;
      max-width: 320px;
      aspect-ratio: 1;
      border: 3px solid var(--brat);
      display: block;
      image-rendering: pixelated;
    }

    .panel-controls {
      background: var(--white);
      display: flex;
      flex-direction: column;
    }
    .section {
      padding: 1rem 1.25rem;
      border-bottom: var(--border);
    }
    .section:last-child { border-bottom: none; }
    .section-title {
      font-size: .6rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: .8rem;
      opacity: .45;
    }
    textarea {
      width: 100%;
      font-family: 'Unbounded', sans-serif;
      font-size: .9rem;
      font-weight: 700;
      border: var(--border);
      padding: .65rem .85rem;
      background: var(--white);
      color: var(--black);
      resize: vertical;
      min-height: 68px;
      outline: none;
    }
    textarea:focus { box-shadow: var(--shadow); }

    .btn-random {
      margin-top: .5rem;
      font-family: 'Space Mono', monospace;
      font-size: .62rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      border: var(--border);
      padding: .35rem .75rem;
      background: var(--yellow);
      color: var(--black);
      cursor: pointer;
      box-shadow: 3px 3px 0 var(--black);
      transition: transform .08s, box-shadow .08s;
    }
    .btn-random:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--black); }

    select {
      width: 100%;
      font-family: 'Space Mono', monospace;
      font-size: .8rem;
      font-weight: 700;
      border: var(--border);
      padding: .6rem .85rem;
      background: var(--white);
      color: var(--black);
      outline: none;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%230a0a0a'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right .85rem center;
    }

    .color-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: .65rem;
    }
    .color-field { display: flex; flex-direction: column; gap: .35rem; }
    .color-field label {
      font-size: .6rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    input[type="color"] {
      width: 100%;
      height: 40px;
      border: var(--border);
      padding: 2px;
      background: var(--white);
      cursor: pointer;
    }
    input[type="color"]:disabled { opacity: .3; cursor: not-allowed; }

    .opacity-row { display: flex; align-items: center; gap: .85rem; }
    input[type="range"] { flex: 1; accent-color: var(--black); cursor: pointer; min-width: 0; }
    #opacity-value { font-size: .8rem; font-weight: 700; min-width: 2.5rem; text-align: right; flex-shrink: 0; }

    .btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: .65rem;
    }
    .btn {
      font-family: 'Space Mono', monospace;
      font-size: .72rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border: var(--border);
      padding: .72rem .8rem;
      cursor: pointer;
      box-shadow: var(--shadow);
      transition: transform .08s, box-shadow .08s;
      outline: none;
      white-space: nowrap;
      text-align: center;
    }
    .btn:hover { transform: translate(-2px,-2px); box-shadow: var(--shadow-lg); }
    .btn:active { transform: translate(2px,2px); box-shadow: 2px 2px 0 var(--black); }
    .btn:disabled { opacity: .5; cursor: wait; }
    .btn-primary { background: var(--brat); color: var(--black); }
    .btn-secondary { background: var(--white); color: var(--black); }

    /* ── API SECTION ── */
    .api-section {
      background: var(--black);
      color: var(--brat);
      margin-top: 1.5rem;
      border: var(--border);
      box-shadow: var(--shadow-lg);
      width: 100%;
      overflow: hidden;
    }
    @media (max-width: 820px) {
      .api-section { box-shadow: var(--shadow); }
    }
    .api-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .85rem 1.1rem;
      border-bottom: 2px solid var(--brat);
      flex-wrap: wrap;
      gap: .5rem;
    }
    .api-title {
      font-family: 'Unbounded', sans-serif;
      font-size: .9rem;
      font-weight: 900;
      color: var(--brat);
    }
    .api-badge {
      font-size: .56rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      border: 1px solid var(--brat);
      padding: .18rem .45rem;
    }
    .api-url-wrap {
      display: flex;
      align-items: stretch;
      border-bottom: 1px solid rgba(138,206,0,.22);
      overflow: hidden;
    }
    #api-url {
      flex: 1;
      font-family: 'Space Mono', monospace;
      font-size: .65rem;
      padding: .8rem 1rem;
      word-break: break-all;
      color: var(--yellow);
      line-height: 1.55;
      min-width: 0;
    }
    #btn-copy-api {
      font-family: 'Space Mono', monospace;
      font-size: .6rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      background: var(--brat);
      color: var(--black);
      border: none;
      border-left: 2px solid var(--brat);
      padding: 0 .85rem;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
    }
    #btn-copy-api:hover { background: var(--yellow); }

    .api-docs {
      padding: .8rem 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: .4rem;
    }
    @media (max-width: 480px) {
      .api-docs { grid-template-columns: 1fr 1fr; }
    }
    .api-param { font-size: .63rem; line-height: 1.6; }
    .api-param code {
      color: var(--yellow);
      background: rgba(255,255,255,.07);
      padding: .07rem .25rem;
    }
    .api-param span { color: rgba(245,245,240,.42); }

    footer {
      margin-top: 2.5rem;
      padding: 1rem 0;
      border-top: var(--border);
      font-size: .62rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: .5rem;
      opacity: .55;
    }
    footer a { color: var(--black); font-weight: 700; }

    @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
    .scanline {
      pointer-events: none;
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: rgba(138,206,0,.13);
      animation: scanline 4s linear infinite;
      z-index: 9999;
    }
  </style>
</head>
<body>
  <div class="scanline"></div>
  <div class="drawer-overlay" id="drawer-overlay"></div>

  <nav class="drawer" id="drawer" aria-label="Navigation menu">
    <div class="drawer-header">
      <span class="drawer-title">bratify</span>
      <button class="drawer-close" id="drawer-close" aria-label="Close menu">✕</button>
    </div>
    <div class="drawer-section">
      <p class="drawer-section-title">navigate</p>
      <a class="drawer-link" href="https://brat.herta.web.id"><span class="drawer-link-icon">⌂</span> home</a>
      <a class="drawer-link" href="#api-section-anchor"><span class="drawer-link-icon">⚡</span> rest api</a>
      <a class="drawer-link" href="https://github.com/" target="_blank" rel="noopener"><span class="drawer-link-icon">◈</span> source code</a>
    </div>
    <div class="drawer-section">
      <p class="drawer-section-title">api endpoint</p>
      <p class="drawer-api-label">base url</p>
      <div class="drawer-api-url">https://brat.herta.web.id</div>
    </div>
    <div class="drawer-section">
      <p class="drawer-section-title">quick links</p>
      <a class="drawer-link" href="https://brat.herta.web.id/?text=brat&preset=brat" target="_blank" rel="noopener"><span class="drawer-link-icon">↗</span> brat preset</a>
      <a class="drawer-link" href="https://brat.herta.web.id/?text=crash&preset=crash" target="_blank" rel="noopener"><span class="drawer-link-icon">↗</span> crash preset</a>
      <a class="drawer-link" href="https://brat.herta.web.id/api/presets" target="_blank" rel="noopener"><span class="drawer-link-icon">↗</span> list presets</a>
      <a class="drawer-link" href="https://brat.herta.web.id/api/health" target="_blank" rel="noopener"><span class="drawer-link-icon">♥</span> health check</a>
    </div>
    <div class="drawer-section">
      <p class="drawer-section-title">status</p>
      <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
        <span class="drawer-badge">open api</span>
        <span class="drawer-badge" style="background:var(--yellow);">no auth</span>
      </div>
    </div>
  </nav>

  <header>
    <a class="logo" href="https://brat.herta.web.id">Brat API</a>
    <div class="header-right">
      <span class="tag">brat gen</span>
      <span class="tag tag-secondary" style="background:var(--white);color:var(--black);">charli xcx</span>
      <button class="burger-btn" id="burger-btn" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="page">
    <div class="header-spacer"></div>
    <div class="main-grid">
      <div class="panel-preview">
        <span class="preview-label">preview</span>
        <canvas id="preview-canvas" width="800" height="800"></canvas>
      </div>
      <div class="panel-controls">
        <div class="section">
          <p class="section-title">your text</p>
          <textarea id="text-input" placeholder="type something brat..." spellcheck="false"></textarea>
          <button class="btn-random" id="btn-random">&#9685; random track</button>
        </div>
        <div class="section">
          <p class="section-title">color preset</p>
          <select id="preset-select"></select>
        </div>
        <div class="section">
          <p class="section-title">custom colors</p>
          <div class="color-row">
            <div class="color-field">
              <label for="bg-color">background</label>
              <input type="color" id="bg-color" value="#8ace00" disabled />
            </div>
            <div class="color-field">
              <label for="fg-color">text color</label>
              <input type="color" id="fg-color" value="#000000" disabled />
            </div>
          </div>
        </div>
        <div class="section">
          <p class="section-title">text opacity</p>
          <div class="opacity-row">
            <input type="range" id="opacity-range" min="0" max="1" step="0.01" value="1" />
            <span id="opacity-value">1.00</span>
          </div>
        </div>
        <div class="section">
          <p class="section-title">export</p>
          <div class="btn-row">
            <button class="btn btn-primary" id="btn-download">download</button>
            <button class="btn btn-secondary" id="btn-copy">copy image</button>
          </div>
        </div>
      </div>
    </div>

    <div class="api-section" id="api-section-anchor">
      <div class="api-header">
        <span class="api-title">REST API</span>
        <span class="api-badge">open · no auth</span>
      </div>
      <div class="api-url-wrap">
        <code id="api-url">loading...</code>
        <button id="btn-copy-api">copy</button>
      </div>
      <div class="api-docs">
        <div class="api-param"><code>text</code><br/><span>required. brat text</span></div>
        <div class="api-param"><code>preset</code><br/><span>brat · crash · sucker</span></div>
        <div class="api-param"><code>bg</code><br/><span>hex e.g. ff0000</span></div>
        <div class="api-param"><code>fg</code><br/><span>hex e.g. ffffff</span></div>
        <div class="api-param"><code>opacity</code><br/><span>0.0 – 1.0</span></div>
        <div class="api-param"><code>width / height</code><br/><span>200–2000, default 800</span></div>
      </div>
    </div>

    <footer>
      <span>bratify — brat generator</span>
      <span><a href="https://github.com/" target="_blank">source</a> · made with ♥</span>
    </footer>
  </div>

  <script type="module" src="/src/app/main.js"></script>
  <script>
    const burgerBtn = document.getElementById('burger-btn');
    const drawer    = document.getElementById('drawer');
    const overlay   = document.getElementById('drawer-overlay');
    const closeBtn  = document.getElementById('drawer-close');

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      burgerBtn.classList.add('open');
      burgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      burgerBtn.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    burgerBtn.addEventListener('click', () =>
      drawer.classList.contains('open') ? closeDrawer() : openDrawer()
    );
    overlay.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
    drawer.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeDrawer));
  </script>
</body>
</html>
