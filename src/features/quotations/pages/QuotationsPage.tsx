import React, { useEffect, useState, useMemo } from 'react';
import { Search, IndianRupee, RefreshCw, AlertCircle } from 'lucide-react';
import { quotationService } from '../services/quotation.service';
import { type SupplierQuote } from '../types/quotation.types';
import { QuotationCard } from '../components/QuotationCard';
import { Button } from '../../../components/ui/Button';

export const QuotationsPage: React.FC = () => {
  const [quotes, setQuotes] = useState<SupplierQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'lead_asc' | 'recent'>('price_asc');

  const fetchQuotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await quotationService.getAll();
      setQuotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const filteredQuotes = useMemo(() => {
    return quotes
      .filter((q) => q.name.toLowerCase().includes(searchTerm.toLowerCase().trim()))
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.unitPrice - b.unitPrice;
        }
        if (sortBy === 'lead_asc') {
          const aDays = a.leadTimeDays ?? new Date(a.leadTime).getTime();
          const bDays = b.leadTimeDays ?? new Date(b.leadTime).getTime();
          return aDays - bDays;
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [quotes, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Supplier Quotations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare unit prices in INR, analyze supplier lead times, and monitor validity dates.
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={fetchQuotes}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-slate-600"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by supplier name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price_asc' | 'lead_asc' | 'recent')}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="price_asc">Lowest Unit Price (INR)</option>
            <option value="lead_asc">Shortest Lead Time</option>
            <option value="recent">Most Recently Submitted</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quotation List Grid */}
      {isLoading && quotes.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <IndianRupee className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            {searchTerm ? 'No matching supplier quotes' : 'No quotations recorded yet'}
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'Try adjusting your supplier search query.'
              : 'Open any RFQ from the RFQs list to start recording supplier quotation proposals.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuotes.map((quote) => (
            <QuotationCard key={quote.id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  );
};
