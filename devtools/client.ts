// devtools/client.ts
// TypeScript copy of scripts/client.js
// @ts-nocheck
import { GraphQLClient } from 'graphql-request';
import 'dotenv/config';

if (!process.env.HYGRAPH_URL || !process.env.HYGRAPH_TOKEN) {
  console.error('Missing HYGRAPH_URL or HYGRAPH_TOKEN in .env file.');
  process.exit(1);
}

export const client = new GraphQLClient(process.env.HYGRAPH_URL, {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
  },
});
