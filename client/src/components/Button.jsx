import React from 'react';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 disabled:opacity-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

export default function Button({
  children, variant = 'primary', size = 'md', className = '', disabled, loading, ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-ring disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
      {children}
    </button>
  );
}
