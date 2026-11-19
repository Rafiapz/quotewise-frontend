import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchQuotationsByRfqThunk,
  createQuotationThunk,
  setComparisonMetric,
  clearQuotationError,
} from '../store/quotationSlice';
import {
  type CreateQuotationInput,
} from '../types/quotation.types';

export const useQuotations = () => {
  const dispatch = useAppDispatch();
  const { quotations, isLoading, isSubmitting, error, comparisonMetric } =
    useAppSelector((state) => state.quotations);

  const fetchByRfq = useCallback(
    async (rfqId: string) => {
      await dispatch(fetchQuotationsByRfqThunk(rfqId));
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

  const updateComparisonMetric = useCallback(
    (metric: 'unitPrice' | 'leadTime') => {
      dispatch(setComparisonMetric(metric));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearQuotationError());
  }, [dispatch]);

  return {
    quotations,
    isLoading,
    isSubmitting,
    error,
    comparisonMetric,
    fetchByRfq,
    createQuotation,
    updateComparisonMetric,
    clearError,
  };
};
