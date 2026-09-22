import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = 'text-sm font-medium text-slate-600 hover:text-brand-700 transition-colors';

  const appLinks = [
    ['/dashboard', 'Dashboard'],
    ['/plans/new', 'Create Plan'],
    ['/plans', 'My Plans'],
  ];
  const publicLinks = [
    ['/#features', 'Features'],
    ['/#how-it-works', 'How It Works'],
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Rocket className="h-4 w-4" />
          </span>
          StartupHub
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              {appLinks.map(([to, label]) => <Link key={to} to={to} className={linkClass}>{label}</Link>)}
              <Link to="/profile" className={linkClass}>Profile</Link>
              <button onClick={handleLogout} className="text-sm font-semibold px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-700 transition-colors">
                Log out
              </button>
            </>
          ) : (
            <>
              {publicLinks.map(([to, label]) => <a key={to} href={to} className={linkClass}>{label}</a>)}
              <Link to="/login" className={linkClass}>Log in</Link>
              <Link to="/register" className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors">
                Get Started
              </Link>
            </>
          )}
        </nav>

        <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 px-4 py-4 flex flex-col gap-4 bg-white">
          {user ? (
            <>
              {appLinks.map(([to, label]) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className={linkClass}>{label}</Link>
              ))}
              <Link to="/profile" onClick={() => setOpen(false)} className={linkClass}>Profile</Link>
              <button onClick={handleLogout} className="text-left text-sm font-semibold text-red-600">Log out</button>
            </>
          ) : (
            <>
              {publicLinks.map(([to, label]) => (
                <a key={to} href={to} onClick={() => setOpen(false)} className={linkClass}>{label}</a>
              ))}
              <Link to="/login" onClick={() => setOpen(false)} className={linkClass}>Log in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className={linkClass}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
