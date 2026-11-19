import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Layers, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useRfq } from '../hooks/useRfq';
import { RfqCard } from '../components/RfqCard';
import { CreateRfqModal } from '../components/CreateRfqModal';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useDebounce } from '../../../hooks/useDebounce';
import { type RfqStatusFilter } from '../types/rfq.types';

export const RfqListPage: React.FC = () => {
  const {
    rfqs,
    isLoading,
    error,
    pagination,
    stats,
    searchQuery,
    filterStatus,
    fetchRfqs,
    updateSearchQuery,
    updateFilterStatus,
    setPage,
  } = useRfq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearch = useDebounce(searchInput, 350);

  // Sync debounced search to redux query state
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      updateSearchQuery(debouncedSearch);
    }
  }, [debouncedSearch, searchQuery, updateSearchQuery]);

  // Load RFQs from backend whenever page, debounced query, or filter changes
  const loadData = useCallback(() => {
    fetchRfqs({
      page: pagination.page,
      limit: pagination.limit || 9,
      search: searchQuery || undefined,
      status: filterStatus,
    });
  }, [fetchRfqs, pagination.page, pagination.limit, searchQuery, filterStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = (status: RfqStatusFilter) => {
    updateFilterStatus(status);
    fetchRfqs({
      page: 1,
      limit: pagination.limit || 9,
      search: searchQuery || undefined,
      status,
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Requests for Quotation (RFQs)</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create part requests, solicit supplier bids, and compare quotations.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={loadData}
            disabled={isLoading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs text-slate-600"
            title="Refresh RFQs list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" /> Create New RFQ
          </Button>
        </div>
      </div>

      {/* Stats Cards (Aggregated server-side across all active records) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Total RFQs</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className="p-2 sm:p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Open for Bids</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{stats.open}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">With Quotations</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{stats.quoted}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search part # or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 sm:py-1.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['ALL', 'OPEN', 'QUOTED', 'EXPIRED'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* RFQ Grid / Loading / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm animate-pulse space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="h-5 bg-slate-200 rounded w-28" />
                <div className="h-5 bg-slate-200 rounded-full w-16" />
              </div>
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-20" />
                <div className="h-4 bg-slate-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : rfqs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            {searchQuery || filterStatus !== 'ALL'
              ? 'No matching RFQs found'
              : 'No RFQs created yet'}
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || filterStatus !== 'ALL'
              ? 'Try modifying your search term or status filter to see other requests.'
              : 'Create your first Request for Quotation to start inviting and comparing supplier bids.'}
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setSearchInput('');
                updateSearchQuery('');
                updateFilterStatus('ALL');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Create New RFQ
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rfqs.map((rfq) => (
              <RfqCard key={rfq.id} rfq={rfq} />
            ))}
          </div>

          {/* Backend Pagination Controls */}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Create RFQ Modal */}
      <CreateRfqModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
};
