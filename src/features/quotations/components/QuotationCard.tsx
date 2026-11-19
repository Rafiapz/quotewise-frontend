import React from 'react';
import { Clock, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import { type SupplierQuote } from '../types/quotation.types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export interface QuotationCardProps {
  quote: SupplierQuote;
  quantity?: number;
}

export const QuotationCard: React.FC<QuotationCardProps> = ({ quote, quantity }) => {
  const leadTimeDisplay = quote.leadTimeDays !== undefined
    ? `${quote.leadTimeDays} days`
    : !isNaN(Number(quote.leadTime))
    ? `${quote.leadTime} days`
    : `${Math.max(1, Math.round((new Date(quote.leadTime).getTime() - new Date(quote.createdAt || Date.now()).getTime()) / 86400000))} days`;

  const totalCost = quantity ? quote.unitPrice * quantity : undefined;

  return (
    <Card className="border-slate-200 hover:border-slate-300 transition-all shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Supplier</span>
          <h4 className="text-base font-bold text-slate-900">{quote.name}</h4>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(quote.unitPrice)}
            </span>
            <span className="text-xs text-slate-500">/ unit (INR)</span>
          </div>
          {totalCost !== undefined && quantity !== undefined && (
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-slate-400" />
              Total for {quantity.toLocaleString()} units: <span className="font-semibold text-slate-700">{formatCurrency(totalCost)}</span>
            </p>
          )}
        </div>
        {quote.isBestPrice && (
          <Badge variant="success" className="flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Best Price
          </Badge>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-1.5">
          <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <span>Lead Time: <strong className="text-slate-800">{leadTimeDisplay}</strong></span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Calendar className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <span>Valid until: <strong className="text-slate-800">{formatDate(quote.validUntil)}</strong></span>
        </div>
      </div>
    </Card>
  );
};
