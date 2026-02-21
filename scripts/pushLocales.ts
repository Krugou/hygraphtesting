import { gql } from 'graphql-request';
import { client } from './client';

export const CREATE_TRANSLATION = gql`
  mutation CreateTranslation(
    $translationId: String!
    $description: String!
    $translation: String!
    $locale: Locale!
  ) {
    createTranslation(
      data: { translationId: $translationId, description: $description, translation: $translation }
      locale: $locale
    ) {
      id
      translationId
      locale
    }
  }
`;

export const PUBLISH_TRANSLATION = gql`
  mutation PublishTranslation($id: ID!) {
    publishTranslation(where: { id: $id }, to: PUBLISHED) {
      id
      stage
    }
  }
`;

export async function pushLocales(
  translationId: string,
  description: string,
  enText: string,
  fiText: string,
) {
  for (const [locale, text] of [
    ['en', enText],
    ['fi', fiText],
  ]) {
    const data = await client.request(CREATE_TRANSLATION, {
      translationId,
      description,
      translation: text,
      locale,
    });
    const id = data.createTranslation.id;
    await client.request(PUBLISH_TRANSLATION, { id });
  }
}
