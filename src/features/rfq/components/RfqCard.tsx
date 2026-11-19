import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, ArrowRight } from 'lucide-react';
import { type RFQ } from '../types/rfq.types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { getRfqStatusBadgeVariant } from '../utils/rfq.utils';
import { formatDate } from '../../../utils/formatters';

export interface RfqCardProps {
  rfq: RFQ;
}

export const RfqCard: React.FC<RfqCardProps> = ({ rfq }) => {
  const status = rfq.status || 'OPEN';

  return (
    <Card className="hover:border-slate-300 transition-all shadow-sm hover:shadow">
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

      <div className="mt-4 flex justify-end">
        <Link
          to={`/rfqs/${rfq.id}`}
          className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
        >
          View Details <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </Card>
  );
};
