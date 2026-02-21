// scripts/inspect.js
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

async function inspectSchema() {
  console.log('Inspecting Hygraph schema...');
  try {
    const data = await client.request(GET_SCHEMA_TYPES);
    console.log('✅ Connection Successful!');
    console.log('Available Top-Level Fields:');
    data.__schema.queryType.fields.forEach((field) => {
      if (!field.name.startsWith('__')) {
        console.log(`- ${field.name}`);
      }
    });
  } catch (error) {
    console.error('❌ Error inspecting schema:', error.message);
  }
}

inspectSchema();
