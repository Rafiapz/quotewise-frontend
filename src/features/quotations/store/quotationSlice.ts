import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { quotationService } from '../services/quotation.service';
import {
  type SupplierQuote,
  type CreateQuotationInput,
  type QuotationFilterParams,
  type PaginatedQuotationsResponse,
} from '../types/quotation.types';
import { type PaginationMeta } from '../../../types/api';

export interface QuotationState {
  quotations: SupplierQuote[];
  pagination: PaginationMeta;
  lowestUnitPrice?: number;
  searchQuery: string;
  sortBy: 'price_asc' | 'price_desc' | 'lead_asc' | 'recent';
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  comparisonMetric: 'unitPrice' | 'leadTime';
  currentRequestId: string | null;
  currentRfqId: string | null;
}

const initialState: QuotationState = {
  quotations: [],
  pagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
  lowestUnitPrice: undefined,
  searchQuery: '',
  sortBy: 'price_asc',
  isLoading: false,
  isSubmitting: false,
  error: null,
  comparisonMetric: 'unitPrice',
  currentRequestId: null,
  currentRfqId: null,
};

export const fetchQuotationsByRfqThunk = createAsyncThunk<
  PaginatedQuotationsResponse,
  { rfqId: string; params?: QuotationFilterParams },
  { rejectValue: string }
>('quotations/fetchByRfq', async ({ rfqId, params }, { rejectWithValue, signal }) => {
  try {
    const data = await quotationService.getByRfqId(rfqId, params, signal);
    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      return rejectWithValue('cancelled');
    }
    const message = error instanceof Error ? error.message : 'Failed to fetch quotations';
    return rejectWithValue(message);
  }
});

export const createQuotationThunk = createAsyncThunk<
  SupplierQuote,
  CreateQuotationInput,
  { rejectValue: string }
>('quotations/create', async (payload, { rejectWithValue }) => {
  try {
    const data = await quotationService.create(payload);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create quotation';
    return rejectWithValue(message);
  }
});

export const quotationSlice = createSlice({
  name: 'quotations',
  initialState,
  reducers: {
    setQuotationSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.pagination.page = 1;
    },
    setQuotationSort: (
      state,
      action: PayloadAction<'price_asc' | 'price_desc' | 'lead_asc' | 'recent'>
    ) => {
      state.sortBy = action.payload;
      state.pagination.page = 1;
    },
    setQuotationPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setComparisonMetric: (state, action: PayloadAction<'unitPrice' | 'leadTime'>) => {
      state.comparisonMetric = action.payload;
    },
    clearQuotationError: (state) => {
      state.error = null;
    },
    clearQuotations: (state) => {
      state.quotations = [];
      state.pagination = { ...initialState.pagination };
      state.lowestUnitPrice = undefined;
      state.searchQuery = '';
      state.currentRfqId = null;
      state.currentRequestId = null;
    },
  },
  extraReducers: (builder) => {
    // fetchQuotationsByRfqThunk
    builder
      .addCase(fetchQuotationsByRfqThunk.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
        // If switching to a different RFQ, clear old quotations immediately
        if (state.currentRfqId !== action.meta.arg.rfqId) {
          state.quotations = [];
          state.lowestUnitPrice = undefined;
          state.currentRfqId = action.meta.arg.rfqId;
        }
      })
      .addCase(fetchQuotationsByRfqThunk.fulfilled, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.isLoading = false;
          state.quotations = action.payload.data;
          state.pagination = action.payload.meta;
          state.lowestUnitPrice = action.payload.lowestUnitPrice;
          state.currentRfqId = action.meta.arg.rfqId;
          state.currentRequestId = null;
        }
      })
      .addCase(fetchQuotationsByRfqThunk.rejected, (state, action) => {
        if (action.payload === 'cancelled') {
          return;
        }
        if (state.currentRequestId === action.meta.requestId) {
          state.isLoading = false;
          state.error = action.payload || 'Failed to load quotations';
          state.currentRequestId = null;
        }
      });

    // createQuotationThunk
    builder
      .addCase(createQuotationThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createQuotationThunk.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createQuotationThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to submit quotation';
      });
  },
});

export const {
  setQuotationSearch,
  setQuotationSort,
  setQuotationPage,
  setComparisonMetric,
  clearQuotationError,
  clearQuotations,
} = quotationSlice.actions;

export default quotationSlice.reducer;
