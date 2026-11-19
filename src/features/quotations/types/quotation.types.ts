import { type BaseEntity } from '../../../types/common';
import { type PaginationMeta } from '../../../types/api';

export interface SupplierQuote extends BaseEntity {
  name: string;
  rfqId: string;
  unitPrice: number;
  leadTime: string;
  leadTimeDays?: number;
  validUntil: string;
  isBestPrice?: boolean;
}

export interface CreateQuotationInput {
  name: string;
  rfqId: string;
  unitPrice: number;
  leadTime: number | string;
  validUntil: string;
}

export interface QuotationFilterParams {
  rfqId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'lead_asc' | 'recent';
}

export interface PaginatedQuotationsResponse {
  data: SupplierQuote[];
  meta: PaginationMeta;
  lowestUnitPrice?: number;
}
