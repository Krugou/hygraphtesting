import React from 'react';

interface TranslationPushFormProps {
  form: {
    translationId: string;
    description: string;
    enText: string;
    fiText: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  status: string | null;
  statusStyle: string;
}

const TranslationPushForm: React.FC<TranslationPushFormProps> = ({
  form,
  onChange,
  onSubmit,
  isSubmitting,
  status,
  statusStyle,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200 backdrop-blur animate-[rise_.65s_ease-out]">
      <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-slate-900">
        Push Translations
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Create and publish locale values in one request.
      </p>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="translationId"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600"
          >
            Translation ID
          </label>
          <input
            id="translationId"
            name="translationId"
            placeholder="e.g. welcome_message"
            value={form.translationId}
            onChange={onChange}
            className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600"
          >
            Description
          </label>
          <input
            id="description"
            name="description"
            placeholder="Optional description"
            value={form.description}
            onChange={onChange}
            className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div>
          <label
            htmlFor="enText"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600"
          >
            Translation (en)
          </label>
          <textarea
            id="enText"
            name="enText"
            rows={3}
            placeholder="Enter translation text for English"
            value={form.enText}
            onChange={onChange}
            className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div>
          <label
            htmlFor="fiText"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600"
          >
            Translation (fi)
          </label>
          <textarea
            id="fiText"
            name="fiText"
            rows={3}
            placeholder="Enter translation text for Finnish"
            value={form.fiText}
            onChange={onChange}
            className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Publish Locales'}
        </button>
      </form>
      {status && (
        <p className={`mt-4 rounded-xl px-3 py-2 text-center text-sm font-medium ${statusStyle}`}>
          {status}
        </p>
      )}
    </section>
  );
};

export default TranslationPushForm;
