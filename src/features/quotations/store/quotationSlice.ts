import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
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
};

export const fetchQuotationsByRfqThunk = createAsyncThunk<
  PaginatedQuotationsResponse,
  { rfqId: string; params?: QuotationFilterParams },
  { rejectValue: string }
>('quotations/fetchByRfq', async ({ rfqId, params }, { rejectWithValue }) => {
  try {
    const data = await quotationService.getByRfqId(rfqId, params);
    return data;
  } catch (error) {
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
  },
  extraReducers: (builder) => {
    // fetchQuotationsByRfqThunk
    builder
      .addCase(fetchQuotationsByRfqThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuotationsByRfqThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quotations = action.payload.data;
        state.pagination = action.payload.meta;
        state.lowestUnitPrice = action.payload.lowestUnitPrice;
      })
      .addCase(fetchQuotationsByRfqThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load quotations';
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
} = quotationSlice.actions;

export default quotationSlice.reducer;
