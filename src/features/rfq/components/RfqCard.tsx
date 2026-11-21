import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, ArrowRight, Trash2, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import { type RFQ } from '../types/rfq.types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { DeleteRfqModal } from './DeleteRfqModal';
import { useRfq } from '../hooks/useRfq';
import { getRfqStatusBadgeVariant } from '../utils/rfq.utils';
import { formatDate, formatCurrency } from '../../../utils/formatters';

export interface RfqCardProps {
  rfq: RFQ;
}

export const RfqCard: React.FC<RfqCardProps> = ({ rfq }) => {
  const { deleteRfq } = useRfq();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const status = rfq.status || 'OPEN';

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const success = await deleteRfq(rfq.id);
      if (success) {
        toast.success(`RFQ ${rfq.partNumber} and related quotations deleted successfully`);
        setIsDeleteModalOpen(false);
      } else {
        toast.error('Failed to delete RFQ');
      }
    } catch {
      toast.error('An unexpected error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="hover:border-slate-300 transition-all shadow-sm hover:shadow flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="inline-block text-sm sm:text-base font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                {rfq.partNumber}
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1.5 break-words line-clamp-2">
                {rfq.description}
              </p>
            </div>
            <Badge variant={getRfqStatusBadgeVariant(status)} className="flex-shrink-0">{status}</Badge>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>Qty: {rfq.quantity.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>Needed by {formatDate(rfq.neededBy)}</span>
            </div>
          </div>

          {rfq.bestQuote && (
            <div className="mt-3 p-2 bg-emerald-50/90 border border-emerald-200/90 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 min-w-0">
                <Award className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-[11px] text-emerald-700 font-medium">Best:</span>
                <span className="font-semibold text-emerald-900 truncate max-w-[120px] sm:max-w-[150px]">
                  {rfq.bestQuote.name}
                </span>
              </div>
              <span className="font-bold text-emerald-800 font-mono text-xs flex-shrink-0">
                {formatCurrency(rfq.bestQuote.unitPrice)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-red-600 transition-colors p-1 -ml-1 rounded hover:bg-red-50"
            title="Delete RFQ"
            aria-label="Delete RFQ"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </button>

          <Link
            to={`/rfqs/${rfq.id}`}
            className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View Details <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
      </Card>

      <DeleteRfqModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        partNumber={rfq.partNumber}
        description={rfq.description}
        quoteCount={rfq.quoteCount || rfq.quotes?.length || 0}
        isDeleting={isDeleting}
      />
    </>
  );
};
