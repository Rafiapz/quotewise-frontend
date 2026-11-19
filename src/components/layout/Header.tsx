import React from 'react';
import { Bell, Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search RFQs or quotations..."
          className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          aria-label="Notifications"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-sm">
            QW
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-800">Procurement Officer</div>
            <div className="text-[11px] text-slate-500">procurement@quotewise.io</div>
          </div>
        </div>
      </div>
    </header>
  );
};
