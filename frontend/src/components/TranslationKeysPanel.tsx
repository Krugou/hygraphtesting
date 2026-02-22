import React from 'react';

interface TranslationKeysPanelProps {
  keys: string[];
  keysError: string | null;
  isLoadingKeys: boolean;
  onLoadKeys: () => void;
}

const TranslationKeysPanel: React.FC<TranslationKeysPanelProps> = ({
  keys,
  keysError,
  isLoadingKeys,
  onLoadKeys,
}) => {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">All Translation Keys</h3>
        <button
          type="button"
          onClick={onLoadKeys}
          disabled={isLoadingKeys}
          className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoadingKeys ? 'Loading...' : 'Fetch Keys'}
        </button>
      </div>
      {keysError && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700">
          {keysError}
        </p>
      )}
      {!keysError && keys.length === 0 && !isLoadingKeys && (
        <p className="text-xs text-slate-500">No keys loaded yet.</p>
      )}
      {keys.length > 0 && (
        <ul className="grid max-h-44 grid-cols-1 gap-1 overflow-auto pr-1 text-xs text-slate-700 sm:grid-cols-2">
          {keys.map((key) => (
            <li
              key={key}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-medium"
            >
              {key}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TranslationKeysPanel;
