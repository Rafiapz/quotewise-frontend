import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, LogIn, Menu, Layers } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';

export interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
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
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors -ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Mobile brand mark */}
        <div className="flex items-center space-x-2 md:hidden">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Layers className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-sm">QuoteWise</span>
        </div>

        {/* Desktop title */}
        <div className="hidden md:block text-sm font-semibold text-slate-700">
          Workspace Overview
        </div>
      </div>

      {/* Right: Actions and User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          type="button"
          aria-label="Notifications"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center space-x-2.5 sm:space-x-3 pl-2.5 sm:pl-4 border-l border-slate-200">
            <div
              className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0"
              title={`${user.companyName} (${user.email})`}
            >
              {initials}
            </div>
            <div className="text-left hidden lg:block max-w-[160px]">
              <div className="text-xs font-semibold text-slate-800 leading-tight truncate">
                {user.companyName}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight truncate">
                {user.email}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="pl-2.5 sm:pl-4 border-l border-slate-200">
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
