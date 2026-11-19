import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EmptyState } from '../../../components/common/EmptyState';

export const RfqDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Link
          to="/rfqs"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">RFQ Details</h1>
          <p className="text-xs text-slate-500">ID: {id}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <EmptyState
          title="RFQ Detail View"
          description="Detailed view and supplier quote comparisons will be rendered here."
        />
      </div>
    </div>
  );
};
