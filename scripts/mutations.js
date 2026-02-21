// scripts/mutations.js
import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-request';
import { client } from './client.js';

// create log directory and file
const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const logFile = path.join(logDir, 'mutations.log');
function log(...args) {
  const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(msg);
  fs.appendFileSync(logFile, msg + '\n');
}

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

// utility that produces a minimal Slate.js AST for a rich‑text field
// Hygraph expects the `children` style structure used by slate.js
function simpleRichText(text) {
  return {
    children: [
      {
        type: 'paragraph',
        children: [{ text }],
      },
    ],
  };
}

async function runMutations() {
  log('Creating and publishing a new post...');

  const variables = {
    title: `Automated Test Post ${Date.now()}`,
    content: simpleRichText('This post was created via a Node.js mutation script.'),
  };

  try {
    const createData = await client.request(CREATE_POST, variables);
    log('✅ Post created!');
    log(JSON.stringify(createData, null, 2));

    const id = createData.createPost.id;
    const publishData = await client.request(PUBLISH_POST, { id });
    log('✅ Post published!');
    log(JSON.stringify(publishData, null, 2));
  } catch (error) {
    log('❌ Error executing mutation:', error.message);
    if (/permission/i.test(error.message) || error.message.includes('403')) {
      log(
        'Hint: check that HYGRAPH_TOKEN has write/publish permissions for the ' +
          'Post model and is not a read‑only key.',
      );
    }
  }
}

runMutations();
