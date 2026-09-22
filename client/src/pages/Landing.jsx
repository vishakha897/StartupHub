import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, LineChart, ShieldCheck, FileText, Rocket, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const steps = [
  { icon: FileText, title: 'Describe your idea', desc: 'Tell us your business idea, budget, and who you\'re building it for.' },
  { icon: Sparkles, title: 'AI structures your plan', desc: 'Our AI turns that into a complete, realistic business plan with clear assumptions.' },
  { icon: Rocket, title: 'Save, refine, and act', desc: 'Save it, edit it, download a PDF, and follow the 30/60/90 day action plan.' },
];

const features = [
  { icon: Target, title: 'Grounded in your inputs', desc: 'Every recommendation is tied to your stated budget and target customers — not generic filler.' },
  { icon: LineChart, title: 'Illustrative financials', desc: 'Clearly labeled estimates and assumptions, never presented as guaranteed outcomes.' },
  { icon: ShieldCheck, title: 'Private by default', desc: 'Every plan is tied to your account — no one else can view, edit, or delete it.' },
  { icon: FileText, title: 'Export-ready', desc: 'Download a clean, professional PDF you can actually bring to a meeting.' },
];

const sections = [
  'Executive Summary', 'Problem & Solution', 'Target Market & Personas', 'Competitor Analysis',
  'Business & Revenue Model', 'Marketing & Sales Strategy', 'Operations Plan', 'Startup Budget',
  'Financial Estimates', 'Risk Analysis', '30/60/90 Day Action Plan', 'Key Performance Indicators',
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered business planning
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mt-6 leading-tight">
            Turn Your Business Idea<br />Into a Real Startup Plan
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            StartupHub uses AI to transform a raw idea, a budget, and a target customer into a
            structured, practical business plan — grounded in what you actually told it.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? '/plans/new' : '/register'} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors">
              Create Business Plan <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={user ? '/dashboard' : '/register'} className="px-7 py-3.5 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:border-slate-300 transition-colors">
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">How StartupHub Works</h2>
        <p className="text-slate-500 text-center mt-2">Three steps from idea to plan.</p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl2 bg-white border border-slate-100 shadow-card p-6">
              <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <s.icon className="h-5 w-5 text-brand-600" />
              </div>
              <p className="text-xs font-bold text-brand-500 mb-1">STEP {i + 1}</p>
              <h3 className="font-bold text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">Why StartupHub</h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl2 border border-slate-100 p-6">
                <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan sections */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">What's In Your Plan</h2>
        <p className="text-slate-500 text-center mt-2">Every generated plan covers the sections investors and mentors expect.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {sections.map((s) => (
            <span key={s} className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">{s}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Ready to structure your idea?</h2>
        <p className="text-slate-500 mt-2">It takes less than five minutes to get your first plan.</p>
        <Link to={user ? '/plans/new' : '/register'} className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors">
          Create Business Plan <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
