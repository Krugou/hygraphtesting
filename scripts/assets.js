// scripts/assets.js
// in the newer Hygraph projects the REST /upload endpoint is disabled;
// you must instead use a GraphQL mutation (assetCreate).
import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-request';
import { client } from './client.js';

const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'assets.log');
const log = (...args) => {
  const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(msg);
  fs.appendFileSync(logFile, `${msg}\n`);
};

// simple mutation that accepts a remote URL; the API now expects an `uploadUrl` field
const CREATE_ASSET = gql`
  mutation CreateAsset($uploadUrl: String!) {
    createAsset(data: { uploadUrl: $uploadUrl }) {
      id
      url
      mimeType
    }
  }
`;

const uploadAsset = async () => {
  log('Uploading asset to Hygraph via GraphQL...');
  // public image URL to send to Hygraph; previous versions used a `url` input
  const fileUrl = 'https://picsum.photos/200';

  try {
    const data = await client.request(CREATE_ASSET, { uploadUrl: fileUrl });
    log('✅ Asset Uploaded Successfully!');
    log(JSON.stringify(data, null, 2));
  } catch (error) {
    log('❌ Upload Failed:', error.message);
    // if the old endpoint still exists this catch block will provide the
    // underlying JSON from the server so you can inspect the reason.
  }
};

uploadAsset();
