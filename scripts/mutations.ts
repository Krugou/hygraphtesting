import { gql } from 'graphql-request';
import { client } from './client';

export const CREATE_TRANSLATION = gql`
  mutation CreateTranslation(
    $translationId: String!
    $description: String!
    $translation: String!
  ) {
    createTranslation(
      data: { translationId: $translationId, description: $description, translation: $translation }
    ) {
      id
      translationId
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

export async function createAndPublishTranslation(
  translationId: string,
  description: string,
  translation: string,
) {
  const createData = await client.request(CREATE_TRANSLATION, {
    translationId,
    description,
    translation,
  });
  const id = createData.createTranslation.id;
  const publishData = await client.request(PUBLISH_TRANSLATION, { id });
  return { createData, publishData };
}
