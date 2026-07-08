# Calliope Campus integration

This fork of [`@umoteam/editor`](https://github.com/umodoc/editor) carries the
Calliope translations **and** the campus deployment app, so the campus "Text
Editor" ships from a single repo with no separate wrapper package.

## What was changed vs. upstream

- **`src/app.vue`** — the upstream demo entry was replaced with the campus
  wrapper. It mounts `<umo-editor>` (registered by `src/main.js` from this repo's
  own source) and speaks the campus `postMessage` protocol. The original demo is
  recoverable from git history.
- **`package.json`** — added `dev:campus` and `build:campus` scripts.
- **`index.html`** — neutral lang/title for the campus deployment.

Everything else (the editor source, `locales/`, build tooling) is upstream +
the translation commits.

## Local dev

Use **npm** (hoisted `node_modules`). This fork is an npm project and its source
imports a transitive `dayjs` (`dayjs/locale/de`); pnpm's strict layout doesn't
expose it to the site build, so `pnpm build` fails to resolve it.

```bash
npm install
npm run dev:campus   # http://127.0.0.1:4174  (strictPort)
```

In the `calliope-dev` monorepo this is the `umo` component
(`calliope-dev run umo`, or part of `run all`), and campus points at it via
`PUBLIC_UMO_BASE_URL=http://127.0.0.1:4174`.

## Deploy (Cloudflare Pages)

```bash
npm run build:campus   # → dist/ (base '/')
```

- **Build command:** `npm run build:campus`
- **Build output directory:** `dist`
- **Package manager:** npm (Cloudflare's default here — no lockfile is committed)

`build:campus` is the upstream `--mode site` build (base `/`), so `index.html`
lands at the site root. Set the resulting URL as the `umo` entry in the campus
`src/lib/stores/editorUrls.ts` (or per-environment `PUBLIC_UMO_BASE_URL`).

## Campus ⇄ iframe protocol

Scoped by an `?instance=` query param the campus appends to the iframe `src`;
the campus validates the frame origin (derived from the configured URL).

| direction | source | messages |
| --- | --- | --- |
| campus → iframe | `calliope-campus` | `umo:init` · `umo:update-content` · `umo:update-props` |
| iframe → campus | `calliope-campus-umo` | `umo:ready` · `umo:changed` · `umo:saved` |

`content` is `{ html, json, text, version }`. See `src/app.vue`.
