import React from 'react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="text-lg font-bold text-slate-800">We hit a snag</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">{message}</p>
      {onRetry && <Button onClick={onRetry} variant="secondary" className="mt-5">Try again</Button>}
    </div>
  );
}
