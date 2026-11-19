import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Search, ExternalLink } from 'lucide-react';
import { useQuotations } from '../hooks/useQuotations';
import { QuotationCard } from '../components/QuotationCard';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { EmptyState } from '../../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export const QuotationsPage: React.FC = () => {
  const { quotations, isLoading, error, fetchQuotations } = useQuotations();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const filteredQuotes = quotations.filter((q) =>
    q.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Supplier Quotations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare incoming bids, analyze unit prices, and select optimal lead times across all RFQs.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'cards' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grid Cards
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by supplier name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500">
          Showing {filteredQuotes.length} quotation{filteredQuotes.length === 1 ? '' : 's'}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <LoadingSpinner label="Loading quotations..." />
        </div>
      ) : filteredQuotes.length > 0 ? (
        viewMode === 'table' ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3.5">Supplier</th>
                    <th className="px-6 py-3.5">Unit Price</th>
                    <th className="px-6 py-3.5">Lead Time</th>
                    <th className="px-6 py-3.5">Valid Until</th>
                    <th className="px-6 py-3.5 text-right">Related RFQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{quote.supplierName}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {formatCurrency(quote.unitPrice)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{quote.leadTime} days</td>
                      <td className="px-6 py-4 text-slate-600">{formatDate(quote.validUntil)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/rfqs/${quote.rfqId}`}
                          className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          View RFQ <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.map((quote) => (
              <QuotationCard key={quote.id} quote={quote} />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <EmptyState
            icon={<DollarSign className="h-7 w-7" />}
            title={searchTerm ? 'No quotations match your search' : 'No quotations recorded yet'}
            description={
              searchTerm
                ? 'Try searching with a different supplier name.'
                : 'Supplier quotations submitted against open RFQs will appear here for comparison.'
            }
          />
        </div>
      )}
    </div>
  );
};
