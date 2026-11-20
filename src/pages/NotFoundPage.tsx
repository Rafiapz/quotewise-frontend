import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Layers,
  Home,
  ArrowLeft,
  FileQuestion,
  FileText,
  Search,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? '/rfqs' : '/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link
            to={isAuthenticated ? '/rfqs' : '/login'}
            className="flex items-center space-x-2.5 group"
          >
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

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to="/rfqs"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full text-center">
          {/* Card Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-10">
            {/* Visual Icon with pulsing accent */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                <FileQuestion className="h-10 w-10 sm:h-12 sm:w-12 stroke-[1.75]" />
              </div>
              <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                404
              </span>
            </div>

            {/* Typography */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Page Not Found
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
              We couldn't find the page or procurement resource you're looking for. The link may be broken or the RFQ may have been removed.
            </p>

            {/* Path indicator badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 font-mono mb-8 max-w-full overflow-hidden text-ellipsis">
              <span className="text-slate-400 select-none">Path:</span>
              <span className="truncate">{location.pathname}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleGoBack}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </Button>

              <Link
                to={isAuthenticated ? '/rfqs' : '/login'}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="md"
                  className="w-full inline-flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
                >
                  <Home className="h-4 w-4" />
                  <span>
                    {isAuthenticated ? 'Back to RFQ Dashboard' : 'Go to Sign In'}
                  </span>
                </Button>
              </Link>
            </div>

            {/* Suggested Helpful Links */}
            <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <Link
                to="/rfqs"
                className="p-3.5 rounded-xl border border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/40 transition-all group flex items-start space-x-3"
              >
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mt-0.5">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                    RFQs Directory
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Browse active requests for quotations
                  </div>
                </div>
              </Link>

              <Link
                to={isAuthenticated ? '/rfqs' : '/login'}
                className="p-3.5 rounded-xl border border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/40 transition-all group flex items-start space-x-3"
              >
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mt-0.5">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                    Supplier Quotations
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isAuthenticated && user
                      ? `Signed in as ${user.companyName}`
                      : 'Sign in to access your quotations'}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60">
        QuoteWise &copy; {new Date().getFullYear()} &bull; Procurement & Supplier Quotation Portal
      </footer>
    </div>
  );
};

export default NotFoundPage;
