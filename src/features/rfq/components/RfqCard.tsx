import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, ArrowRight, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { type RFQ } from '../types/rfq.types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { DeleteRfqModal } from './DeleteRfqModal';
import { useRfq } from '../hooks/useRfq';
import { getRfqStatusBadgeVariant } from '../utils/rfq.utils';
import { formatDate } from '../../../utils/formatters';

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
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {rfq.partNumber}
              </span>
              <h3 className="text-base font-semibold text-slate-800 mt-2">{rfq.description}</h3>
            </div>
            <Badge variant={getRfqStatusBadgeVariant(status)}>{status}</Badge>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4 text-slate-400" />
              <span>Qty: {rfq.quantity.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Needed by {formatDate(rfq.neededBy)}</span>
            </div>
          </div>
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
