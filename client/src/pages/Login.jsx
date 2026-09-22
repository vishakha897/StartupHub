import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Card className="p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-1">Log in to keep building your business plans.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input label="Email" type="email" value={form.email} error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          <Button type="submit" loading={submitting} className="w-full">Log in</Button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  );
}
