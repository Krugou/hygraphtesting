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
├── scripts/
│   ├── client.js        # Shared GraphQL client (reads .env)
│   ├── queries.js       # Query tests
│   ├── mutations.js     # Mutation tests
│   ├── assets.js        # Asset upload tests
│   └── management.js    # Management SDK tests
├── .env.example         # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

## Hygraph Capabilities Covered

The examples have been updated for Hygraph's current API:

- queries now perform an introspection fallback when the expected field is
  missing (the model may have been renamed or deleted).
- the sample mutation was converted from a `Post` example to a much simpler
  `Translation` record; every field is a plain string and therefore no rich‑text
  helper is required.
- a new `userModels.js` helper introspects your project and emits only the
  custom top‑level fields along with a sample of their entries (timestamps
  included); the results are saved in `.log/userModels.json`.
- added `pushLocales.js` which takes a translationId plus English/Finnish text
  and creates two locale versions of the same entry, publishing each one.
- asset uploads use a GraphQL mutation instead of the legacy REST endpoint; the mutation now expects `uploadUrl` (not `url`).
- management SDK script reads from dedicated `HYGRAPH_MANAGEMENT_*` variables and the URL should point at the **content API environment** (see .env.example)
  and gives clearer advice when permissions are insufficient.

- **GraphQL Queries** — Fetching, filtering, sorting, and paginating content
- **GraphQL Mutations** — Creating, updating, and publishing entries
- **Nested & Bulk Mutations** — Modifying related entities in a single request
- **Content Stages & Workflows** — Moving entries through `DRAFT → PUBLISHED`
- **Asset Management** — Programmatic upload via the REST endpoint
- **Schema Management** — Creating models and fields with the Management SDK
- **Content Federation** — Querying remote sources through a unified endpoint
- **Localization (i18n)** — Multi-language content variants

## Dependencies

| Package                                                                            | Purpose                          |
| ---------------------------------------------------------------------------------- | -------------------------------- |
| [`graphql-request`](https://www.npmjs.com/package/graphql-request)                 | Lightweight GraphQL client       |
| [`graphql`](https://www.npmjs.com/package/graphql)                                 | GraphQL reference implementation |
| [`dotenv`](https://www.npmjs.com/package/dotenv)                                   | Load `.env` variables            |
| [`@hygraph/management-sdk`](https://www.npmjs.com/package/@hygraph/management-sdk) | Programmatic schema management   |

## License

This project is for testing and educational purposes.
