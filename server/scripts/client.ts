import { GraphQLClient } from 'graphql-request';
import 'dotenv/config';

function logError(message: string, error?: unknown) {
  console.error(`[Hygraph Client Error] ${message}`);
  if (error) {
    console.error(error);
  }
}

if (!process.env.HYGRAPH_URL || !process.env.HYGRAPH_TOKEN) {
  logError('Missing HYGRAPH_URL or HYGRAPH_TOKEN in .env file.');
  throw new Error('Missing HYGRAPH_URL or HYGRAPH_TOKEN in .env file.');
}

export const client = new GraphQLClient(process.env.HYGRAPH_URL, {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
  },
});
