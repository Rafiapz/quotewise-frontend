import apiClient from '../../../lib/axios';
import { type ApiResponse, type PaginatedApiResponse } from '../../../types/api';
import {
  type SupplierQuote,
  type CreateQuotationInput,
  type QuotationFilterParams,
  type PaginatedQuotationsResponse,
} from '../types/quotation.types';

export const quotationService = {
  async getAll(params?: QuotationFilterParams): Promise<SupplierQuote[]> {
    const response = await apiClient.get<ApiResponse<SupplierQuote[]>>('/quotations', { params });
    return response.data.data;
  },

  async getByRfqId(rfqId: string, params?: QuotationFilterParams): Promise<PaginatedQuotationsResponse> {
    const response = await apiClient.get<PaginatedApiResponse<SupplierQuote>>(`/rfqs/${rfqId}/quotations`, {
      params,
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
      lowestUnitPrice: response.data.lowestUnitPrice,
    };
  },

  async create(payload: CreateQuotationInput): Promise<SupplierQuote> {
    const response = await apiClient.post<ApiResponse<SupplierQuote>>('/quotations', payload);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/quotations/${id}`);
  },
};
