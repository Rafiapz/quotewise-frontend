import React from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { type SupplierQuote } from '../types/quotation.types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export interface QuotationCardProps {
  quote: SupplierQuote;
}

export const QuotationCard: React.FC<QuotationCardProps> = ({ quote }) => {
  return (
    <Card className="border-slate-200 hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{quote.name}</h4>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(quote.unitPrice)}
            <span className="text-xs font-normal text-slate-500"> / unit</span>
          </p>
        </div>
        {quote.isBestPrice && (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Best Price
          </Badge>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
        <div className="flex items-center space-x-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Lead Time: {formatDate(quote.leadTime)}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Valid until: {formatDate(quote.validUntil)}</span>
        </div>
      </div>
    </Card>
  );
};
