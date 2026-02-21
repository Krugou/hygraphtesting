# GPT Prompt: `pushLocales.js` Script

Create a Node.js script named `pushLocales.js` for the Hygraph testing
sandbox. The script should:

1. Import necessary modules (`fs`, `path`, `graphql-request` client, and
   `readline` for prompts).
2. Define a logger that writes to `.log/pushLocales.log` and also prints to
   console.
3. Declare two GraphQL mutations: one to create a `Translation` entry (with
   variables for `translationId`, `description`, `translation` text and a
   `locale` argument) and one to publish an entry by ID.
4. Implement an async helper `pushLocales(translationId, description, enText,
fiText)` which runs through `['en','fi']`, creates and publishes a record
   for each locale, logging success or errors.
5. Accept `translationId`, `description`, `enText`, and `fiText` from the
   command-line arguments, but if any are missing, prompt the user interactively
   using `readline.question`.
6. Validate required inputs (`translationId`, `enText`, `fiText`) and exit
   with an error message if they remain missing.
7. Call the helper once inputs are collected.
8. Follow the project's coding style: arrow functions, Prettier rules,
   consistent logging.

The script should be standalone and match the other examples in the repo.
