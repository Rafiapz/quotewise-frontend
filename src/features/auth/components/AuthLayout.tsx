import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 sm:space-x-3 mb-5 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Layers className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">QuoteWise</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-5 sm:px-10 shadow-sm rounded-2xl border border-slate-200/80">
          {children}
        </div>
      </div>
    </div>
  );
};
