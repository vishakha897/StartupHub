import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-xl2 shadow-card border border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
}
