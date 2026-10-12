# bratify

Brat-style image generator: a web UI and a free REST API.
Vanilla JS, drawn on canvas, deployed on Vercel.

## Using it

Open the site, type your text, pick a preset (or custom colors), then download or copy the image.
The page shows the exact API URL for your current settings, using whatever domain it is served from.

## REST API

The base URL is **your own deployment**, for example `https://your-project.vercel.app`.

```
GET /api?text=your+text
```

`GET /?text=your+text` works as a shortcut for the same thing.

| param     | required | description                                             |
| --------- | -------- | ------------------------------------------------------- |
| `text`    | yes      | text to render (max 500 characters)                     |
| `preset`  | no       | color preset, see `GET /api/presets`                    |
| `bg`      | no       | background hex color without `#`, e.g. `8ace00`         |
| `fg`      | no       | text hex color without `#`                              |
| `opacity` | no       | text opacity `0` to `1`, default `1`                    |
| `width`   | no       | output width in px, `200` to `2000`, default `800`      |
| `height`  | no       | output height in px, `200` to `2000`, default `800`     |

`bg` / `fg` win over `preset`. With nothing set you get the classic brat green.

Other endpoints:

- `GET /api/presets` list of color presets
- `GET /api/health` health check

Errors come back as JSON with status `400` (bad input) or `500` (render failed).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy

Push to GitHub and import the repo in Vercel. No build command and no settings are needed.
`vercel.json` already bundles the font into the serverless function.

## How it works

- `src/renderer/bratRenderer.js` fits the text, pixelates and blurs it. The same code runs in the browser and on the server.
- `api/*.js` are the serverless functions (`@napi-rs/canvas`).
- `src/app/*.js` is the web UI.
- `public/fonts/` holds Arial Narrow. Serverless machines have no fonts of their own, so the API registers it at startup.

## License

MIT
