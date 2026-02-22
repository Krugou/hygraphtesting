import { useState } from 'react';
import TranslationLookup from './components/TranslationLookup';
import TranslationKeysPanel from './components/TranslationKeysPanel';
import TranslationPushForm from './components/TranslationPushForm';

export default function App() {
  type FormState = {
    translationId: string;
    description: string;
    enText: string;
    fiText: string;
  };
  type LookupState = {
    translationId: string;
    locale: string;
  };
  type LookupResult = {
    translationId?: string;
    locale?: string;
    description?: string;
    translation?: string;
    error?: string;
  } | null;

  const [form, setForm] = useState<FormState>({
    translationId: '',
    description: '',
    enText: '',
    fiText: '',
  });
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lookup, setLookup] = useState<LookupState>({ translationId: '', locale: 'en' });
  const [lookupResult, setLookupResult] = useState<LookupResult>(null);
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  const [keys, setKeys] = useState<string[]>([]);
  const [keysError, setKeysError] = useState<string | null>(null);
  const [isLoadingKeys, setIsLoadingKeys] = useState<boolean>(false);

  const logClientError = (scope: string, err: unknown, context: Record<string, unknown> = {}) => {
    let message = '';
    let stack = '';
    if (err instanceof Error) {
      message = err.message;
      stack = err.stack || '';
    } else {
      message = String(err);
    }
    console.error(`[frontend:${scope}]`, {
      message,
      stack,
      context,
      timestamp: new Date().toISOString(),
    });
  };

  const parseJsonOrThrow = async (res: Response): Promise<any> => {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const raw = await res.text();
      if (raw.startsWith('<!DOCTYPE')) {
        throw new Error(
          'API returned HTML. Start both apps with `npm run dev` so /api is proxied to Express.',
        );
      }
      throw new Error(`Unexpected API response: ${raw.slice(0, 120)}`);
    }
    return res.json();
  };

  const requestApi = async (path: string, options?: RequestInit): Promise<Response> => {
    const primary = await fetch(path, options);
    if (
      primary.status === 404 &&
      window.location.hostname === 'localhost' &&
      window.location.port === '5173'
    ) {
      const fallbackUrl = `http://localhost:3000${path}`;
      console.warn(`API 404 on ${path}; retrying via ${fallbackUrl}`);
      return fetch(fallbackUrl, options);
    }
    return primary;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setIsSubmitting(true);
    try {
      const res = await requestApi('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await parseJsonOrThrow(res);
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus(`error: ${data.error}`);
      }
    } catch (err) {
      logClientError('submitTranslation', err, { form });
      setStatus(`error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async () => {
    if (!lookup.translationId) {
      setLookupResult({ error: 'translationId is required' });
      return;
    }

    setIsLookingUp(true);
    try {
      const res = await requestApi(
        `/api/translations?translationId=${encodeURIComponent(lookup.translationId)}&locale=${lookup.locale}`,
        undefined,
      );
      const data = await parseJsonOrThrow(res);
      if (res.ok) {
        setLookupResult(data);
      } else {
        setLookupResult({ error: data.error });
      }
    } catch (err) {
      logClientError('lookupTranslation', err, { lookup });
      setLookupResult({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setIsLookingUp(false);
    }
  };

  const statusStyle =
    status && status.startsWith('error')
      ? 'bg-rose-100 text-rose-700 border border-rose-200'
      : status === 'success'
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        : 'bg-amber-100 text-amber-700 border border-amber-200';

  const lookupHasError = Boolean(lookupResult && lookupResult.error);

  const handleLoadKeys = async () => {
    setIsLoadingKeys(true);
    setKeysError(null);
    try {
      const res = await requestApi('/api/translations/keys', undefined);
      const data = await parseJsonOrThrow(res);
      if (res.ok) {
        setKeys(data.keys || []);
      } else {
        setKeysError(data.error || 'failed to load keys');
      }
    } catch (err) {
      logClientError('loadTranslationKeys', err);
      setKeysError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoadingKeys(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-10 md:px-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-orange-300/40 blur-3xl" />

      <section className="relative mx-auto max-w-6xl animate-[fadeIn_.45s_ease-out]">
        <header className="mb-8 text-center animate-[rise_.5s_ease-out]">
          <p className="mb-2 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Hygraph Locale Console
          </p>
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Translate, Push, Verify
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Create and publish locale entries, then immediately test each key by locale from one
            screen.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <TranslationLookup
              onLookup={handleLookup}
              lookupResult={lookupResult}
              isLookingUp={isLookingUp}
              lookup={lookup}
              setLookup={setLookup}
            />
            <TranslationKeysPanel
              keys={keys}
              keysError={keysError}
              isLoadingKeys={isLoadingKeys}
              onLoadKeys={handleLoadKeys}
            />
          </div>
          <TranslationPushForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            status={status}
            statusStyle={statusStyle}
          />
        </div>
      </section>
    </main>
  );
}
