// scripts/userModels.js
import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-request';
import { client } from './client.js';

// log helpers (shared pattern from other scripts)
const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'userModels.log');
const log = (...args) => {
  const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(msg);
  fs.appendFileSync(logFile, `${msg}\n`);
};

// introspection query for top level fields, but only pull argument names
// since that's all we need to decide whether the field acts like a list.
const INTROSPECTION = gql`
  query Introspection {
    __schema {
      queryType {
        fields {
          name
          args {
            name
          }
        }
      }
    }
  }
`;

// quick generator for fetching a couple of entries with their timestamps
const makeFetchQuery = (field) => gql`
  query FetchEntries($first: Int!) {
    ${field}(first: $first, orderBy: createdAt_DESC) {
      id
      createdAt
    }
  }
`;

// names that are built into the Hygraph API and not user-defined models
const builtinNames = new Set([
  'node',
  'hygraphSearchEntriesConnection',
  'entities',
  'users',
  'user',
  'usersConnection',
  'assets',
  'asset',
  'assetsConnection',
  'assetVersion',
  'scheduledOperations',
  'scheduledOperation',
  'scheduledOperationsConnection',
  'scheduledReleases',
  'scheduledRelease',
  'scheduledReleasesConnection',
  // versions are not useful as models
]);

const run = async () => {
  log('Discovering user-created models...');
  try {
    const data = await client.request(INTROSPECTION);
    const fieldsInfo = data.__schema.queryType.fields;

    // filter out builtins and connections, then keep only those fields
    // whose arguments include a "first" parameter (list/collection queries).
    const custom = fieldsInfo
      .filter((f) => !builtinNames.has(f.name) && !f.name.endsWith('Connection'))
      .filter((f) => f.args.some((a) => a.name === 'first'))
      .map((f) => f.name);

    log('Custom top-level collection fields:', custom.join(', '));

    const output = { models: [] };

    for (const field of custom) {
      try {
        const q = makeFetchQuery(field);
        const resp = await client.request(q, { first: 5 });
        output.models.push({ field, entries: resp[field] });
      } catch (e) {
        log(`⚠️ could not query entries for '${field}':`, e.message);
      }
    }

    const outFile = path.join(logDir, 'userModels.json');
    fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
    log(`📝 User models and sample data written to ${outFile}`);
  } catch (error) {
    log('❌ Error inspecting schema:', error.message);
  }
};

run();
