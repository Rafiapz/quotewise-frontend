import apiClient from '../../../lib/axios';
import { type ApiResponse, type PaginatedApiResponse } from '../../../types/api';
import {
  type RFQ,
  type CreateRfqInput,
  type UpdateRfqInput,
  type RfqFilterParams,
  type PaginatedRfqsResponse,
  type RfqStats,
} from '../types/rfq.types';

export const rfqService = {
  async getAll(params?: RfqFilterParams): Promise<PaginatedRfqsResponse> {
    const response = await apiClient.get<PaginatedApiResponse<RFQ, RfqStats>>('/rfqs', { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
      stats: response.data.stats,
    };
  },

  async getById(id: string): Promise<RFQ> {
    const response = await apiClient.get<ApiResponse<RFQ>>(`/rfqs/${id}`);
    return response.data.data;
  },

  async create(payload: CreateRfqInput): Promise<RFQ> {
    const response = await apiClient.post<ApiResponse<RFQ>>('/rfqs', payload);
    return response.data.data;
  },

  async update(id: string, payload: UpdateRfqInput): Promise<RFQ> {
    const response = await apiClient.put<ApiResponse<RFQ>>(`/rfqs/${id}`, payload);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/rfqs/${id}`);
  },
};
