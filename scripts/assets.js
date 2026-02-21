// scripts/assets.js
// in the newer Hygraph projects the REST /upload endpoint is disabled;
// you must instead use a GraphQL mutation (assetCreate).
import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-request';
import { client } from './client.js';

const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const logFile = path.join(logDir, 'assets.log');
function log(...args) {
  const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(msg);
  fs.appendFileSync(logFile, msg + '\n');
}

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
  log('Uploading asset to Hygraph via GraphQL...');
  const fileUrl = 'https://picsum.photos/200';

  try {
    const data = await client.request(CREATE_ASSET, { url: fileUrl });
    log('✅ Asset Uploaded Successfully!');
    log(JSON.stringify(data, null, 2));
  } catch (error) {
    log('❌ Upload Failed:', error.message);
    // if the old endpoint still exists this catch block will provide the
    // underlying JSON from the server so you can inspect the reason.
  }
}

uploadAsset();
