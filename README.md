# bratify

> brat-style image generator — web UI + REST API.

built with vanilla JS, rendered on canvas, deployed on vercel.

---

## usage

open the web UI, type your text, pick a color preset or use custom colors, download or copy the image.

---

## REST API

**base url:** `https://api.ivoid.cfd`

```
GET /?text=your+text
```

### parameters

| param | required | description |
|---|---|---|
| `text` | ✓ | text to render |
| `preset` | — | color preset name (see presets below) |
| `bg` | — | background hex color, without `#` |
| `fg` | — | text hex color, without `#` |
| `opacity` | — | text opacity `0.0–1.0`, default `1` |
| `width` | — | output width in px, `200–2000`, default `800` |
| `height` | — | output height in px, `200–2000`, default `800` |

> `bg` / `fg` takes priority over `preset`. if neither is set, defaults to brat green.

### examples

```
# brat preset
https://api.ivoid.cfd/?text=360&preset=brat

# custom colors
https://api.ivoid.cfd/?text=crash&bg=019bd9&fg=f70000

# custom size + opacity
https://api.ivoid.cfd/?text=apple&preset=sucker&width=1200&height=1200&opacity=0.8
```

### presets

| key | name |
|---|---|
| `brat` | brat |
| `bratdeluxe` | brat deluxe |
| `crash` | crash |
| `howimfeelingnow` | how i'm feeling now |
| `charli` | charli |
| `pop2` | pop 2 |
| `vroomvroom` | vroom vroom |
| `number1angel` | number 1 angel |
| `sucker` | sucker |
| `trueromance` | true romance |

list all presets: `GET /api/presets`

health check: `GET /api/health`

---

## running locally

```bash
npm install
npx vite        # or any static file server
```

---

## tech

- frontend — vanilla JS, canvas API
- rendering — `bratRenderer.js` (fits text, applies blur)
- server-side — `@napi-rs/canvas` via vercel serverless function
- fonts — Arial Narrow (local), Space Mono + Unbounded (google fonts)

---

## license

MIT
