import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
