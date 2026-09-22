import React from 'react';
import Card from './Card';

export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-brand-500" />}
      </div>
      <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </Card>
  );
}
