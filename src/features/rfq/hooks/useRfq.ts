import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchRfqsThunk,
  fetchRfqByIdThunk,
  createRfqThunk,
  deleteRfqThunk,
  setSearchQuery,
  setFilterStatus,
  clearRfqError,
} from '../store/rfqSlice';
import {
  type CreateRfqInput,
  type RfqFilterParams,
  type RfqStatus,
} from '../types/rfq.types';

export const useRfq = () => {
  const dispatch = useAppDispatch();
  const { rfqs, selectedRfq, isLoading, isSubmitting, error, searchQuery, filterStatus } =
    useAppSelector((state) => state.rfq);

  const fetchRfqs = useCallback(
    async (params?: RfqFilterParams) => {
      await dispatch(fetchRfqsThunk(params));
    },
    [dispatch]
  );

  const fetchRfqById = useCallback(
    async (id: string) => {
      await dispatch(fetchRfqByIdThunk(id));
    },
    [dispatch]
  );

  const createRfq = useCallback(
    async (payload: CreateRfqInput) => {
      const action = await dispatch(createRfqThunk(payload));
      return createRfqThunk.fulfilled.match(action);
    },
    [dispatch]
  );

  const deleteRfq = useCallback(
    async (id: string) => {
      const action = await dispatch(deleteRfqThunk(id));
      return deleteRfqThunk.fulfilled.match(action);
    },
    [dispatch]
  );

  const updateSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const updateFilterStatus = useCallback(
    (status: RfqStatus | 'ALL') => {
      dispatch(setFilterStatus(status));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearRfqError());
  }, [dispatch]);

  return {
    rfqs,
    selectedRfq,
    isLoading,
    isSubmitting,
    error,
    searchQuery,
    filterStatus,
    fetchRfqs,
    fetchRfqById,
    createRfq,
    deleteRfq,
    updateSearchQuery,
    updateFilterStatus,
    clearError,
  };
};
