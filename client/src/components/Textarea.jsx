import React from 'react';

export default function Textarea({ label, error, className = '', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`mt-1 w-full rounded-lg border px-3.5 py-2.5 text-sm focus-ring focus:outline-none resize-none ${
          error ? 'border-red-300' : 'border-slate-200'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
