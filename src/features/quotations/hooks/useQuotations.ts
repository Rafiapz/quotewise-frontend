import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchQuotationsByRfqThunk,
  createQuotationThunk,
  setQuotationSearch,
  setQuotationSort,
  setQuotationPage,
  setComparisonMetric,
  clearQuotationError,
  clearQuotations as clearQuotationsAction,
} from '../store/quotationSlice';
import {
  type CreateQuotationInput,
  type QuotationFilterParams,
} from '../types/quotation.types';

export const useQuotations = () => {
  const dispatch = useAppDispatch();
  const {
    quotations,
    pagination,
    lowestUnitPrice,
    searchQuery,
    sortBy,
    isLoading,
    isSubmitting,
    error,
    comparisonMetric,
  } = useAppSelector((state) => state.quotations);

  const fetchByRfq = useCallback(
    async (rfqId: string, params?: QuotationFilterParams) => {
      await dispatch(fetchQuotationsByRfqThunk({ rfqId, params }));
    },
    [dispatch]
  );

  const createQuotation = useCallback(
    async (payload: CreateQuotationInput) => {
      const action = await dispatch(createQuotationThunk(payload));
      return createQuotationThunk.fulfilled.match(action);
    },
    [dispatch]
  );

  const setSearch = useCallback(
    (search: string) => {
      dispatch(setQuotationSearch(search));
    },
    [dispatch]
  );

  const setSort = useCallback(
    (newSortBy: 'price_asc' | 'price_desc' | 'lead_asc' | 'recent') => {
      dispatch(setQuotationSort(newSortBy));
    },
    [dispatch]
  );

  const setPage = useCallback(
    (page: number) => {
      dispatch(setQuotationPage(page));
    },
    [dispatch]
  );

  const updateComparisonMetric = useCallback(
    (metric: 'unitPrice' | 'leadTime') => {
      dispatch(setComparisonMetric(metric));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearQuotationError());
  }, [dispatch]);

  const clearQuotations = useCallback(() => {
    dispatch(clearQuotationsAction());
  }, [dispatch]);

  return {
    quotations,
    pagination,
    lowestUnitPrice,
    searchQuery,
    sortBy,
    isLoading,
    isSubmitting,
    error,
    comparisonMetric,
    fetchByRfq,
    createQuotation,
    setSearch,
    setSort,
    setPage,
    updateComparisonMetric,
    clearError,
    clearQuotations,
  };
};
