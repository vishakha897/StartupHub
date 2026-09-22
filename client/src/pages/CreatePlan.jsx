import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as planService from '../services/planService';
import { useToast } from '../context/ToastContext';
import ConfigNotice from '../components/ConfigNotice';

/* =========================================================
   SIMPLE SVG ICONS
   We use inline SVG components so "svg" text cannot appear.
========================================================= */

const Icon = ({ name, size = 20, className = '' }) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  };

  switch (name) {
    case 'sparkles':
      return (
        <svg {...common}>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          <path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14z" />
          <path d="M5 14l.6 1.9L7.5 17l-1.9.6L5 19.5l-.6-1.9L2.5 17l1.9-.6L5 14z" />
        </svg>
      );

    case 'brain':
      return (
        <svg {...common}>
          <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.5A3.5 3.5 0 0 0 4 12a3.5 3.5 0 0 0 3 3.45V17a3 3 0 0 0 3 3h2" />
          <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.5a3.5 3.5 0 0 1 2 3.5 3.5 3.5 0 0 1-3 3.45V17a3 3 0 0 1-3 3h-2" />
          <path d="M9 8h1" />
          <path d="M14 8h1" />
          <path d="M8 12h2" />
          <path d="M14 12h2" />
          <path d="M10 16h4" />
          <path d="M12 4v16" />
        </svg>
      );

    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3l8 3v5c0 5.2-3.4 8.9-8 10-4.6-1.1-8-4.8-8-10V6l8-3z" />
          <path d="M8.5 12l2.3 2.3 4.7-4.7" />
        </svg>
      );

    case 'rocket':
      return (
        <svg {...common}>
          <path d="M14 4c2.5-2.5 5.5-2.5 6-2 .5.5.5 3.5-2 6l-5.5 5.5-4-4L14 4z" />
          <path d="M8.5 10.5L5 11l-2 2 5 1" />
          <path d="M13.5 15.5L13 19l-2 2-1-5" />
          <path d="M7 17c-1.5.5-2.5 1.5-3 3 1.5-.5 2.5-1.5 3-3z" />
          <circle cx="15.5" cy="6.5" r="1.5" />
        </svg>
      );

    case 'arrow-right':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );

    case 'arrow-left':
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="M11 18l-6-6 6-6" />
        </svg>
      );

    case 'check':
      return (
        <svg {...common}>
          <path d="M5 12l4 4L19 6" />
        </svg>
      );

    case 'lightbulb':
      return (
        <svg {...common}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M8.5 14.5C7.5 13.6 7 12.3 7 11a5 5 0 0 1 10 0c0 1.3-.5 2.6-1.5 3.5-.8.7-1.5 1.4-1.5 2.5h-4c0-1.1-.7-1.8-1.5-2.5z" />
        </svg>
      );

    case 'users':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20v-1a6 6 0 0 1 12 0v1" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          <path d="M18 14a5 5 0 0 1 3 4.5V20" />
        </svg>
      );

    case 'money':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10" />
          <path d="M15 9.5c-.6-.8-1.6-1.2-3-1.2-1.5 0-2.5.7-2.5 1.8 0 3 5.5 1.1 5.5 4.1 0 1.1-1 1.8-2.5 1.8-1.4 0-2.5-.4-3.1-1.2" />
        </svg>
      );

    case 'map':
      return (
        <svg {...common}>
          <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
          <path d="M9 3v15" />
          <path d="M15 6v15" />
        </svg>
      );

    case 'briefcase':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
          <path d="M10 12v2h4v-2" />
        </svg>
      );

    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case 'building':
      return (
        <svg {...common}>
          <path d="M4 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
          <path d="M16 9h3a1 1 0 0 1 1 1v11" />
          <path d="M8 7h4" />
          <path d="M8 11h4" />
          <path d="M8 15h4" />
          <path d="M8 21v-3h4v3" />
        </svg>
      );

    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 15l4-4 3 2 5-7" />
        </svg>
      );

    default:
      return null;
  }
};

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  businessName: '',
  businessIdea: '',
  budget: '',
  targetCustomers: '',
  industry: '',
  location: '',
  businessType: '',
  timeline: '',
  experienceLevel: '',
  goals: '',
  revenueModelPreference: '',
  competitors: '',
  uniqueAdvantage: '',
  planType: 'Modern Startup',
};

/* =========================================================
   PLAN TYPES
========================================================= */

