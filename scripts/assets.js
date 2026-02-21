// scripts/assets.js
// in the newer Hygraph projects the REST /upload endpoint is disabled;
// you must instead use a GraphQL mutation (assetCreate).
import { gql } from 'graphql-request';
import { client } from './client.js';

// simple mutation that accepts a URL
const CREATE_ASSET = gql`
  mutation CreateAsset($url: String!) {
    createAsset(data: { url: $url }) {
      id
      url
      mimeType
    }
  }
`;

async function uploadAsset() {
  console.log('Uploading asset to Hygraph via GraphQL...');
  const fileUrl = 'https://picsum.photos/200';

  try {
    const data = await client.request(CREATE_ASSET, { url: fileUrl });
    console.log('✅ Asset Uploaded Successfully!');
    console.dir(data, { depth: null });
  } catch (error) {
    console.error('❌ Upload Failed:', error.message);
    // if the old endpoint still exists this catch block will provide the
    // underlying JSON from the server so you can inspect the reason.
  }
}

uploadAsset();
