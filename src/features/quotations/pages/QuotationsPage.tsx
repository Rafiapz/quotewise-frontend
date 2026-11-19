import React from 'react';
import { DollarSign } from 'lucide-react';
import { EmptyState } from '../../../components/common/EmptyState';

export const QuotationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Supplier Quotations</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review incoming quotations, compare pricing, and assess lead times.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <EmptyState
          icon={<DollarSign className="h-7 w-7" />}
          title="No quotations recorded yet"
          description="Supplier quotations will be displayed here for comparison once submitted."
        />
      </div>
    </div>
  );
};
