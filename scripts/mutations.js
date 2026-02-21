// scripts/mutations.js
import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-request';
import { client } from './client.js';

// create log directory and file
const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'mutations.log');
const log = (...args) => {
  const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(msg);
  fs.appendFileSync(logFile, `${msg}\n`);
};

// The Translation model in this project has a few simple string fields
// (all of them are single‑line text in the schema).  We'll create a
// translation record and then publish it the same way the original post
// script worked.
//
// Adjust the variable names and types to match whatever fields you actually
// created in Hygraph; the names below are based on the column labels you
// provided in your request.
//
const CREATE_TRANSLATION = gql`
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

const PUBLISH_TRANSLATION = gql`
  mutation PublishTranslation($id: ID!) {
    publishTranslation(where: { id: $id }, to: PUBLISHED) {
      id
      stage
    }
  }
`;

// earlier versions of the script needed a RichTextAST helper for post
// content.  Translation fields are plain strings so we no longer need that
// utility.  If you ever need rich text again you can re‑add it.

const runMutations = async () => {
  log('Creating and publishing a new translation record...');

  const variables = {
    translationId: `auto-${Date.now()}`,
    description: 'This entry was created via a Node.js mutation script.',
    translation: 'Sample translated text',
  };

  try {
    const createData = await client.request(CREATE_TRANSLATION, variables);
    log('✅ Translation record created!');
    log(JSON.stringify(createData, null, 2));

    const id = createData.createTranslation.id;
    const publishData = await client.request(PUBLISH_TRANSLATION, { id });
    log('✅ Translation published!');
    log(JSON.stringify(publishData, null, 2));
  } catch (error) {
    log('❌ Error executing mutation:', error.message);
    if (/permission/i.test(error.message) || error.message.includes('403')) {
      log(
        'Hint: check that HYGRAPH_TOKEN has write/publish permissions for the ' +
          'Translation model and is not a read‑only key.',
      );
    }
  }
};

runMutations();
