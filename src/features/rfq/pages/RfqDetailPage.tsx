import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Package,
  Plus,
  Clock,
  Layers,
  Award,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  Trash2,
  Search,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useRfq } from '../hooks/useRfq';
import { useQuotations } from '../../quotations/hooks/useQuotations';
import { QuotationCard } from '../../quotations/components/QuotationCard';
import { AddQuoteModal } from '../../quotations/components/AddQuoteModal';
import { DeleteRfqModal } from '../components/DeleteRfqModal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Pagination } from '../../../components/ui/Pagination';
import { useDebounce } from '../../../hooks/useDebounce';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { getRfqStatusBadgeVariant } from '../utils/rfq.utils';

export const RfqDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedRfq, isLoading: isRfqLoading, error: rfqError, fetchRfqById, deleteRfq } = useRfq();
  const {
    quotations,
    pagination,
    lowestUnitPrice,
    searchQuery,
    isLoading: isQuotesLoading,
    fetchByRfq,
    setSearch,
    setPage,
  } = useQuotations();

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearch = useDebounce(searchInput, 350);

  // Sync debounced search to redux state
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, searchQuery, setSearch]);

  // Load RFQ details
  useEffect(() => {
    if (id) {
      fetchRfqById(id);
    }
  }, [id, fetchRfqById]);

  // Load quotations with backend search & pagination
  const loadQuotations = useCallback(() => {
    if (id) {
      fetchByRfq(id, {
        page: pagination.page,
        limit: pagination.limit || 6,
        search: searchQuery || undefined,
      });
    }
  }, [id, fetchByRfq, pagination.page, pagination.limit, searchQuery]);

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  const handleDeleteRfq = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      const success = await deleteRfq(id);
      if (success) {
        toast.success(`RFQ ${selectedRfq?.partNumber || ''} and related quotations deleted successfully`);
        navigate('/rfqs');
      } else {
        toast.error('Failed to delete RFQ');
      }
    } catch {
      toast.error('An unexpected error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  // Best quote is determined by lowestUnitPrice from the backend across all quotations
  const bestQuote = useMemo(() => {
    return quotations.find((q) => q.isBestPrice);
  }, [quotations]);

  if (isRfqLoading && !selectedRfq) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-32" />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (rfqError || !selectedRfq) {
    return (
      <div className="space-y-4">
        <Link
          to="/rfqs"
          className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to RFQs
        </Link>
        <div className="bg-white p-8 rounded-2xl border border-red-200 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">RFQ Not Found</h2>
          <p className="text-sm text-slate-500">
            {rfqError || 'The requested RFQ could not be loaded.'}
          </p>
        </div>
      </div>
    );
  }

  const rfqStatus = selectedRfq.status || 'OPEN';

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Link
          to="/rfqs"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to All RFQs
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (id) {
                fetchRfqById(id);
                loadQuotations();
              }
            }}
            disabled={isRfqLoading || isQuotesLoading}
            className="flex-1 sm:flex-initial text-xs text-slate-600"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${isRfqLoading || isQuotesLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isRfqLoading || isDeleting}
            className="flex-1 sm:flex-initial text-xs flex items-center justify-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete RFQ
          </Button>
        </div>
      </div>

      {/* RFQ Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-mono font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200/60">
                {selectedRfq.partNumber}
              </span>
              <Badge variant={getRfqStatusBadgeVariant(rfqStatus)} className="font-semibold">
                {rfqStatus}
              </Badge>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 tracking-tight break-words">
              {selectedRfq.description}
            </h1>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsQuoteModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 flex-shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Supplier Quote
          </Button>
        </div>

        {/* Spec Meta Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2 text-slate-600">
            <Package className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Quantity</p>
              <p className="font-bold text-slate-800 text-xs sm:text-sm">{selectedRfq.quantity.toLocaleString()} units</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-600">
            <Calendar className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Needed By</p>
              <p className="font-bold text-slate-800 text-xs sm:text-sm">{formatDate(selectedRfq.neededBy)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-600">
            <Clock className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Created On</p>
              <p className="font-bold text-slate-800 text-xs sm:text-sm">{formatDate(selectedRfq.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-600">
            <Layers className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <div>
              <p className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Total Quotes</p>
              <p className="font-bold text-slate-800 text-xs sm:text-sm">{pagination.total} bids</p>
            </div>
          </div>
        </div>

        {/* Best Price Highlight Banner */}
        {lowestUnitPrice !== undefined && lowestUnitPrice !== null && (
          <div className="p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-lg flex-shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-emerald-900 text-xs sm:text-sm">
                  Best Available Price: {formatCurrency(lowestUnitPrice)} / unit
                </p>
                <p className="text-emerald-700 text-[11px] sm:text-xs">
                  {bestQuote ? (
                    <>
                      Offered by <strong>{bestQuote.name}</strong> • Total order:{' '}
                      <strong>{formatCurrency(lowestUnitPrice * selectedRfq.quantity)}</strong>
                    </>
                  ) : (
                    <>
                      Lowest proposal across all supplier quotes • Total order:{' '}
                      <strong>{formatCurrency(lowestUnitPrice * selectedRfq.quantity)}</strong>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-center">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg uppercase tracking-wider text-[10px]">
                Lowest Bid
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Supplier Quotes Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Supplier Quotes (Bids)</h2>
            <p className="text-xs text-slate-500">
              Review price quotes, promised lead times, and quote validity dates in INR.
            </p>
          </div>
          {pagination.total > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="h-3.5 w-3.5" /> Add Another Quote
            </Button>
          )}
        </div>

        {/* Search Bar for Quotations */}
        {pagination.total > 0 || searchQuery ? (
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search supplier name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
        ) : null}

        {isQuotesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-7 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : quotations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center shadow-sm space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl mx-auto flex items-center justify-center">
              <TrendingDown className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {searchQuery ? 'No matching supplier quotes found' : 'No Supplier Quotes Yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different supplier name search query.'
                : 'No suppliers have submitted quotations for this RFQ yet. Add quotation proposals to compare prices and lead times.'}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setSearchInput('');
                  setSearch('');
                  setIsQuoteModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add First Supplier Quote
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotations.map((quote) => (
                <QuotationCard key={quote.id} quote={quote} quantity={selectedRfq.quantity} />
              ))}
            </div>

            {/* Quotations Pagination */}
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={(newPage) => setPage(newPage)}
              isLoading={isQuotesLoading}
            />
          </>
        )}
      </div>

      {/* Add Supplier Quote Modal */}
      {id && (
        <AddQuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          rfqId={id}
          partNumber={selectedRfq.partNumber}
          quantity={selectedRfq.quantity}
          onSuccess={() => {
            fetchRfqById(id);
            loadQuotations();
          }}
        />
      )}

      {/* Delete RFQ Confirmation Modal */}
      <DeleteRfqModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteRfq}
        partNumber={selectedRfq.partNumber}
        description={selectedRfq.description}
        quoteCount={pagination.total}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default RfqDetailPage;
