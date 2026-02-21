// scripts/inspect.js
import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-request';
import { client } from './client.js';

const GET_SCHEMA_TYPES = gql`
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

// basic query to pull a handful of translation entries for export
// adjust `first` or add pagination if you expect more than 100 records
const GET_ALL_TRANSLATIONS = gql`
  query GetAllTranslations($first: Int!) {
    translations(first: $first, orderBy: createdAt_DESC) {
      id
      translationId
      description
      translation
      stage
      createdAt
    }
  }
`;

const inspectSchema = async () => {
  console.log('Inspecting Hygraph schema...');

  // ensure the log directory exists (reuse pattern from other scripts)
  const logDir = path.resolve('.log');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const outFile = path.join(logDir, 'inspect.json');

  try {
    const data = await client.request(GET_SCHEMA_TYPES);
    console.log('✅ Connection Successful!');
    console.log('Available Top-Level Fields:');
    data.__schema.queryType.fields.forEach((field) => {
      if (!field.name.startsWith('__')) {
        console.log(`- ${field.name}`);
      }
    });

    // write raw response to disk for later reference
    fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
    console.log(`📝 Schema dumped to ${outFile}`);

    // after exporting schema, fetch some translation entries as JSON
    try {
      const transData = await client.request(GET_ALL_TRANSLATIONS, { first: 100 });
      const transFile = path.join(logDir, 'translations.json');
      fs.writeFileSync(transFile, JSON.stringify(transData, null, 2));
      console.log(`📝 Translations list dumped to ${transFile}`);
    } catch (qErr) {
      console.error('❌ Error querying translations:', qErr.message);
    }
  } catch (error) {
    console.error('❌ Error inspecting schema:', error.message);
  }
};

inspectSchema();
