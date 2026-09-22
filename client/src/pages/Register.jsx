import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Let's build your first plan.");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Card className="p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-500 mt-1">Turn your idea into a real plan with StartupHub.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input label="Full name" value={form.name} error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
          <Input label="Email" type="email" value={form.email} error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
          <Input label="Confirm password" type="password" value={form.confirm} error={errors.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat your password" />
          <Button type="submit" loading={submitting} className="w-full">Create account</Button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
