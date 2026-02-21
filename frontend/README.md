# Frontend UI

This directory contains a Vite‑powered React application that uses
Tailwind CSS v4 through the `@tailwindcss/vite` plugin. Styling starts from
`src/index.css` using `@import 'tailwindcss'`, and no `tailwind.config.js`
or `postcss.config.js` file is required. It provides two UIs via the
Express API:

- **Lookup Translation** – choose a key and locale to fetch existing
  translations from Hygraph, making it easy to verify values.
- **Push Translations** – submit new English/Finnish pairs, creating and
  publishing them in Hygraph.

## Commands

> Markdown is validated by the root project; use `npm run lint:md` from the
> workspace root if you edit `.md` files.

- `npm install` – install frontend dependencies
- `npm run dev` – start development server (proxying `/api` to port 3000; also invoked by `npm run dev` at repo root)
- `npm run build` – build production assets
- `npm run serve` – preview the built site
