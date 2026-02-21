# GitHub Copilot Instructions

These instructions are used by Copilot and agents when assisting with development in this repository.

always update copilot instructions when making changes to the project structure, coding guidelines, or workflow. This ensures that Copilot can provide accurate and relevant suggestions based on the latest project context.

always also add documentation to readme.md when making changes to the project structure, coding guidelines, or workflow. This ensures that all contributors have a clear understanding of how the project is organized and how to work with it effectively.

## Project Overview

This is a small Node.js project that interacts with Hygraph GraphQL API. It contains scripts for asset management, client operations, mutations, and queries. Dependencies are managed via npm.

## Coding Guidelines

- Follow standard JavaScript/Node.js practices.
- Keep code small and modular; scripts live in the `scripts/` folder.
- Use `npm run lint` to check style and `npm test` (if available) for tests.

## Dependency Management

- Use `npm-check` or `npm outdated` to identify outdated packages.
- Regular dependency updates are encouraged; Dependabot may be configured separately.

## Workflow Notes

- There is no CI configuration in the repo. When adding features, ensure they run locally.
- Branching follows GitHub Flow: create feature branches off `main`.

## Copilot Usage

- When generating code, prefer small, readable functions.
- Avoid adding unnecessary dependencies.
- If unsure about API usage, consult Hygraph documentation.

Feel free to ask questions directly in comments or open issues.
