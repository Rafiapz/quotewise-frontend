import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.companyName
    ? user.companyName.slice(0, 2).toUpperCase()
    : 'QW';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between">
      <div className="text-sm font-semibold text-slate-700">
        Workspace
      </div>

      <div className="flex items-center space-x-4">
        <button
          aria-label="Notifications"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Bell className="h-5 w-5" />
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {user.companyName}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">
                {user.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="pl-4 border-l border-slate-200">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign in</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
