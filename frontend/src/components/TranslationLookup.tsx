import React from 'react';

interface TranslationLookupProps {
  onLookup: () => void;
  lookupResult: any;
  isLookingUp: boolean;
  lookup: { translationId: string; locale: string };
  setLookup: (lookup: { translationId: string; locale: string }) => void;
}

const TranslationLookup: React.FC<TranslationLookupProps> = ({
  onLookup,
  lookupResult,
  isLookingUp,
  lookup,
  setLookup,
}) => {
  const lookupHasError = Boolean(lookupResult?.error);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200 backdrop-blur animate-[rise_.55s_ease-out]">
      <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-slate-900">
        Lookup Translation
      </h2>
      <p className="mt-1 text-sm text-slate-500">Load a key from Hygraph using a target locale.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          placeholder="translationId (e.g. home_title)"
          value={lookup.translationId}
          onChange={(e) => setLookup({ ...lookup, translationId: e.target.value })}
        />
        <select
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          value={lookup.locale}
          onChange={(e) => setLookup({ ...lookup, locale: e.target.value })}
          aria-label="Locale"
        >
          <option value="en">English</option>
          <option value="fi">Finnish</option>
        </select>
        <button
          type="button"
          onClick={onLookup}
          disabled={isLookingUp}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLookingUp ? 'Loading...' : 'Load'}
        </button>
      </div>
      <div className="mt-4 min-h-44 rounded-xl border border-slate-200 bg-slate-50 p-3">
        {lookupResult ? (
          lookupHasError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {lookupResult.error}
            </div>
          ) : (
            <div className="space-y-2 text-sm text-slate-700 animate-[fadeIn_.25s_ease-out]">
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                <span className="text-slate-500">Key</span>
                <span className="font-semibold">{lookupResult.translationId}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                <span className="text-slate-500">Locale</span>
                <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-700">
                  {lookupResult.locale}
                </span>
              </div>
              <div className="rounded-lg bg-white px-3 py-2">
                <p className="mb-1 text-slate-500">Description</p>
                <p>{lookupResult.description || '-'}</p>
              </div>
              <div className="rounded-lg bg-white px-3 py-2">
                <p className="mb-1 text-slate-500">Translation</p>
                <p className="font-medium">{lookupResult.translation || '-'}</p>
              </div>
            </div>
          )
        ) : (
          <p className="text-sm text-slate-400">No lookup result yet.</p>
        )}
      </div>
    </section>
  );
};

export default TranslationLookup;
