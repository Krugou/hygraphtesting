// scripts/pushLocales.js
// create two translations (fi and en) for a given translationId
import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-request';
import { client } from './client.js';

// logger (same pattern as other scripts)
const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'pushLocales.log');
const log = (...args) => {
  const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(msg);
  fs.appendFileSync(logFile, `${msg}\n`);
};

const CREATE_TRANSLATION = gql`
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

const PUBLISH_TRANSLATION = gql`
  mutation PublishTranslation($id: ID!) {
    publishTranslation(where: { id: $id }, to: PUBLISHED) {
      id
      stage
    }
  }
`;

// simple helper which takes a key and two text values
const pushLocales = async (translationId, description, enText, fiText) => {
  log('Pushing locales for', translationId);
  for (const [locale, text] of [
    ['en', enText],
    ['fi', fiText],
  ]) {
    try {
      const data = await client.request(CREATE_TRANSLATION, {
        translationId,
        description,
        translation: text,
        locale,
      });
      log(`✅ created ${locale} entry:`, JSON.stringify(data, null, 2));
      const id = data.createTranslation.id;
      const pub = await client.request(PUBLISH_TRANSLATION, { id });
      log(`   published ${locale}:`, JSON.stringify(pub, null, 2));
    } catch (err) {
      log(`❌ failed for locale ${locale}:`, err.message);
    }
  }
};

// allow translationId and texts via command line args but fall back to prompts
let [, , translationId = '', description = '', enText = '', fiText = ''] = process.argv;

const ask = async (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    });
  });
};

const main = async () => {
  if (!translationId) {
    translationId = await ask('Translation ID (key): ');
  }
  if (!description) {
    description = await ask('Description (optional): ');
  }
  if (!enText) {
    enText = await ask('English text: ');
  }
  if (!fiText) {
    fiText = await ask('Finnish text: ');
  }

  if (!translationId || !enText || !fiText) {
    console.error('translationId, enText and fiText are required');
    process.exit(1);
  }

  await pushLocales(translationId, description, enText, fiText);
};

import readline from 'readline';

main();
