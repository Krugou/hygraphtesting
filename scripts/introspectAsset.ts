import { gql } from 'graphql-request';
import { client } from './client';

export const INTROSPECT_ASSET_INPUT = gql`
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
`;

export async function introspectAssetInput() {
  return await client.request(INTROSPECT_ASSET_INPUT);
}
