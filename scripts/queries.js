// scripts/queries.js
import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-request';
import { client } from './client.js';

// simple logger that mirrors to stdout and a file under .log
const logDir = path.resolve('.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'queries.log');
const log = (...args) => {
  const message = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  console.log(message);
  fs.appendFileSync(logFile, `${message}\n`);
};

// query for a simple Translation collection; change the field names if
// you gave your model a different root name in Hygraph.
const GET_TRANSLATIONS = gql`
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

// if the above field doesn't exist, the introspection query will show all root fields
const INTROSPECTION = gql`
  query Introspection {
    __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }
`;

const runQueries = async () => {
  log('Fetching translations from Hygraph...');

  try {
    const data = await client.request(GET_TRANSLATIONS);
    log('✅ Query Successful!');

    // restructure so each record explicitly shows both locales
    // default translation remains under `translation`, but we add
    // `translation_en` and `translation_fi` for clarity.
    const withLocales = data.translations.map((t) => {
      const copy = { ...t };
      // assign default locale if available
      if (t.localizations) {
        t.localizations.forEach((loc) => {
          copy[`translation_${loc.locale}`] = loc.translation;
        });
      }
      return copy;
    });

    log(JSON.stringify(withLocales, null, 2));
    return;
  } catch (error) {
    log('❌ Error fetching data:', error.message);
    if (/field 'translations' is not defined/.test(error.message)) {
      // introspect to give hints and possibly retry with a different field
      try {
        const schema = await client.request(INTROSPECTION);
        const fields = schema.__schema.queryType.fields.map((f) => f.name);
        log('Available root query fields:');
        fields.forEach((n) => log(' -', n));

        // look for a plural that starts with "translation" ignoring case
        const plural = fields.find(
          (n) => /^translation/i.test(n) && n.toLowerCase() !== 'translation',
        );
        if (plural) {
          log(`
⚡ Attempting again using the '${plural}' field name...
`);
          // build a simple query string dynamically
          const dynamicQuery = gql`
            query GetTranslationsAlternative {
              ${plural}(first: 500, orderBy: createdAt_DESC) {
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
          const retry = await client.request(dynamicQuery);
          log('✅ Fallback query successful!');
          log(JSON.stringify(retry, null, 2));
          return;
        }
      } catch (iErr) {
        log('❌ Failed to introspect schema:', iErr.message);
      }
    }
  }
};

runQueries();
