import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { logoutThunk } from '../../auth/store/authSlice';
import { rfqService } from '../services/rfq.service';
import {
  type RFQ,
  type CreateRfqInput,
  type RfqFilterParams,
  type RfqStatusFilter,
  type PaginatedRfqsResponse,
  type RfqStats,
} from '../types/rfq.types';
import { type PaginationMeta } from '../../../types/api';

export interface RfqState {
  rfqs: RFQ[];
  selectedRfq: RFQ | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  searchQuery: string;
  filterStatus: RfqStatusFilter;
  pagination: PaginationMeta;
  stats: RfqStats;
  currentRequestId: string | null;
}

const initialState: RfqState = {
  rfqs: [],
  selectedRfq: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  searchQuery: '',
  filterStatus: 'ALL',
  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
  stats: {
    total: 0,
    open: 0,
    quoted: 0,
    expired: 0,
  },
  currentRequestId: null,
};

export const fetchRfqsThunk = createAsyncThunk<
  PaginatedRfqsResponse,
  RfqFilterParams | undefined,
  { rejectValue: string }
>('rfq/fetchAll', async (params, { rejectWithValue, signal }) => {
  try {
    const data = await rfqService.getAll(params, signal);
    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      return rejectWithValue('cancelled');
    }
    const message = error instanceof Error ? error.message : 'Failed to fetch RFQs';
    return rejectWithValue(message);
  }
});

export const fetchRfqByIdThunk = createAsyncThunk<
  RFQ,
  string,
  { rejectValue: string }
>('rfq/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await rfqService.getById(id);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch RFQ details';
    return rejectWithValue(message);
  }
});

export const createRfqThunk = createAsyncThunk<
  RFQ,
  CreateRfqInput,
  { rejectValue: string }
>('rfq/create', async (payload, { rejectWithValue }) => {
  try {
    const data = await rfqService.create(payload);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create RFQ';
    return rejectWithValue(message);
  }
});

export const deleteRfqThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('rfq/delete', async (id, { rejectWithValue }) => {
  try {
    await rfqService.delete(id);
    return id;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete RFQ';
    return rejectWithValue(message);
  }
});

export const rfqSlice = createSlice({
  name: 'rfq',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.pagination.page = 1;
    },
    setFilterStatus: (state, action: PayloadAction<RfqStatusFilter>) => {
      state.filterStatus = action.payload;
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearRfqError: (state) => {
      state.error = null;
    },
    clearSelectedRfq: (state) => {
      state.selectedRfq = null;
    },
  },
  extraReducers: (builder) => {
    // fetchRfqsThunk
    builder
      .addCase(fetchRfqsThunk.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchRfqsThunk.fulfilled, (state, action) => {
        // Only accept data if this response matches the most recent request
        if (state.currentRequestId === action.meta.requestId) {
          state.isLoading = false;
          state.rfqs = action.payload.data;
          state.pagination = action.payload.meta;
          if (action.payload.stats) {
            state.stats = action.payload.stats;
          }
          state.currentRequestId = null;
        }
      })
      .addCase(fetchRfqsThunk.rejected, (state, action) => {
        if (action.payload === 'cancelled') {
          return;
        }
        if (state.currentRequestId === action.meta.requestId) {
          state.isLoading = false;
          state.error = action.payload || 'Failed to fetch RFQs';
          state.currentRequestId = null;
        }
      });

    // fetchRfqByIdThunk
    builder
      .addCase(fetchRfqByIdThunk.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        if (state.selectedRfq?.id !== action.meta.arg) {
          state.selectedRfq = null;
        }
      })
      .addCase(fetchRfqByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRfq = action.payload;
      })
      .addCase(fetchRfqByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch RFQ';
      });

    // createRfqThunk
    builder
      .addCase(createRfqThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createRfqThunk.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createRfqThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create RFQ';
      });

    // deleteRfqThunk
    builder
      .addCase(deleteRfqThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteRfqThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.rfqs = state.rfqs.filter((rfq) => rfq.id !== action.payload);
        if (state.selectedRfq?.id === action.payload) {
          state.selectedRfq = null;
        }
      })
      .addCase(deleteRfqThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to delete RFQ';
      })
      // Reset RFQ state on logout
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutThunk.fulfilled, () => {
        return initialState;
      });
  },
});

export const { setSearchQuery, setFilterStatus, setPage, clearRfqError, clearSelectedRfq } =
  rfqSlice.actions;
export default rfqSlice.reducer;
