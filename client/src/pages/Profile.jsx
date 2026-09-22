import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const handleSave = async (ev) => {
    ev.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error('Name must be at least 2 characters.');
      return;
    }
    setSaving(true);
    try {
      const updated = await authService.updateProfile({ name: name.trim() });
      updateUser(updated);
      localStorage.setItem('startuphub_user', JSON.stringify(updated));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Profile</h1>

      <Card className="p-8 mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="h-20 w-20 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-extrabold shrink-0">
          {initials}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-slate-500">{user.email}</p>
          <p className="text-sm text-slate-400 mt-1">Member since {formatDate(user.createdAt)}</p>
        </div>
      </Card>

      <Card className="p-8 mt-6">
        <h3 className="font-bold text-slate-900 mb-4">Update name</h3>
        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
          <Button type="submit" loading={saving}>Save</Button>
        </form>
        <p className="text-xs text-slate-400 mt-4">Email cannot be changed from this page for security reasons.</p>
      </Card>
    </div>
  );
}
