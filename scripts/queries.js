// scripts/queries.js
import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-request';
import { client } from './client.js';

// simple logger that mirrors to stdout and a file under .log
const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'queries.log');
function log(...args) {
  const message = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(message);
  fs.appendFileSync(logFile, message + '\n');
}

// query for a typical Post collection; modify if your model is named differently
const GET_POSTS = gql`
  query GetPosts {
    posts(first: 5, orderBy: createdAt_DESC) {
      id
      title
      stage
      createdAt
    }
  }
`;

// if the above field doesn't exist, the introspection query will show all root fields
const INTROSPECTION = gql`
  query Introspection {
    __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }
`;

async function runQueries() {
  log('Fetching posts from Hygraph...');

  try {
    const data = await client.request(GET_POSTS);
    log('✅ Query Successful!');
    log(JSON.stringify(data, null, 2));
    return;
  } catch (error) {
    log('❌ Error fetching data:', error.message);
    if (/field 'posts' is not defined/.test(error.message)) {
      // introspect to give hints and possibly retry with a different field
      try {
        const schema = await client.request(INTROSPECTION);
        const fields = schema.__schema.queryType.fields.map((f) => f.name);
        log('Available root query fields:');
        fields.forEach((n) => log(' -', n));

        // look for a plural that starts with "post" ignoring case
        const plural = fields.find((n) => /^post/i.test(n) && n.toLowerCase() !== 'post');
        if (plural) {
          log(`
⚡ Attempting again using the '${plural}' field name...
`);
          // build a simple query string dynamically
          const dynamicQuery = gql`
            query GetPostsAlternative {
              ${plural}(first: 5, orderBy: createdAt_DESC) {
                id
                title
                stage
                createdAt
              }
            }
          `;
          const retry = await client.request(dynamicQuery);
          log('✅ Fallback query successful!');
          log(JSON.stringify(retry, null, 2));
          return;
        }
      } catch (iErr) {
        log('❌ Failed to introspect schema:', iErr.message);
      }
    }
  }
}

runQueries();
