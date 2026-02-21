// scripts/mutations.js
import { gql } from 'graphql-request';
import { client } from './client.js';

// The `content` field on the Post model is often a rich text field (RichTextAST).
// The GraphQL API expects a JSON document rather than a plain string.
// create mutation doesn't include publishing step; we'll run publish
// separately because the unique field used by your project may not be
// `title`.
const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: RichTextAST!) {
    createPost(data: { title: $title, content: $content }) {
      id
      title
    }
  }
`;

const PUBLISH_POST = gql`
  mutation PublishPost($id: ID!) {
    publishPost(where: { id: $id }, to: PUBLISHED) {
      id
      stage
    }
  }
`;

// utility that produces a minimal RichText AST from plain text
function simpleRichText(text) {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text,
          },
        ],
      },
    ],
  };
}

async function runMutations() {
  console.log('Creating and publishing a new post...');

  const variables = {
    title: `Automated Test Post ${Date.now()}`,
    content: simpleRichText('This post was created via a Node.js mutation script.'),
  };

  try {
    const createData = await client.request(CREATE_POST, variables);
    console.log('✅ Post created!');
    console.dir(createData, { depth: null });

    const id = createData.createPost.id;
    const publishData = await client.request(PUBLISH_POST, { id });
    console.log('✅ Post published!');
    console.dir(publishData, { depth: null });
  } catch (error) {
    console.error('❌ Error executing mutation:', error.message);
  }
}

runMutations();
