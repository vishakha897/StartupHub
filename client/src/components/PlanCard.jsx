import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Copy, Download, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, truncate } from '../utils/formatters';

const statusStyles = {
  draft: 'bg-amber-100 text-amber-700',
  complete: 'bg-emerald-100 text-emerald-700',
};

export default function PlanCard({ plan, onDelete, onDuplicate, onDownload }) {
  return (
    <div className="rounded-xl2 bg-white shadow-card border border-slate-100 p-5 flex flex-col hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-slate-900 truncate">{plan.title}</h3>
        <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[plan.status] || statusStyles.complete}`}>
          {plan.status}
        </span>
      </div>
      <p className="text-sm text-slate-500 mt-1.5">{truncate(plan.businessIdea, 100)}</p>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="font-semibold text-brand-600">{formatCurrency(plan.budget)}</span>
        <span className="text-xs text-slate-400">{formatDate(plan.createdAt)}</span>
      </div>

      <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-100">
        <Link to={`/plans/${plan._id}`} title="View" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-600">
          <Eye className="h-4 w-4" />
        </Link>
        <Link to={`/plans/${plan._id}/edit`} title="Edit" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-600">
          <Pencil className="h-4 w-4" />
        </Link>
        <button title="Duplicate" onClick={() => onDuplicate(plan._id)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-600">
          <Copy className="h-4 w-4" />
        </button>
        <button title="Download PDF" onClick={() => onDownload(plan)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-600">
          <Download className="h-4 w-4" />
        </button>
        <button title="Delete" onClick={() => onDelete(plan._id)} className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 ml-auto">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
