// scripts/queries.js
import { gql } from 'graphql-request';
import { client } from './client.js';

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
  console.log('Fetching posts from Hygraph...');

  try {
    const data = await client.request(GET_POSTS);
    console.log('✅ Query Successful!');
    console.dir(data, { depth: null });
    return;
  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
    if (/field 'posts' is not defined/.test(error.message)) {
      // introspect to give hints and possibly retry with a different field
      try {
        const schema = await client.request(INTROSPECTION);
        const fields = schema.__schema.queryType.fields.map((f) => f.name);
        console.log('Available root query fields:');
        fields.forEach((n) => console.log(' -', n));

        // look for a plural that starts with "post" ignoring case
        const plural = fields.find((n) => /^post/i.test(n) && n.toLowerCase() !== 'post');
        if (plural) {
          console.log(`
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
          console.log('✅ Fallback query successful!');
          console.dir(retry, { depth: null });
          return;
        }
      } catch (iErr) {
        console.error('❌ Failed to introspect schema:', iErr.message);
      }
    }
  }
}

runQueries();
