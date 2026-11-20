import React from 'react';
import { Clock, Calendar, TrendingUp, Award } from 'lucide-react';
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
  const isBest = Boolean(quote.isBestPrice);

  return (
    <Card
      className={`relative transition-all overflow-hidden ${
        isBest
          ? '!border-2 !border-emerald-500 ring-4 ring-emerald-500/20 shadow-md shadow-emerald-500/10 bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-white'
          : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow'
      }`}
    >
      {/* Top Highlighting Border Strip for Best Quote */}
      {isBest && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Supplier</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-0.5 truncate">{quote.name}</h4>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-2xl font-bold tracking-tight ${isBest ? 'text-emerald-700 font-extrabold' : 'text-slate-900'}`}>
              {formatCurrency(quote.unitPrice)}
            </span>
            <span className="text-xs text-slate-500">/ unit (INR)</span>
          </div>
          {totalCost !== undefined && quantity !== undefined && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-slate-400 flex-shrink-0" />
              <span>Total for {quantity.toLocaleString()} units:</span>
              <strong className={isBest ? 'text-emerald-800' : 'text-slate-800'}>
                {formatCurrency(totalCost)}
              </strong>
            </p>
          )}
        </div>

        {isBest && (
          <Badge variant="success" className="flex items-center gap-1.5 font-bold shadow-xs flex-shrink-0 py-1 px-2.5 bg-emerald-100 text-emerald-800 border-emerald-300">
            <Award className="h-3.5 w-3.5 text-emerald-700" /> Best Quote
          </Badge>
        )}
      </div>

      <div className={`mt-4 pt-3.5 border-t ${isBest ? 'border-emerald-100' : 'border-slate-100'} grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs text-slate-600`}>
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
