import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Layers, FileText, Bell, LogOut, LogIn } from 'lucide-react';
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
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center space-x-5 sm:space-x-6">
          <Link to="/rfqs" className="flex items-center space-x-2.5 group">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg block leading-none">
                QuoteWise
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase hidden xs:block mt-0.5">
                RFQ Portal
              </span>
            </div>
          </Link>

          <nav className="flex items-center space-x-1 pl-4 border-l border-slate-200">
            <NavLink
              to="/rfqs"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <FileText className="h-3.5 w-3.5" />
              <span>RFQs</span>
            </NavLink>
          </nav>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            aria-label="Notifications"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-2.5 sm:space-x-3 pl-3 border-l border-slate-200">
              <div
                className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0"
                title={`${user.companyName} (${user.email})`}
              >
                {initials}
              </div>
              <div className="text-left hidden md:block max-w-[160px]">
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
            <div className="pl-3 border-l border-slate-200">
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
      </div>
    </header>
  );
};
