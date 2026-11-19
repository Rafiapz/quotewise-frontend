import apiClient from '../../../lib/axios';
import { type ApiResponse } from '../../../types/api';
import {
  type SupplierQuote,
  type CreateQuotationInput,
  type QuotationFilterParams,
} from '../types/quotation.types';

export const quotationService = {
  async getAll(params?: QuotationFilterParams): Promise<SupplierQuote[]> {
    const response = await apiClient.get<ApiResponse<SupplierQuote[]>>('/quotations', { params });
    return response.data.data;
  },

  async getByRfqId(rfqId: string): Promise<SupplierQuote[]> {
    const response = await apiClient.get<ApiResponse<SupplierQuote[]>>(`/rfqs/${rfqId}/quotations`);
    return response.data.data;
  },

  async create(payload: CreateQuotationInput): Promise<SupplierQuote> {
    const response = await apiClient.post<ApiResponse<SupplierQuote>>('/quotations', payload);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/quotations/${id}`);
  },
};
