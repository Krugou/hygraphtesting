// devtools/introspectAsset.ts
// @ts-nocheck
import { gql, GraphQLClient } from 'graphql-request';
import 'dotenv/config';

const client = new GraphQLClient(process.env.HYGRAPH_URL, {
  headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}` },
});

(async () => {
  try {
    const res = await client.request(gql`
      query IntrospectAssetInput {
        __type(name: "AssetCreateInput") {
          name
          inputFields {
            name
            type {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    `);
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
})();
