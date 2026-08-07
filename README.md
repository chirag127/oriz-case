# oriz-case

**Live: https://case.oriz.in**

Case & format converter for devs and writers. One box in, every case out —
camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, COBOL-CASE,
dot.case, path/case, Title Case, Sentence case, plus code-identifier
reformatting. 100% client-side — **no upload, no signup, no tracking**.

## What it does

- 16 case transforms, live as you type, copy any with one click.
- Per-line or whole-block conversion for lists of identifiers.
- Drag-drop or pick a text file (`.txt/.md/.csv/.json/.js/.ts/.py`).
- Slug + social-handle generators (diacritics stripped).
- Optional AI: suggest a variable/function name from a description, or turn
  prose into a clean URL slug. Powered by [`@chirag127/oz-ai`](https://github.com/chirag127/design-system)
  (g4f multi-provider failover, no key). AI is polish only — the converter works
  fully offline if every provider is down.

## Privacy

Everything runs in your browser. Text never leaves the page — no server, no API
key, no analytics. The only network call is the optional AI feature, which you
trigger explicitly.

## Design

Type-specimen identity: stark editorial B&W + one signal red, Swiss grid,
Archivo display / Space Grotesk body. Rotating giant case-transform hero letters.

## Stack

Astro (static) · React 19 islands · Tailwind v4 · zero-dep transform core ·
shared `@chirag127/oz-*` packages for chrome, tokens, files, AI.

## Develop

```sh
npm install --legacy-peer-deps
npm run dev      # local
npm test         # vitest — pure transform logic
npm run build    # static dist/
npm run deploy   # Cloudflare Pages
```

## License

MIT © 2026 Chirag Singhal
