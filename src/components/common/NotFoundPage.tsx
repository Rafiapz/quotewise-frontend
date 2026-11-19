import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/rfqs">
        <Button variant="primary" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to RFQs
        </Button>
      </Link>
    </div>
  );
};
