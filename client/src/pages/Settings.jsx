import React from 'react';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  if (!user) return null;

  const setTheme = async (theme) => {
    // Applied immediately in the UI; also persisted to the account.
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      const updated = await authService.updateProfile({ theme });
      updateUser(updated);
      localStorage.setItem('startuphub_user', JSON.stringify(updated));
      toast.success(`Switched to ${theme} theme`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save theme preference.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Settings</h1>

      <Card className="p-8 mt-6">
        <h3 className="font-bold text-slate-900 mb-1">Theme preference</h3>
        <p className="text-sm text-slate-500 mb-4">Choose how StartupHub looks on this device.</p>
        <div className="flex gap-3">
          {['light', 'dark'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold border capitalize transition-colors ${
                user.theme === t ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-8 mt-6">
        <h3 className="font-bold text-slate-900 mb-3">Account information</h3>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between"><dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-800">{user.name}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-800">{user.email}</dd></div>
        </dl>
      </Card>

      <Card className="p-8 mt-6">
        <h3 className="font-bold text-slate-900 mb-2">Application information</h3>
        <p className="text-sm text-slate-500">StartupHub v1.0.0 — AI-Powered Startup Business Planning Platform.</p>
      </Card>
    </div>
  );
}
