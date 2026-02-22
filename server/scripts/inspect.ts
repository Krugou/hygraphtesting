import { gql } from 'graphql-request';
import { client } from './client';

export const GET_SCHEMA_TYPES = gql`
  query GetSchemaTypes {
    __schema {
      queryType {
        fields {
          name
          description
        }
      }
    }
  }
`;

export async function inspectSchemaTypes() {
  return await client.request(GET_SCHEMA_TYPES);
}
