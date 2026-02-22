import { Client, SimpleFieldType } from '@hygraph/management-sdk';
import 'dotenv/config';

if (!process.env.HYGRAPH_MANAGEMENT_URL || !process.env.HYGRAPH_MANAGEMENT_TOKEN) {
  throw new Error('Missing HYGRAPH_MANAGEMENT_URL or HYGRAPH_MANAGEMENT_TOKEN in .env file.');
}

export const managementClient = new Client({
  authToken: process.env.HYGRAPH_MANAGEMENT_TOKEN,
  endpoint: process.env.HYGRAPH_MANAGEMENT_URL,
});

export async function createTestCategoryModel() {
  managementClient.createModel({
    apiId: 'TestCategory',
    apiIdPlural: 'TestCategories',
    displayName: 'Test Category',
  });
  managementClient.createSimpleField({
    parentApiId: 'TestCategory',
    type: SimpleFieldType.String,
    apiId: 'categoryName',
    displayName: 'Category Name',
    isRequired: true,
  });
  return await managementClient.run(true);
}
