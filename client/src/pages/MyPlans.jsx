import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import * as planService from '../services/planService';
import { useToast } from '../context/ToastContext';
import { downloadPlanAsPDF } from '../utils/pdfGenerator';
import PlanCard from '../components/PlanCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

const sortOptions = [
  ['newest', 'Newest'],
  ['oldest', 'Oldest'],
  ['budget_high', 'Budget: High to Low'],
  ['budget_low', 'Budget: Low to High'],
];

export default function MyPlans() {
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const load = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await planService.getPlans(params);
      setPlans(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Debounce search + sort changes into a single API call
  useEffect(() => {
    const t = setTimeout(() => {
      load({ search: search || undefined, sort });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this business plan? This cannot be undone.')) return;
    try {
      await planService.deletePlan(id);
      setPlans((prev) => prev.filter((p) => p._id !== id));
      toast.success('Plan deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete plan.');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const newPlan = await planService.duplicatePlan(id);
      setPlans((prev) => [newPlan, ...prev]);
      toast.success('Plan duplicated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not duplicate plan.');
    }
  };

  const handleDownload = (plan) => {
    downloadPlanAsPDF(plan);
    toast.success('PDF downloaded');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Plans</h1>
          <p className="text-slate-500 mt-1">All your saved business plans.</p>
        </div>
        <Link to="/plans/new"><Button>+ Create New Plan</Button></Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by idea, title, or industry..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus-ring focus:outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus-ring focus:outline-none bg-white"
        >
          {sortOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div className="mt-6">
        {loading && <LoadingSpinner label="Loading your plans..." />}
        {!loading && error && <ErrorState message={error} onRetry={() => load({ search, sort })} />}
        {!loading && !error && plans.length === 0 && (
          <EmptyState
            title={search ? 'No matching plans' : 'No business plans yet'}
            description={search ? 'Try a different search term.' : 'Create your first AI-generated business plan.'}
            action={!search && <Link to="/plans/new"><Button>Create your first plan</Button></Link>}
          />
        )}
        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard key={plan._id} plan={plan} onDelete={handleDelete} onDuplicate={handleDuplicate} onDownload={handleDownload} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
