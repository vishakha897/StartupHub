import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as planService from '../services/planService';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import PlanSections from '../components/PlanSections';
import EmptyState from '../components/EmptyState';

export default function GeneratedPlan() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { planData, input, suggestedTitle } = location.state || {};
  const [planDataState, setPlanDataState] = useState(planData);
  const [title, setTitle] = useState(suggestedTitle || '');
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  if (!planDataState || !input) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <EmptyState
          title="No generated plan to show"
          description="Start by creating a new business plan."
          action={<Button onClick={() => navigate('/plans/new')}>Create a plan</Button>}
        />
      </div>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please give your plan a title.');
      return;
    }
    setSaving(true);
    try {
      const plan = await planService.savePlan({ ...input, title: title.trim(), planData: planDataState });
      toast.success('Plan saved');
      navigate(`/plans/${plan._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const data = await planService.generatePlan(input);
      if (!data.aiConfigured) {
        toast.error(data.message);
        return;
      }
      setPlanDataState(data.planData);
      toast.success('Generated an improved plan');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to generate the business plan right now. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your generated plan</h1>
      <p className="text-slate-500 mt-1">Review it, regenerate if needed, then save it to your account.</p>

      <Card className="p-6 mt-6 sticky top-20 z-10">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <Input label="Plan title" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1" />
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="secondary" onClick={handleRegenerate} loading={regenerating} className="flex-1 sm:flex-none">
              Regenerate
            </Button>
            <Button onClick={handleSave} loading={saving} className="flex-1 sm:flex-none">
              Save Plan
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <PlanSections planData={planDataState} />
      </div>
    </div>
  );
}
