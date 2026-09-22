import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Download, Copy, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import * as planService from '../services/planService';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, planToText } from '../utils/formatters';
import { downloadPlanAsPDF } from '../utils/pdfGenerator';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Button from '../components/Button';
import Modal from '../components/Modal';
import PlanSections from '../components/PlanSections';
import ConfigNotice from '../components/ConfigNotice';

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const [configMessage, setConfigMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await planService.getPlan(id);
      setPlan(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const handleDownload = () => {
    downloadPlanAsPDF(plan);
    toast.success('PDF downloaded');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(planToText(plan));
      toast.success('Business plan copied.');
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setConfigMessage('');
    try {
      const data = await planService.regeneratePlan(id);
      if (!data.aiConfigured) {
        setConfigMessage(data.message);
        return;
      }
      setPlan(data.plan);
      toast.success('Plan regenerated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to generate the business plan right now. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await planService.deletePlan(id);
      toast.success('Plan deleted');
      navigate('/plans');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete plan.');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading plan..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!plan) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{plan.title}</h1>
          <p className="text-slate-500 mt-1">
            {formatCurrency(plan.budget)} · {plan.targetCustomers} · Created {formatDate(plan.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={handleDownload}><Download className="h-3.5 w-3.5" /> PDF</Button>
          <Button variant="secondary" size="sm" onClick={handleCopy}><Copy className="h-3.5 w-3.5" /> Copy</Button>
          <Link to={`/plans/${id}/edit`}><Button variant="secondary" size="sm"><Pencil className="h-3.5 w-3.5" /> Edit</Button></Link>
          <Button variant="secondary" size="sm" onClick={handleRegenerate} loading={regenerating}>
            <RefreshCw className="h-3.5 w-3.5" /> Regenerate
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
        </div>
      </div>

      <div className="mt-2 mb-4">
        <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Business idea:</span> {plan.businessIdea}</p>
      </div>

      {configMessage && <div className="mb-6"><ConfigNotice message={configMessage} /></div>}

      <PlanSections planData={plan.planData} />

      <Modal
        open={confirmDelete}
        title="Delete this business plan?"
        onClose={() => setConfirmDelete(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
          </>
        }
      >
        Are you sure you want to delete "{plan.title}"? This cannot be undone.
      </Modal>
    </div>
  );
}
