import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        StartupHub © {new Date().getFullYear()} · Built with the MERN stack
      </footer>
    </div>
  );
}