const planTypes = [
  {
    id: 'Modern Startup',
    title: 'Modern Startup',
    description:
      'Balanced plan for building and launching a new business idea.',
    icon: 'rocket',
  },
  {
    id: 'Investor Ready',
    title: 'Investor Ready',
    description:
      'Focus on market opportunity, growth, revenue and funding.',
    icon: 'chart',
  },
  {
    id: 'Student Startup',
    title: 'Student Startup',
    description:
      'Simple and practical plan designed for college founders.',
    icon: 'lightbulb',
  },
  {
    id: 'Small Business',
    title: 'Small Business',
    description:
      'Focus on customers, operations, sales and profitability.',
    icon: 'building',
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CreatePlan() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);
  const [configMessage, setConfigMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors((previous) => ({
        ...previous,
        [key]: '',
      }));
    }
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!form.businessIdea.trim()) {
        newErrors.businessIdea =
          'Please describe your business idea.';
      } else if (form.businessIdea.trim().length < 10) {
        newErrors.businessIdea =
          'Please describe your idea in at least 10 characters.';
      }

      if (!form.industry.trim()) {
        newErrors.industry = 'Please enter your industry.';
      }

      if (!form.location.trim()) {
        newErrors.location = 'Please enter your location.';
      }
    }

    if (step === 2) {
      if (!form.targetCustomers.trim()) {
        newErrors.targetCustomers =
          'Please describe your target customers.';
      } else if (form.targetCustomers.trim().length < 3) {
        newErrors.targetCustomers =
          'Please provide a little more information about your customers.';
      }
    }

    if (step === 3) {
      const budgetNumber = Number(form.budget);

      if (!form.budget) {
        newErrors.budget = 'Please enter your startup budget.';
      } else if (
        Number.isNaN(budgetNumber) ||
        budgetNumber <= 0
      ) {
        newErrors.budget = 'Budget must be greater than 0.';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     NEXT STEP
  ======================================================= */

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((previous) => Math.min(previous + 1, 4));

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* =======================================================
     PREVIOUS STEP
  ======================================================= */

  const previousStep = () => {
    setCurrentStep((previous) => Math.max(previous - 1, 1));

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* =======================================================
     FINAL SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    if (!validateStep(2)) {
      setCurrentStep(2);
      return;
    }

    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    setGenerating(true);
    setConfigMessage('');

    try {
      const payload = {
        ...form,
        budget: Number(form.budget),
      };

      const data = await planService.generatePlan(payload);

      if (!data?.aiConfigured) {
        setConfigMessage(
          data?.message ||
            'AI is not configured. Please configure the AI service.'
        );
        return;
      }

      navigate('/plans/generated', {
        state: {
          planData: data.planData,
          input: data.input,
          suggestedTitle:
            data.suggestedTitle ||
            form.businessName ||
            'My Business Plan',
        },
      });
    } catch (error) {
      console.error('Generate plan error:', error);

      toast.error(
        error?.response?.data?.message ||
          'Unable to generate your business plan right now. Please try again.'
      );
    } finally {
      setGenerating(false);
    }
  };

  /* =======================================================
     STEPS
  ======================================================= */

  const steps = [
    {
      number: 1,
      title: 'Business',
      icon: 'lightbulb',
    },
    {
      number: 2,
      title: 'Customers',
      icon: 'users',
    },
    {
      number: 3,
      title: 'Business Model',
      icon: 'money',
    },
    {
      number: 4,
      title: 'Plan Type',
      icon: 'rocket',
    },
  ];

  const progress = `${currentStep * 25}%`;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-purple-200/20 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* =================================================
            HERO
        ================================================= */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 sm:p-8 shadow-xl shadow-purple-200">

          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-white/5" />

          <div className="relative z-10">

            <div className="flex items-center gap-2 text-violet-100 text-sm font-semibold">
              <Icon name="sparkles" size={17} />
              <span>AI Business Plan Builder</span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              Turn your idea into
              <span className="text-violet-200">
                {' '}a real business 🚀
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-violet-100 text-sm sm:text-base leading-6">
              Tell StartupHub about your idea, customers and goals.
              Our AI will use your information to create a practical
              business plan.
            </p>

            {/* HERO BADGES */}

            <div className="flex flex-wrap gap-3 mt-6">

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-semibold">
                <Icon name="brain" size={15} />
                <span>AI-powered</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-semibold">
                <Icon name="shield" size={15} />
                <span>Personalized</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-semibold">
                <Icon name="rocket" size={15} />
                <span>Action focused</span>
              </div>

            </div>
          </div>
        </div>

        {/* =================================================
            STEPPER
        ================================================= */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm mt-6 p-5 sm:p-7">

          <div className="relative">

            {/* Background progress line */}

            <div className="absolute left-5 right-5 top-5 h-1 bg-slate-100 rounded-full" />

            {/* Active progress line */}

            <div
              className="absolute left-5 top-5 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{
                width: `calc(${progress} - 40px)`,
              }}
            />

            <div className="relative grid grid-cols-4">

              {steps.map((step) => {
                const active = currentStep === step.number;
                const completed = currentStep > step.number;

                return (
                  <div
                    key={step.number}
                    className="flex flex-col items-center"
                  >

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border-4 border-white shadow-sm transition-all ${
                        active
                          ? 'bg-violet-600 text-white scale-110'
                          : completed
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {completed ? (
                        <Icon name="check" size={18} />
                      ) : (
                        <Icon name={step.icon} size={18} />
                      )}
                    </div>

                    <p
                      className={`mt-3 text-xs sm:text-sm font-bold ${
                        active || completed
                          ? 'text-violet-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </p>

                  </div>
                );
              })}

            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-xs font-semibold text-slate-400">
              STEP {currentStep} OF 4
            </span>
          </div>

        </div>

        {/* =================================================
            CONFIG MESSAGE
        ================================================= */}

        {configMessage && (
          <div className="mt-6">
            <ConfigNotice message={configMessage} />
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          {/* =================================================
              STEP 1
          ================================================= */}

          {currentStep === 1 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-6 sm:p-8">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                    <Icon name="lightbulb" size={23} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Tell us about your business
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Start with the basic identity of your startup.
                    </p>
                  </div>

                </div>

                <div className="mt-8 space-y-6">

                  {/* BUSINESS NAME */}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Business Name
                      <span className="text-slate-400 font-normal">
                        {' '}(optional)
                      </span>
                    </label>

                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(event) =>
                        updateField(
                          'businessName',
                          event.target.value
                        )
                      }
                      placeholder="e.g. StudyMate AI"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    />
                  </div>

                  {/* BUSINESS IDEA */}

                  <div>
                    <div className="flex justify-between items-center mb-2">

                      <label className="text-sm font-bold text-slate-700">
                        What is your business idea? *
                      </label>

                      <span className="text-xs text-slate-400">
                        {form.businessIdea.length}/500
                      </span>

                    </div>

                    <textarea
                      rows={5}
                      maxLength={500}
                      value={form.businessIdea}
                      onChange={(event) =>
                        updateField(
                          'businessIdea',
                          event.target.value
                        )
                      }
                      placeholder="Example: An AI study planner that creates personalized study schedules for college students based on their subjects, exams and available study time."
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        errors.businessIdea
                          ? 'border-red-400'
                          : 'border-slate-200'
                      } bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none`}
                    />

                    {errors.businessIdea && (
                      <p className="text-xs text-red-500 mt-2">
                        {errors.businessIdea}
                      </p>
                    )}

                  </div>

                  {/* INDUSTRY + LOCATION */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div>

                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Industry *
                      </label>

                      <div className="relative">

                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Icon name="briefcase" size={18} />
                        </div>

                        <input
                          type="text"
                          value={form.industry}
                          onChange={(event) =>
                            updateField(
                              'industry',
                              event.target.value
                            )
                          }
                          placeholder="Education, FinTech, Food..."
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                            errors.industry
                              ? 'border-red-400'
                              : 'border-slate-200'
                          } bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500`}
                        />

                      </div>

                      {errors.industry && (
                        <p className="text-xs text-red-500 mt-2">
                          {errors.industry}
                        </p>
                      )}

                    </div>

                    <div>

                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Location *
                      </label>

                      <div className="relative">

                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Icon name="map" size={18} />
                        </div>

                        <input
                          type="text"
                          value={form.location}
                          onChange={(event) =>
                            updateField(
                              'location',
                              event.target.value
                            )
                          }
                          placeholder="Jaipur, India"
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                            errors.location
                              ? 'border-red-400'
                              : 'border-slate-200'
                          } bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500`}
                        />

                      </div>

                      {errors.location && (
                        <p className="text-xs text-red-500 mt-2">
                          {errors.location}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* AI TIP */}

                  <div className="flex gap-3 p-4 rounded-2xl bg-violet-50 border border-violet-100">

                    <div className="text-violet-600 shrink-0 mt-0.5">
                      <Icon name="sparkles" size={19} />
                    </div>

                    <div>

                      <p className="text-sm font-bold text-violet-800">
                        AI Tip
                      </p>

                      <p className="text-xs text-violet-600 mt-1 leading-5">
                        Explain the problem your business solves,
                        who experiences that problem and what your
                        solution does differently.
                      </p>

                    </div>

                  </div>

                </div>
              </div>

              {/* STEP 1 BUTTON */}

              <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end">

                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-colors"
                >
                  <span>Continue</span>
                  <Icon name="arrow-right" size={17} />
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              STEP 2
          ================================================= */}

          {currentStep === 2 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-6 sm:p-8">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Icon name="users" size={23} />
                  </div>

                  <div>

                    <h2 className="text-xl font-black text-slate-900">
                      Understand your customers
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Tell AI who you want to serve and how you are different.
                    </p>

                  </div>

                </div>

                <div className="mt-8 space-y-6">

                  {/* TARGET CUSTOMERS */}

                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Target Customers *
                    </label>

                    <textarea
                      rows={4}
                      value={form.targetCustomers}
                      onChange={(event) =>
                        updateField(
                          'targetCustomers',
                          event.target.value
                        )
                      }
                      placeholder="Example: College students aged 18–25 who struggle with exam preparation and time management."
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        errors.targetCustomers
                          ? 'border-red-400'
                          : 'border-slate-200'
                      } bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none`}
                    />

                    {errors.targetCustomers && (
                      <p className="text-xs text-red-500 mt-2">
                        {errors.targetCustomers}
                      </p>
                    )}

                  </div>

                  {/* COMPETITORS */}

                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Known Competitors
                      <span className="text-slate-400 font-normal">
                        {' '}(optional)
                      </span>
                    </label>

                    <input
                      type="text"
                      value={form.competitors}
                      onChange={(event) =>
                        updateField(
                          'competitors',
                          event.target.value
                        )
                      }
                      placeholder="e.g. Notion, Google Calendar, MyStudyLife"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />

                  </div>

                  {/* UNIQUE ADVANTAGE */}

                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      What makes your idea different?
                    </label>

                    <textarea
                      rows={4}
                      value={form.uniqueAdvantage}
                      onChange={(event) =>
                        updateField(
                          'uniqueAdvantage',
                          event.target.value
                        )
                      }
                      placeholder="Example: The planner automatically adjusts the study schedule when a student misses a session."
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
                    />

                  </div>

                  {/* BUSINESS TYPE */}

                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Business Type
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                      {[
                        {
                          id: 'B2C',
                          title: 'B2C',
                          description: 'Business to Customer',
                        },
                        {
                          id: 'B2B',
                          title: 'B2B',
                          description: 'Business to Business',
                        },
                        {
                          id: 'B2B2C',
                          title: 'B2B2C',
                          description:
                            'Business to Business to Customer',
                        },
                      ].map((type) => {

                        const selected =
                          form.businessType === type.id;

                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() =>
                              updateField(
                                'businessType',
                                type.id
                              )
                            }
                            className={`p-4 rounded-2xl border text-left transition-all ${
                              selected
                                ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500/10'
                                : 'border-slate-200 hover:border-violet-300 bg-white'
                            }`}
                          >

                            <div className="flex items-center justify-between">

                              <span className="font-black text-slate-800">
                                {type.title}
                              </span>

                              {selected && (
                                <span className="text-violet-600">
                                  <Icon name="check" size={17} />
                                </span>
                              )}

                            </div>

                            <p className="text-xs text-slate-400 mt-1">
                              {type.description}
                            </p>

                          </button>
                        );
                      })}

                    </div>

                  </div>

                </div>
              </div>

              {/* STEP 2 BUTTONS */}

              <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between">

                <button
                  type="button"
                  onClick={previousStep}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-100"
                >
                  <Icon name="arrow-left" size={17} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700"
                >
                  <span>Continue</span>
                  <Icon name="arrow-right" size={17} />
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              STEP 3
          ================================================= */}

          {currentStep === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-6 sm:p-8">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Icon name="money" size={23} />
                  </div>

                  <div>

                    <h2 className="text-xl font-black text-slate-900">
                      Build your business model
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Give AI the financial and execution context.
                    </p>

                  </div>

                </div>

                <div className="mt-8 space-y-6">

                  {/* BUDGET */}

                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Startup Budget *
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={form.budget}
                        onChange={(event) =>
                          updateField(
                            'budget',
                            event.target.value
                          )
                        }
                        placeholder="15000"
                        className={`w-full pl-10 pr-4 py-4 rounded-xl border ${
                          errors.budget
                            ? 'border-red-400'
                            : 'border-slate-200'
                        } bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-lg font-bold`}
                      />

                    </div>

                    {errors.budget && (
                      <p className="text-xs text-red-500 mt-2">
                        {errors.budget}
                      </p>
                    )}

                  </div>

                  {/* REVENUE MODEL */}

                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Preferred Revenue Model
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                      {[
                        'Subscription',
                        'Freemium',
                        'One-time',
                        'Commission',
                      ].map((model) => {

                        const selected =
                          form.revenueModelPreference === model;

                        return (
                          <button
                            key={model}
                            type="button"
                            onClick={() =>
                              updateField(
                                'revenueModelPreference',
                                model
                              )
                            }
                            className={`px-3 py-4 rounded-2xl border text-sm font-bold transition-all ${
                              selected
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-slate-200 text-slate-600 hover:border-emerald-300'
                            }`}
                          >
                            {model}
                          </button>
                        );
                      })}

                    </div>

                  </div>

                  {/* TIMELINE + EXPERIENCE */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div>

                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Launch Timeline
                      </label>

                      <div className="relative">

                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Icon name="clock" size={18} />
                        </div>

                        <input
                          type="text"
                          value={form.timeline}
                          onChange={(event) =>
                            updateField(
                              'timeline',
                              event.target.value
                            )
                          }
                          placeholder="e.g. 3 months"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        />

                      </div>

                    </div>

                    <div>

                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Your Experience
                      </label>

                      <select
                        value={form.experienceLevel}
                        onChange={(event) =>
                          updateField(
                            'experienceLevel',
                            event.target.value
                          )
                        }
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      >

                        <option value="">
                          Select level
                        </option>

                        <option value="Beginner">
                          Beginner
                        </option>

                        <option value="Some experience">
                          Some experience
                        </option>

                        <option value="Experienced">
                          Experienced
                        </option>

                      </select>

                    </div>

                  </div>

                  {/* GOALS */}

                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Main Startup Goals
                    </label>

                    <textarea
                      rows={4}
                      value={form.goals}
                      onChange={(event) =>
                        updateField(
                          'goals',
                          event.target.value
                        )
                      }
                      placeholder="Example: Launch MVP in 3 months, get 500 users and reach ₹50,000 monthly revenue within the first year."
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
                    />

                  </div>

                </div>
              </div>

              {/* STEP 3 BUTTONS */}

              <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between">

                <button
                  type="button"
                  onClick={previousStep}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-100"
                >
                  <Icon name="arrow-left" size={17} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700"
                >
                  <span>Choose Plan Type</span>
                  <Icon name="arrow-right" size={17} />
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              STEP 4
          ================================================= */}

          {currentStep === 4 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-6 sm:p-8">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Icon name="rocket" size={23} />
                  </div>

                  <div>

                    <h2 className="text-xl font-black text-slate-900">
                      Choose your plan style
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Tell StartupHub what kind of business plan you want.
                    </p>

                  </div>

                </div>

                {/* PLAN TYPES */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

                  {planTypes.map((type) => {

                    const selected =
                      form.planType === type.id;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() =>
                          updateField(
                            'planType',
                            type.id
                          )
                        }
                        className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                          selected
                            ? 'border-violet-500 bg-violet-50 shadow-md'
                            : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm'
                        }`}
                      >

                        {selected && (
                          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center">
                            <Icon name="check" size={14} />
                          </div>
                        )}

                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            selected
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon
                            name={type.icon}
                            size={21}
                          />
                        </div>

                        <h3 className="mt-4 font-black text-slate-900">
                          {type.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 leading-5 pr-5">
                          {type.description}
                        </p>

                      </button>
                    );
                  })}

                </div>

                {/* FINAL PREVIEW */}

                <div className="mt-7 rounded-2xl bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 p-5">

                  <div className="flex gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white text-violet-600 shadow-sm flex items-center justify-center shrink-0">
                      <Icon name="sparkles" size={19} />
                    </div>

                    <div>

                      <h3 className="font-black text-slate-900">
                        Ready to generate your plan?
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 leading-5">
                        StartupHub AI will analyze your idea,
                        customers, budget, business model and goals
                        to create your personalized business plan.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* STEP 4 BUTTONS */}

              <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

                <button
                  type="button"
                  onClick={previousStep}
                  disabled={generating}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-100 disabled:opacity-50"
                >
                  <Icon name="arrow-left" size={17} />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={generating}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-violet-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
                >

                  {generating ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Creating Your AI Plan...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="sparkles" size={18} />
                      <span>Generate Business Plan</span>
                      <Icon name="arrow-right" size={17} />
                    </>
                  )}

                </button>

              </div>

            </div>
          )}

        </form>

        {/* =================================================
            TRUST MESSAGE
        ================================================= */}

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">

          <Icon name="shield" size={14} />

          <span>
            Your business information is used to personalize your plan.
          </span>

        </div>

      </div>
    </div>
  );
}