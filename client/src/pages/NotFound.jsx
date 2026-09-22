import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto text-center py-24 px-4">
      <div className="text-6xl mb-4">🧭</div>
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="text-slate-500 mt-2">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/">
        <Button className="mt-6">Back home</Button>
      </Link>
    </div>
  );
}
