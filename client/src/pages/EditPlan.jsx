import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as planService from '../services/planService';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

export default function EditPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const plan = await planService.getPlan(id);
        setForm(plan);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this plan.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    setSaveStatus('Saving...');
    try {
      await planService.updatePlan(id, {
        title: form.title,
        businessIdea: form.businessIdea,
        budget: Number(form.budget),
        targetCustomers: form.targetCustomers,
        industry: form.industry,
        location: form.location,
        status: form.status,
      });
      setSaveStatus('Saved successfully');
      toast.success('Changes saved');
      setTimeout(() => navigate(`/plans/${id}`), 600);
    } catch (err) {
      setSaveStatus('');
      toast.error(err.response?.data?.message || 'Unable to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading plan..." />;
  if (error) return <ErrorState message={error} />;
  if (!form) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Edit plan</h1>
      <p className="text-slate-500 mt-1">
        Update the core details of "{form.title}". To regenerate the full AI content, use Regenerate on the plan details page.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <Card className="p-6 sm:p-8 space-y-5">
          <Input label="Plan title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Business idea" rows={4} value={form.businessIdea} onChange={(e) => setForm({ ...form, businessIdea: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Budget" type="number" min="0" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            <Input label="Target customers" value={form.targetCustomers} onChange={(e) => setForm({ ...form, targetCustomers: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Industry" value={form.industry || ''} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            <Input label="Location" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus-ring focus:outline-none bg-white"
            >
              <option value="draft">Draft</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={saving}>Save changes</Button>
            {saveStatus && <span className="text-sm text-slate-500">{saveStatus}</span>}
          </div>
        </Card>
      </form>
    </div>
  );
}
