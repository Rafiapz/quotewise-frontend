import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchRfqsThunk,
  fetchRfqByIdThunk,
  createRfqThunk,
  deleteRfqThunk,
  setSearchQuery,
  setFilterStatus,
  setPage as setPageAction,
  clearRfqError,
  clearSelectedRfq,
} from '../store/rfqSlice';
import {
  type CreateRfqInput,
  type RfqFilterParams,
  type RfqStatusFilter,
} from '../types/rfq.types';

export const useRfq = () => {
  const dispatch = useAppDispatch();
  const {
    rfqs,
    selectedRfq,
    isLoading,
    isSubmitting,
    error,
    searchQuery,
    filterStatus,
    pagination,
    stats,
  } = useAppSelector((state) => state.rfq);

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
    (status: RfqStatusFilter) => {
      dispatch(setFilterStatus(status));
    },
    [dispatch]
  );

  const setPage = useCallback(
    (page: number) => {
      dispatch(setPageAction(page));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearRfqError());
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedRfq());
  }, [dispatch]);

  return {
    rfqs,
    selectedRfq,
    isLoading,
    isSubmitting,
    error,
    searchQuery,
    filterStatus,
    pagination,
    stats,
    fetchRfqs,
    fetchRfqById,
    createRfq,
    deleteRfq,
    updateSearchQuery,
    updateFilterStatus,
    setPage,
    clearError,
    clearSelectedRfq: clearSelected,
  };
};
