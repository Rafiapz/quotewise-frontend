import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/common/EmptyState';

export const RfqListPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Requests for Quotation (RFQs)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your part requests, monitor supplier quotations, and select optimal bids.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="md" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="primary" size="md" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New RFQ
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <EmptyState
          title="No RFQs available yet"
          description="Create your first Request for Quotation to start inviting and managing supplier quotes."
          action={
            <Button variant="primary" size="md" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create RFQ
            </Button>
          }
        />
      </div>
    </div>
  );
};
