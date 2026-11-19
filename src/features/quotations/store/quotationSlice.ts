import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { quotationService } from '../services/quotation.service';
import {
  type SupplierQuote,
  type CreateQuotationInput,
} from '../types/quotation.types';

export interface QuotationState {
  quotations: SupplierQuote[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  comparisonMetric: 'unitPrice' | 'leadTime';
}

const initialState: QuotationState = {
  quotations: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  comparisonMetric: 'unitPrice',
};

export const fetchQuotationsByRfqThunk = createAsyncThunk<
  SupplierQuote[],
  string,
  { rejectValue: string }
>('quotations/fetchByRfq', async (rfqId, { rejectWithValue }) => {
  try {
    const data = await quotationService.getByRfqId(rfqId);
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
        state.quotations = action.payload;
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
      .addCase(createQuotationThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.quotations.push(action.payload);
      })
      .addCase(createQuotationThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to submit quotation';
      });
  },
});

export const { setComparisonMetric, clearQuotationError } = quotationSlice.actions;
export default quotationSlice.reducer;
