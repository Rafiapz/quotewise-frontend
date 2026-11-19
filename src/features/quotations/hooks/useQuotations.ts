import { useState, useCallback } from 'react';
import { type SupplierQuote, type CreateQuotationInput, type QuotationFilterParams } from '../types/quotation.types';
import { quotationService } from '../services/quotation.service';

export const useQuotations = () => {
  const [quotations, setQuotations] = useState<SupplierQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const createQuotation = useCallback(async (payload: CreateQuotationInput): Promise<SupplierQuote | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newQuote = await quotationService.create(payload);
      setQuotations((prev) => [newQuote, ...prev]);
      return newQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quotation');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteQuotation = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await quotationService.delete(id);
      setQuotations((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quotation');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    quotations,
    isLoading,
    isSubmitting,
    error,
    fetchQuotations,
    fetchByRfq,
    createQuotation,
    deleteQuotation,
  };
};
