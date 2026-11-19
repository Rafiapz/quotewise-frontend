import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
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
          title="Quotations for this RFQ"
          description="No quotes have been submitted by suppliers for this request yet."
          action={
            <Button variant="primary" size="md" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Supplier Quote
            </Button>
          }
        />
      </div>
    </div>
  );
};
