import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import * as planService from '../services/planService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

/* =========================================================
   SIMPLE ICON COMPONENT
   No lucide-react / no external SVG icons
========================================================= */

function Icon({ name, size = 20, className = '' }) {
  const icons = {
    plus: '+',
    arrow: '→',
    sparkle: '✦',
    rocket: '🚀',
    bulb: '💡',
    target: '🎯',
    chart: '📊',
    wallet: '₹',
    clock: '◷',
    file: '▣',
    brain: '✦',
    check: '✓',
    zap: '⚡',
    calendar: '◷',
    menu: '⋯',
    chevron: '›',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-bold leading-none ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(14, size * 0.85),
      }}
      aria-hidden="true"
    >
      {icons[name] || '•'}
    </span>
  );
}

/* =========================================================
   CURRENCY
========================================================= */

function formatINR(value) {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/* =========================================================
   DATE
========================================================= */

function formatDate(date) {
  if (!date) return '—';

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* =======================================================
     LOAD PLANS
  ======================================================= */

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await planService.getPlans();

      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not load your dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =======================================================
     DASHBOARD STATS
  ======================================================= */

  const stats = useMemo(() => {
    const now = new Date();

    const thisMonth = plans.filter((plan) => {
      if (!plan.createdAt) return false;

      const date = new Date(plan.createdAt);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    const totalBudget = plans.reduce(
      (sum, plan) => sum + (Number(plan.budget) || 0),
      0
    );

    const averageBudget =
      plans.length > 0 ? totalBudget / plans.length : 0;

    return {
      total: plans.length,
      thisMonth,
      totalBudget,
      averageBudget,
      latest: plans[0] || null,
    };
  }, [plans]);

  /* =======================================================
     TREND DATA
  ======================================================= */

  const trendData = useMemo(() => {
    const buckets = {};

    plans.forEach((plan) => {
      if (!plan.createdAt) return;

      const date = new Date(plan.createdAt);

      const key = date.toLocaleString('en-IN', {
        month: 'short',
      });

      buckets[key] = (buckets[key] || 0) + 1;
    });

    return Object.entries(buckets)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .slice(-6);
  }, [plans]);

  /* =======================================================
     MAX BUDGET FOR CSS CHART
  ======================================================= */

  const maxBudget = useMemo(() => {
    if (!plans.length) return 1;

    return Math.max(
      ...plans
        .slice(0, 6)
        .map((plan) => Number(plan.budget) || 0),
      1
    );
  }, [plans]);

  /* =======================================================
     STARTUP JOURNEY
  ======================================================= */

  const journeySteps = [
    {
      title: 'Idea',
      icon: 'bulb',
      description: 'Define your startup idea',
      completed: plans.length > 0,
    },
    {
      title: 'Plan',
      icon: 'file',
      description: 'Create your business plan',
      completed: plans.length > 0,
    },
    {
      title: 'Validate',
      icon: 'target',
      description: 'Understand your market',
      completed: plans.length >= 2,
    },
    {
      title: 'Build',
      icon: 'rocket',
      description: 'Create your MVP',
      completed: false,
    },
    {
      title: 'Launch',
      icon: 'zap',
      description: 'Take your idea to users',
      completed: false,
    },
  ];

  const completedSteps = journeySteps.filter(
    (step) => step.completed
  ).length;

  const currentStep = Math.min(
    completedSteps + 1,
    journeySteps.length
  );

  /* =======================================================
     DELETE PLAN
  ======================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Delete this business plan? This cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await planService.deletePlan(id);

      setPlans((previous) =>
        previous.filter((plan) => plan._id !== id)
      );

      toast.success('Plan deleted');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not delete plan.'
      );
    }
  };

  /* =======================================================
     DUPLICATE PLAN
  ======================================================= */

  const handleDuplicate = async (id) => {
    try {
      const newPlan = await planService.duplicatePlan(id);

      setPlans((previous) => [
        newPlan,
        ...previous,
      ]);

      toast.success('Plan duplicated');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not duplicate plan.'
      );
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <LoadingSpinner label="Loading your dashboard..." />
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={load}
      />
    );
  }

  /* =======================================================
     DASHBOARD UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-purple-200/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 sm:p-8 lg:p-10 shadow-xl">

          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 right-32 w-64 h-64 rounded-full bg-white/5" />

          <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold mb-5">
                <Icon name="sparkle" size={15} />
                AI-powered startup planning
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Turn your idea into
                <span className="block text-violet-100">
                  a real business 🚀
                </span>
              </h1>

              <p className="mt-4 text-violet-100 text-sm sm:text-base max-w-xl leading-7">
                Welcome back,{' '}
                <span className="font-bold text-white">
                  {user?.name?.split(' ')[0] || 'Founder'}
                </span>
                . Build smarter plans, understand your market,
                and move your startup forward with AI.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">

                <Link to="/plans/new">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-violet-700 font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <Icon name="plus" size={18} />
                    Create New Plan
                  </button>
                </Link>

                <Link to="/plans">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
                  >
                    View My Plans
                    <Icon name="arrow" size={17} />
                  </button>
                </Link>

              </div>
            </div>

            {/* HERO VISUAL */}

            <div className="hidden lg:flex relative w-64 h-52 items-center justify-center">

              <div className="absolute w-44 h-44 rounded-full bg-white/10" />

              <div className="relative w-36 h-36 rounded-3xl bg-white/15 border border-white/20 flex flex-col items-center justify-center text-white shadow-2xl rotate-3">

                <div className="text-4xl">
                  ✦
                </div>

                <span className="mt-3 text-xs font-bold">
                  AI BUSINESS
                </span>

                <span className="text-xs text-violet-100">
                  PLANNER
                </span>

              </div>

              <div className="absolute top-3 right-3 w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white -rotate-6 text-xl">
                💡
              </div>

              <div className="absolute bottom-4 left-2 w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white rotate-6 text-xl">
                📈
              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

          {/* TOTAL PLANS */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <Icon name="file" size={22} />
              </div>

              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Active
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              Total Plans
            </p>

            <p className="mt-1 text-3xl font-black text-slate-900">
              {stats.total}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Business ideas created
            </p>

          </div>

          {/* THIS MONTH */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Icon name="chart" size={21} />
              </div>

              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                New
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              Created This Month
            </p>

            <p className="mt-1 text-3xl font-black text-slate-900">
              {stats.thisMonth}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              New plans this month
            </p>

          </div>

          {/* AVERAGE BUDGET */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                ₹
              </div>

              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Budget
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              Average Budget
            </p>

            <p className="mt-1 text-2xl font-black text-slate-900">
              {formatINR(stats.averageBudget)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Across your plans
            </p>

          </div>

          {/* LATEST PLAN */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Icon name="clock" size={22} />
              </div>

              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Latest
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              Latest Plan
            </p>

            <p className="mt-1 text-lg font-black text-slate-900 truncate">
              {stats.latest?.title || 'No plans yet'}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Most recently created
            </p>

          </div>

        </section>

        {/* =================================================
            STARTUP JOURNEY
        ================================================= */}

        <section className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-6 sm:p-7">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                    🚀
                  </div>

                  <h2 className="text-xl font-black text-slate-900">
                    Your Startup Journey
                  </h2>

                </div>

                <p className="text-sm text-slate-500 mt-2">
                  Move your idea from concept to launch.
                </p>

              </div>

              <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-2 rounded-full">
                Step {currentStep} of 5
              </span>

            </div>

            {/* JOURNEY */}

            <div className="mt-8 overflow-x-auto pb-2">

              <div className="min-w-[720px]">

                <div className="relative">

                  {/* BASE LINE */}

                  <div className="absolute top-6 left-10 right-10 h-1 bg-slate-100 rounded-full" />

                  {/* PROGRESS LINE */}

                  <div
                    className="absolute top-6 left-10 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all"
                    style={{
                      width:
                        completedSteps === 0
                          ? '0%'
                          : `${Math.min(
                              completedSteps * 25,
                              100
                            )}%`,
                    }}
                  />

                  <div className="relative grid grid-cols-5 gap-4">

                    {journeySteps.map((step, index) => (
                      <div
                        key={step.title}
                        className="flex flex-col items-center text-center"
                      >

                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-md z-10 ${
                            step.completed
                              ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white'
                              : index === completedSteps
                              ? 'bg-violet-50 text-violet-600 border-violet-100'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {step.completed ? (
                            <Icon
                              name="check"
                              size={22}
                            />
                          ) : (
                            <span className="text-lg">
                              {step.icon === 'bulb'
                                ? '💡'
                                : step.icon === 'file'
                                ? '▣'
                                : step.icon === 'target'
                                ? '🎯'
                                : step.icon === 'rocket'
                                ? '🚀'
                                : '⚡'}
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm font-bold text-slate-800">
                          {step.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400 max-w-[120px]">
                          {step.description}
                        </p>

                      </div>
                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            CHARTS
        ================================================= */}

        {plans.length > 0 && (
          <section className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-8">

            {/* PLANNING ACTIVITY */}

            <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-start justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      📊
                    </div>

                    <h3 className="font-black text-slate-900">
                      Planning Activity
                    </h3>

                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Number of business plans created over time
                  </p>

                </div>

                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-600">
                  Last 6 periods
                </span>

              </div>

              {/* CSS BAR / TREND CHART */}

              <div className="h-64 mt-8 flex items-end gap-3 border-b border-slate-100 px-2">

                {trendData.length > 0 ? (
                  trendData.map((item, index) => {

                    const highest =
                      Math.max(
                        ...trendData.map(
                          (entry) => entry.count
                        ),
                        1
                      );

                    const height =
                      (item.count / highest) * 85;

                    return (
                      <div
                        key={`${item.month}-${index}`}
                        className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                      >

                        <span className="text-xs font-bold text-slate-600">
                          {item.count}
                        </span>

                        <div
                          className="w-full max-w-14 rounded-t-xl bg-gradient-to-t from-violet-600 to-blue-500 transition-all hover:from-violet-700 hover:to-blue-600"
                          style={{
                            height: `${Math.max(
                              height,
                              8
                            )}%`,
                          }}
                          title={`${item.count} plan(s)`}
                        />

                        <span className="text-[10px] text-slate-400">
                          {item.month}
                        </span>

                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-sm text-slate-400 pb-10">
                    No activity data yet.
                  </div>
                )}

              </div>

            </div>

            {/* BUDGET OVERVIEW */}

            <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                    ₹
                  </div>

                  <h3 className="font-black text-slate-900">
                    Budget Overview
                  </h3>

                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Budget across recent plans
                </p>

              </div>

              <div className="mt-7 space-y-5">

                {plans.slice(0, 5).map((plan) => {

                  const budget =
                    Number(plan.budget) || 0;

                  const percentage =
                    Math.max(
                      4,
                      (budget / maxBudget) * 100
                    );

                  return (
                    <div key={plan._id}>

                      <div className="flex items-center justify-between gap-3">

                        <span className="text-xs font-semibold text-slate-600 truncate">
                          {plan.title || 'Plan'}
                        </span>

                        <span className="text-xs font-black text-slate-800 whitespace-nowrap">
                          {formatINR(budget)}
                        </span>

                      </div>

                      <div className="mt-2 h-2.5 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            AI ASSISTANT + QUICK ACTIONS
        ================================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

          {/* AI ASSISTANT */}

          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-6 sm:p-7 shadow-xl">

            <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-violet-500/20 blur-2xl" />

            <div className="absolute -left-20 -bottom-20 w-56 h-56 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="relative z-10">

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-violet-300 text-xl">
                    ✦
                  </div>

                  <div>

                    <p className="text-white font-black">
                      AI Business Assistant
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Your startup planning companion
                    </p>

                  </div>

                </div>

                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1.5 rounded-full">
                  AI Ready
                </span>

              </div>

              <div className="mt-7 rounded-2xl bg-white/5 border border-white/10 p-5">

                <p className="text-sm text-slate-300 leading-6">

                  {plans.length === 0
                    ? 'Start by creating your first business plan. I can help you structure your idea, target customers, budget and growth strategy.'
                    : `You have created ${
                        stats.total
                      } business ${
                        stats.total === 1
                          ? 'plan'
                          : 'plans'
                      }. Keep improving your ideas and validate the assumptions behind your business.`}

                </p>

              </div>

              <div className="flex flex-wrap gap-3 mt-5">

                <Link to="/plans/new">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-bold hover:bg-violet-50 transition-all"
                  >
                    ✦ Create with AI
                  </button>
                </Link>

                <Link to="/plans">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-all"
                  >
                    Explore Plans
                    <span>›</span>
                  </button>
                </Link>

              </div>

            </div>

          </div>

          {/* QUICK ACTIONS */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-black text-slate-900">
                  Quick Actions
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Keep building
                </p>

              </div>

              <span className="text-violet-500 text-xl">
                ⚡
              </span>

            </div>

            <div className="space-y-3 mt-6">

              {/* NEW PLAN */}

              <Link
                to="/plans/new"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-violet-50 hover:bg-violet-100 transition-colors group"
              >

                <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center text-xl">
                  +
                </div>

                <div className="flex-1">

                  <p className="text-sm font-bold text-slate-800">
                    New Business Plan
                  </p>

                  <p className="text-xs text-slate-400">
                    Generate with AI
                  </p>

                </div>

                <span className="text-xl text-slate-300 group-hover:text-violet-500">
                  ›
                </span>

              </Link>

              {/* MY PLANS */}

              <Link
                to="/plans"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors group"
              >

                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  ▣
                </div>

                <div className="flex-1">

                  <p className="text-sm font-bold text-slate-800">
                    My Plans
                  </p>

                  <p className="text-xs text-slate-400">
                    Manage your plans
                  </p>

                </div>

                <span className="text-xl text-slate-300 group-hover:text-blue-500">
                  ›
                </span>

              </Link>

              {/* PROFILE */}

              <Link
                to="/profile"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-colors group"
              >

                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  🎯
                </div>

                <div className="flex-1">

                  <p className="text-sm font-bold text-slate-800">
                    Your Profile
                  </p>

                  <p className="text-xs text-slate-400">
                    Update your details
                  </p>

                </div>

                <span className="text-xl text-slate-300 group-hover:text-emerald-500">
                  ›
                </span>

              </Link>

            </div>

          </div>

        </section>

        {/* =================================================
            RECENT PLANS
        ================================================= */}

        <section className="mt-10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-2xl font-black text-slate-900">
                  Recent Plans
                </h2>

                {plans.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-600 text-xs font-bold">
                    {plans.length}
                  </span>
                )}

              </div>

              <p className="text-sm text-slate-400 mt-1">
                Your latest business ideas and plans
              </p>

            </div>

            {plans.length > 0 && (
              <Link
                to="/plans"
                className="inline-flex items-center gap-1 text-sm font-bold text-violet-600 hover:text-violet-700"
              >
                View all plans
                <span className="text-lg">
                  ›
                </span>
              </Link>
            )}

          </div>

          <div className="mt-5">

            {/* EMPTY */}

            {plans.length === 0 ? (

              <div className="bg-white rounded-3xl border border-slate-200 p-8">

                <EmptyState
                  title="Your startup journey starts here 🚀"
                  description="Create your first AI-generated business plan and turn your idea into an actionable roadmap."
                  action={
                    <Link to="/plans/new">
                      <Button>
                        Create your first plan
                      </Button>
                    </Link>
                  }
                />

              </div>

            ) : (

              /* PLANS */

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {plans.slice(0, 6).map((plan) => (

                  <div
                    key={plan._id}
                    className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >

                    {/* TOP GRADIENT */}

                    <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500" />

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600 flex items-center justify-center text-xl">
                          ▣
                        </div>

                        <div className="relative group/menu">

                          <button
                            type="button"
                            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors text-xl"
                            title="Plan options"
                          >
                            ⋯
                          </button>

                          {/* SMALL OPTIONS */}

                          <div className="hidden group-focus-within/menu:block absolute right-0 top-10 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">

                            <button
                              type="button"
                              onClick={() =>
                                handleDuplicate(
                                  plan._id
                                )
                              }
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
                            >
                              Duplicate
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  plan._id
                                )
                              }
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      </div>

                      <h3 className="mt-5 text-lg font-black text-slate-900 line-clamp-2">
                        {plan.title ||
                          'Untitled Business Plan'}
                      </h3>

                      <div className="flex items-center gap-2 mt-3">

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                          ✓ Complete
                        </span>

                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-5">

                        {/* BUDGET */}

                        <div className="rounded-2xl bg-slate-50 p-3">

                          <p className="text-[11px] text-slate-400">
                            Budget
                          </p>

                          <p className="mt-1 text-sm font-black text-slate-800">
                            {formatINR(
                              Number(
                                plan.budget
                              ) || 0
                            )}
                          </p>

                        </div>

                        {/* CREATED */}

                        <div className="rounded-2xl bg-slate-50 p-3">

                          <p className="text-[11px] text-slate-400">
                            Created
                          </p>

                          <p className="mt-1 text-sm font-black text-slate-800">
                            {formatDate(
                              plan.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

                        <Link
                          to={`/plans/${plan._id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-700"
                        >
                          Open plan
                          <span>↗</span>
                        </Link>

                        <span className="text-xs text-slate-400">
                          AI generated
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

        {/* =================================================
            FOOTER MOTIVATION
        ================================================= */}

        <section className="mt-10 mb-4">

          <div className="rounded-3xl bg-gradient-to-r from-violet-50 via-blue-50 to-emerald-50 border border-white p-6 sm:p-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white shadow-sm flex items-center justify-center text-violet-600 text-xl">
                  ✦
                </div>

                <div>

                  <h3 className="font-black text-slate-900">
                    Great businesses start with a clear plan.
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                    Keep validating your idea, understanding
                    your customers and improving your business
                    strategy.
                  </p>

                </div>

              </div>

              <Link to="/plans/new">

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Build Your Next Plan
                  <span>↗</span>
                </button>

              </Link>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}