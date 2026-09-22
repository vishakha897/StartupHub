import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, FolderKanban, User, Settings } from 'lucide-react';

const links = [
  ['/dashboard', 'Dashboard', LayoutDashboard],
  ['/plans/new', 'Create Plan', FilePlus],
  ['/plans', 'My Plans', FolderKanban],
  ['/profile', 'Profile', User],
  ['/settings', 'Settings', Settings],
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-56 shrink-0 border-r border-slate-100 bg-white min-h-[calc(100vh-4rem)] py-6 px-3">
      <nav className="flex flex-col gap-1">
        {links.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
