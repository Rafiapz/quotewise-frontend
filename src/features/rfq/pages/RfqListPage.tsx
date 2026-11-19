import React from 'react';
import { EmptyState } from '../../../components/common/EmptyState';

export const RfqListPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Requests for Quotation (RFQs)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your part requests and supplier bids.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <EmptyState
          title="No RFQs configured yet"
          description="RFQ feature modules are scaffolded and ready for implementation."
        />
      </div>
    </div>
  );
};
