import React from 'react';

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative bg-white rounded-xl2 shadow-xl max-w-md w-full p-6 fade-in"
      >
        {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
        <div className="mt-3 text-sm text-slate-600">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
