import React from 'react';

export default function LoadingSpinner({ label = 'Loading...', size = 'md' }) {
  const dims = size === 'sm' ? 'h-6 w-6 border-2' : 'h-10 w-10 border-4';
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
      <div className={`rounded-full border-brand-200 border-t-brand-600 animate-spin ${dims}`} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
