import React from 'react';
import { Bell } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div className="text-sm font-medium text-slate-500">
        Workspace
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
          <span className="text-xs font-semibold text-slate-800">Procurement</span>
        </div>
      </div>
    </header>
  );
};
