import { gql } from 'graphql-request';
import { client } from './client.ts';

export const GET_TRANSLATIONS = gql`
  query GetTranslations {
    translations(first: 500, orderBy: createdAt_DESC) {
      id
      translationId
      description
      translation
      stage
      createdAt
      localizations {
        locale
        translation
      }
    }
  }
`;

export async function fetchTranslations() {
  const data = await client.request(GET_TRANSLATIONS);
  return data.translations;
}
