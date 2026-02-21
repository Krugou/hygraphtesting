# Devtools TypeScript Scripts

This folder contains TypeScript versions of the Node.js helper scripts used in
`scripts/`. The copies are annotated with `// @ts-nocheck` to keep things
simple, but you can turn on type checking as needed.

## Setup

To compile or run these files, install the following packages in the root
workspace (you can use a separate `npm install` within `devtools` if you prefer,
but the versions shown here reflect the existing project):

```bash
npm install graphql-request graphql dotenv @hygraph/management-sdk
npm install --save-dev typescript ts-node @types/node
```

- `graphql-request` & `graphql` – lightweight GraphQL client
- `dotenv` – load `.env` values like the original scripts
- `@hygraph/management-sdk` – schema management helper
- `typescript`, `ts-node` – run `.ts` files directly
- `@types/node` – Node type definitions for TypeScript

> **Note:** the scripts use ES module imports; ensure your `tsconfig.json` has
> `"module": "ESNext"` and `"target": "ES2022"` or similar.

## Usage

To execute a script, run with `ts-node` from the workspace root, for example:

```bash
npx ts-node devtools/pushLocales.ts
```

All scripts mimic their counterparts in the `scripts/` directory and can be
modified independently for development or experimentation.
