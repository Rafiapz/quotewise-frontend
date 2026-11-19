import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layers, FileText, DollarSign, LayoutDashboard } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/rfqs', label: 'RFQs', icon: FileText },
    { to: '/quotations', label: 'Quotations', icon: DollarSign },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-200 flex items-center space-x-3">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 tracking-tight text-lg">QuoteWise</h1>
          <p className="text-xs text-slate-500">RFQ & Quote Platform</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 text-xs text-slate-400">
        QuoteWise v0.1.0 &bull; Ready
      </div>
    </aside>
  );
};
