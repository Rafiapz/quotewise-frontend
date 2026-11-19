import { useState, useCallback } from 'react';
import { type RFQ, type RfqFilterParams } from '../types/rfq.types';
import { rfqService } from '../services/rfq.service';

export const useRfq = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRfqs = useCallback(async (params?: RfqFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await rfqService.getAll(params);
      setRfqs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RFQs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRfqById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await rfqService.getById(id);
      setSelectedRfq(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RFQ details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    rfqs,
    selectedRfq,
    isLoading,
    error,
    fetchRfqs,
    fetchRfqById,
  };
};
