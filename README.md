# Hygraph Node.js Testing Sandbox

A comprehensive testing environment to explore and demonstrate [Hygraph](https://hygraph.com/) (formerly GraphCMS) capabilities using Node.js. Each script interacts with the Hygraph GraphQL API to showcase queries, mutations, asset management, and programmatic schema changes.

## Prerequisites

- **Node.js** v18+
- **npm** v9+
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

2. **Install all dependencies**

   ```bash
   npm run install:all
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

The project is organized using npm workspaces. All commands below should be run from the **root** directory.

| `npm run dev`          | Launch both Express API and Vite frontend (auto-opens browser)            |
| `npm run dev:host`     | Launch both with network exposure (--host)                                |
| `npm run preview`      | Preview the production build of the frontend                              |
| `npm run export:json`  | Export all translations from Hygraph to a nested JSON file                |
| `npm run start`        | Start the Express API server                                              |
| `npm run build:all`    | Type-check and build all workspace packages                               |
| `npm run clean`        | Deep clean the repository (removes node_modules and build artifacts)       |
| `npm run test:all`     | Run all Hygraph utility tests (queries, mutations, assets, etc.)          |
| `npm run lint:all`     | Run ESLint and Markdownlint across all packages                           |

### Individual Test Scripts

You can run specific server-side tests from the root:
- `npm run test:queries`
- `npm run test:mutations`
- `npm run test:push-locales`
- `npm run test:user-models`
- `npm run test:assets`
- `npm run test:management`

## Project Structure

```text
hygraphtesting/
├── server/              # Express API server & Hygraph Utilities
│   ├── index.ts         # TypeScript entry point
│   ├── scripts/         # Hygraph utility logic (queries, mutations, etc.)
│   └── package.json
├── frontend/            # Vite + React + Tailwind UI
│   ├── src/             # Frontend source code
│   └── package.json
├── tests/               # Jest tests for core logic
├── .env.example         # Environment variable template
├── package.json         # Workspace root (orchestrator)
└── README.md
```

## Web Interface

The project uses a unified workspace structure:

- **server/** – Express API and Hygraph logic. Exposes `/api/translations` and wraps utility helpers.
- **frontend/** – Vite-powered React + Tailwind CSS v4 project.
- **Unified Workflow** – Running `npm run dev` from the root handles both components, making local development seamless.

### Running the application

1. Install all dependencies and start the dev environment:

   ```bash
   npm run install:all
   npm run dev
   ```

2. Open the browser to `http://localhost:5173` to access the modern UI.

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

All scripts, server, and frontend components are now TypeScript. Run tests with `npm run test:all` and scripts with workspace commands (e.g., `npm run test:queries`).

## Test Automation

Jest tests are located in the `tests/` folder and cover:
- Translation management
- Asset operations
- Environment validation
- Schema introspection

## CI/CD & Linting

Linting and formatting are automated with `eslint`, `prettier`, and `markdownlint`. Run `npm run lint:all` to check the entire workspace.

## Dependencies

| Package                                                                            | Purpose                          |
| ---------------------------------------------------------------------------------- | -------------------------------- |
| [`graphql-request`](https://www.npmjs.com/package/graphql-request)                 | Lightweight GraphQL client       |
| [`graphql`](https://www.npmjs.com/package/graphql)                                 | GraphQL reference implementation |
| [`dotenv`](https://www.npmjs.com/package/dotenv)                                   | Load `.env` variables            |
| [`@hygraph/management-sdk`](https://www.npmjs.com/package/@hygraph/management-sdk) | Programmatic schema management   |

## License

This project is for testing and educational purposes.
