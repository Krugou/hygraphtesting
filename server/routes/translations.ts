import { Router, Request, Response } from 'express';
import { pushLocales } from '../../scripts/pushLocales.js';
import { gql } from 'graphql-request';
import { client } from '../../scripts/client.js';

const router = Router();

const GET_TRANSLATION = gql`
  query GetTranslation($translationId: String!, $locale: Locale!) {
    translation(where: { translationId: $translationId }, locale: $locale) {
      id
      translationId
      description
      translation
      locale
    }
  }
`;

const GET_TRANSLATION_KEYS = gql`
  query GetTranslationKeys {
    translations(first: 500, orderBy: translationId_ASC) {
      translationId
    }
  }
`;

router.post('/translations', async (req: Request, res: Response) => {
  const { translationId, description, translation, locale } = req.body;
  if (!translationId || !translation || !locale) {
    return res.status(400).json({ error: 'translationId, translation, and locale are required' });
  }

  try {
    await pushLocales(translationId, description || '', translation, locale);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

router.get('/translations/keys', async (_req: Request, res: Response) => {
  try {
    const data = await client.request(GET_TRANSLATION_KEYS);
    const keys = Array.from(
      new Set(
        (data?.translations || [])
          .map((item: { translationId: string }) => item.translationId)
          .filter(Boolean),
      ),
    );
    res.json({ keys });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

router.get('/translations', async (req: Request, res: Response) => {
  const { translationId, locale } = req.query;
  if (!translationId || !locale) {
    return res.status(400).json({ error: 'translationId and locale query params required' });
  }

  try {
    const data = await client.request(GET_TRANSLATION, { translationId, locale });
    if (!data || !data.translation) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json(data.translation);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
