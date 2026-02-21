// scripts/management.js
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import 'dotenv/config';

// log setup
const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'management.log');
const log = (...args) => {
  const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(msg);
  fs.appendFileSync(logFile, `${msg}\n`);
};

const require = createRequire(import.meta.url);
const { Client, SimpleFieldType } = require('@hygraph/management-sdk');

// management operations require a separate endpoint/token with the
// `MANAGEMENT` prefix so you don't accidentally run schema mutations with a
// regular content token.
if (!process.env.HYGRAPH_MANAGEMENT_URL || !process.env.HYGRAPH_MANAGEMENT_TOKEN) {
  log(
    'Missing HYGRAPH_MANAGEMENT_URL or HYGRAPH_MANAGEMENT_TOKEN in .env file.\n' +
      'Make sure you generated a Management API token with `MODEL_UPDATE` ' +
      'permissions and pointed HYGRAPH_MANAGEMENT_URL at the *correct* endpoint.',
  );
  log(
    'The SDK expects the Content API URL for a specific environment (e.g. ' +
      'https://api-region.hygraph.com/v2/PROJECT_ID/master), not the generic ' +
      'management host. See .env.example for the proper format.',
  );
  process.exit(1);
}

const client = new Client({
  authToken: process.env.HYGRAPH_MANAGEMENT_TOKEN,
  endpoint: process.env.HYGRAPH_MANAGEMENT_URL,
});

const runManagement = async () => {
  log("Creating a new 'TestCategory' model via Management SDK...");

  try {
    // 1. Create a new model
    client.createModel({
      apiId: 'TestCategory',
      apiIdPlural: 'TestCategories',
      displayName: 'Test Category',
    });

    // 2. Add a string field to the model
    client.createSimpleField({
      parentApiId: 'TestCategory',
      type: SimpleFieldType.String,
      apiId: 'categoryName',
      displayName: 'Category Name',
      isRequired: true,
    });

    // 3. Run the migration (true = run immediately without dry-run)
    const result = await client.run(true);

    if (result.errors && result.errors.length > 0) {
      log('❌ Schema Update Failed:', JSON.stringify(result.errors, null, 2));
      // common failure is permission denied; help the user understand
      if (result.errors.some((e) => /missing permission/.test(e.message))) {
        log(
          'Hint: your management token may not have MODEL_UPDATE or similar ' +
            'scope. Create a new permanent token in the Hygraph dashboard and ' +
            'try again.',
        );
      }
    } else {
      log('✅ Schema Updated Successfully! Check your Hygraph dashboard.');
    }
  } catch (error) {
    log('❌ Management SDK Error:', error.message);
    if (error.message && error.message.includes('Could not find environment')) {
      log(
        'Hint: your HYGRAPH_MANAGEMENT_URL may be pointing at the wrong place. ' +
          'Use the content API endpoint for the environment you want to target (e.g. ' +
          '`https://api-us-west-2.hygraph.com/v2/PROJECT_ID/master`).',
      );
    }
  }
};

runManagement();
