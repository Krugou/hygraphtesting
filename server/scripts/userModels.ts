import { gql } from 'graphql-request';
import { client } from './client.ts';

export const INTROSPECTION = gql`
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

export async function discoverUserModels() {
  const data = await client.request(INTROSPECTION);
  return data.__schema.queryType.fields;
}
