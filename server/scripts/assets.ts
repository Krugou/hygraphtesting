import { gql } from 'graphql-request';
import { client } from './client.ts';

export const CREATE_ASSET = gql`
  mutation CreateAsset($uploadUrl: String!) {
    createAsset(data: { uploadUrl: $uploadUrl }) {
      id
      url
      mimeType
    }
  }
`;

export async function uploadAsset(uploadUrl: string) {
  return await client.request(CREATE_ASSET, { uploadUrl });
}
