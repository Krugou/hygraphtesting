# Hygraph Node.js Testing Sandbox

A comprehensive testing environment to explore and demonstrate [Hygraph](https://hygraph.com/) (formerly GraphCMS) capabilities using Node.js. Each script interacts with the Hygraph GraphQL API to showcase queries, mutations, asset management, and programmatic schema changes.

## Prerequisites

- **Node.js** v16+
- **A Hygraph** project with a configured `Translation` model (fields: `translationId`, `description`, `translation`, `localized`).
  > **Note:** if the root query field for your model does not exist you may have
  > renamed or removed it; the query script prints all available root fields and
  > will attempt a sensible fallback.
- A **Permanent Auth Token** with full rights (Read, Write, Publish).
- _(Optional)_ A **Management API Token** for schema operations. This must be
  a separate token (set in `HYGRAPH_MANAGEMENT_TOKEN`) with `MODEL_UPDATE`
  permission, otherwise the management test will fail with a "missing
  permission for action" error.

## Setup

(Note: the `.log` folder is created automatically when any script runs.)

1. **Clone the repository**

   ```bash
   git clone https://github.com/Krugou/hygraphtesting.git
   cd hygraphtesting
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and fill in your Hygraph credentials:

   ```bash
   cp .env.example .env
   ```

   | Variable                   | Description                        |
   | -------------------------- | ---------------------------------- |
   | `HYGRAPH_URL`              | Content API endpoint               |
   | `HYGRAPH_TOKEN`            | Permanent Auth Token (full rights) |
   | `HYGRAPH_MANAGEMENT_URL`   | Management API endpoint            |
   | `HYGRAPH_MANAGEMENT_TOKEN` | Management API token               |

> **Note:** unlike `HYGRAPH_URL`, the management URL must point at the **content API endpoint for a specific environment** (e.g. `https://api-region.hygraph.com/v2/PROJECT_ID/master`). The generic `https://management.hygraph.com/graphql` host will trigger the "Could not find environment" error shown in the tests.

## Available Scripts

All of the sample scripts now persist their console output into individual log
files under a `.log/` directory (`queries.log`, `mutations.log`,
`assets.log`, `management.log`). This makes it easier to review results after
running `npm run test:all` or troubleshooting CI jobs.

| Command                     | Script                   | Description                                                  |
| --------------------------- | ------------------------ | ------------------------------------------------------------ |
| `npm run test:queries`      | `scripts/queries.js`     | Fetch translations with ordering & pagination                |
| `npm run test:user-models`  | `scripts/userModels.js`  | List custom schema models and sample entries                 |
| `npm run test:mutations`    | `scripts/mutations.js`   | Create and publish a translation entry in one request        |
| `npm run test:push-locales` | `scripts/pushLocales.js` | Create both fi and en translations for a key                 |
| `npm run test:assets`       | `scripts/assets.js`      | Upload a remote image via the GraphQL `createAsset` mutation |
| `npm run test:management`   | `scripts/management.js`  | Create a model & field via the Management SDK                |

## Project Structure

```text
hygraphtesting/
├── server/              # Express API server for pushing translations
│   └── index.ts         # TypeScript backend
├── scripts/             # TypeScript Hygraph utilities
│   ├── client.ts        # Shared GraphQL client (reads .env)
│   ├── queries.ts       # Query tests
│   ├── mutations.ts     # Mutation tests
│   ├── assets.ts        # Asset upload tests
│   ├── management.ts    # Management SDK tests
│   └── pushLocales.ts   # Locale push helper
├── frontend/            # Vite + React + Tailwind UI for translation form
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.tsx
│       ├── components/
│       │   ├── TranslationLookup.tsx
│       │   ├── TranslationKeysPanel.tsx
│       │   └── TranslationPushForm.tsx
│       └── index.css
├── tests/               # Jest tests for translation and asset ops
├── .env.example         # Environment variable template
├── .gitignore
├── package.json         # root repo (includes server dependencies)
└── README.md
```

## Web Interface

The project now uses a fully TypeScript-based frontend and backend:

- **server/** – Express API in TypeScript exposes `/api/translations` and wraps the `pushLocales` helper.
- **frontend/** – Vite‑powered React + Tailwind CSS v4 project. All components are TypeScript (TSX). Tailwind uses the `@tailwindcss/vite` plugin and a simple `@import 'tailwindcss'` entry in `src/index.css` (no `tailwind.config.js` or `postcss.config.js`).
- **Locale Switching** – The UI allows users to select a locale for translation lookup and editing. All translation forms and lookup panels are locale-aware.
- **Error Handling** – Robust error handling and logging are implemented throughout the frontend and backend.
- **Test Automation** – Jest tests cover translation management, asset operations, environment validation, and schema introspection.

### Running the application

1. Install root dependencies and start both server and frontend in one go:

   ```bash
   npm install
   npm run dev             # launches Express on 3000 and Vite on 5173
   ```

(you can still run `npm run start:server` or `cd frontend && npm run dev` separately if you prefer)

2. Open a second terminal, change into `frontend/` and bring up the UI:

```bash
cd frontend
npm install
npm run dev             # starts Vite on http://localhost:5173
```

3. Open the browser to `http://localhost:5173` and you'll see a modern UI:

All features use the `/api/translations` endpoint; `GET` looks up data and `POST` pushes new content. Key listing uses `/api/translations/keys`.

### Additional Features

- **GraphQL Queries** — Fetching, filtering, sorting, and paginating content
- **GraphQL Mutations** — Creating, updating, and publishing entries
- **Nested & Bulk Mutations** — Modifying related entities in a single request
- **Content Stages & Workflows** — Moving entries through `DRAFT → PUBLISHED`
- **Asset Management** — Programmatic upload via the REST endpoint
- **Schema Management** — Creating models and fields with the Management SDK
- **Content Federation** — Querying remote sources through a unified endpoint
- **Localization (i18n)** — Multi-language content variants with locale switching

## TypeScript Migration

All scripts, server, and frontend components are now TypeScript. Run tests with `npm run test:all` and scripts with `npx ts-node scripts/*.ts`.

## Test Automation

Jest tests are located in the `tests/` folder and cover:

- Translation management
- Asset operations
- Environment validation
- Schema introspection

## CI/CD & Linting

Linting and formatting are automated with `eslint`, `prettier`, and `markdownlint`. Add GitHub Actions for dependency updates and linting as needed.

- **GraphQL Queries** — Fetching, filtering, sorting, and paginating content
- **GraphQL Mutations** — Creating, updating, and publishing entries
- **Nested & Bulk Mutations** — Modifying related entities in a single request
- **Content Stages & Workflows** — Moving entries through `DRAFT → PUBLISHED`
- **Asset Management** — Programmatic upload via the REST endpoint
- **Schema Management** — Creating models and fields with the Management SDK
- **Content Federation** — Querying remote sources through a unified endpoint
- **Localization (i18n)** — Multi-language content variants

## Dependencies

> **Note:** markdown files are checked with `markdownlint` using `.markdownlint.json`
> (MD031 enforces blank lines around fenced code). Run `npm run lint:md` or
> add `*.md` to `lint-staged` for pre‑commit checks.

| Package                                                                            | Purpose                          |
| ---------------------------------------------------------------------------------- | -------------------------------- |
| [`graphql-request`](https://www.npmjs.com/package/graphql-request)                 | Lightweight GraphQL client       |
| [`graphql`](https://www.npmjs.com/package/graphql)                                 | GraphQL reference implementation |
| [`dotenv`](https://www.npmjs.com/package/dotenv)                                   | Load `.env` variables            |
| [`@hygraph/management-sdk`](https://www.npmjs.com/package/@hygraph/management-sdk) | Programmatic schema management   |

## License

This project is for testing and educational purposes.
