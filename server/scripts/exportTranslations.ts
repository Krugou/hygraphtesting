import { gql } from 'graphql-request';
import { client } from './client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GET_ALL_TRANSLATIONS = gql`
  query GetAllTranslations {
    translations(first: 1000) {
      translationId
      translation
      locale
    }
  }
`;

/**
 * Transforms a flat object with dot-notated keys into a nested object
 * e.g. { "auth.login.title": "Login" } -> { "auth": { "login": { "title": "Login" } } }
 */
function nestObject(flatObj: Record<string, any>) {
  const result: any = {};

  for (const key in flatObj) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
            current[part] = flatObj[key];
        } else {
            current[part] = current[part] || {};
            current = current[part];
        }
    }
  }

  return result;
}

async function exportTranslations() {
  console.log('Fetching translations from Hygraph...');
  try {
    const data: any = await client.request(GET_ALL_TRANSLATIONS);
    const translations = data.translations || [];

    // Group by locale
    const grouped: Record<string, Record<string, string>> = {};

    translations.forEach((item: any) => {
      const locale = item.locale;
      if (!grouped[locale]) grouped[locale] = {};
      grouped[locale][item.translationId] = item.translation;
    });

    // Nest each locale's object and save
    // Placing folders directly in the root as requested (en/, fi/, etc.)
    const rootDir = path.resolve(__dirname, '../../');

    for (const locale in grouped) {
      const nested = nestObject(grouped[locale]);
      const localePath = path.join(rootDir, locale);

      if (!fs.existsSync(localePath)) {
        fs.mkdirSync(localePath, { recursive: true });
      }

      const outputPath = path.join(localePath, 'translation.json');
      fs.writeFileSync(outputPath, JSON.stringify(nested, null, 2));
      console.log(`Successfully exported [${locale}] translations to: ${outputPath}`);
    }

    // Also remove the old flat file if it exists to keep things clean
    const oldPath = path.resolve(rootDir, 'translations_export.json');
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

exportTranslations();
