import React from 'react';

export default function ConfigNotice({ message }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm flex items-start gap-3">
      <span className="text-lg leading-none">⚙️</span>
      <div>
        <p className="font-semibold">AI generation is not configured yet</p>
        <p className="mt-0.5 text-amber-700">{message || 'Add a valid AI_API_KEY to server/.env to enable AI plan generation.'}</p>
      </div>
    </div>
  );
}
