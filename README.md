# Slang Translator

A bidirectional English slang ⇄ standard English translator, styled after Google Translate.
Runs entirely client-side (static dictionary + regex matching) — no backend, no API key.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Pushing to `main` builds the app and deploys `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`. Enable it once in the repo: **Settings → Pages →
Source → GitHub Actions**.

## Extending the dictionary

Slang/standard pairs live in `src/data/slangDictionary.ts`. Each entry is used for
translation in both directions, so add new terms there.
