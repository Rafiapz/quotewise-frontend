import { useState, useCallback } from 'react';
import { type SupplierQuote, type QuotationFilterParams } from '../types/quotation.types';
import { quotationService } from '../services/quotation.service';

export const useQuotations = () => {
  const [quotations, setQuotations] = useState<SupplierQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotations = useCallback(async (params?: QuotationFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await quotationService.getAll(params);
      setQuotations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByRfq = useCallback(async (rfqId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await quotationService.getByRfqId(rfqId);
      setQuotations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotations for RFQ');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    quotations,
    isLoading,
    error,
    fetchQuotations,
    fetchByRfq,
  };
};
