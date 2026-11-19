import { type BaseEntity } from '../../../types/common';
import { type SupplierQuote } from '../../quotations/types/quotation.types';
import { type PaginationMeta } from '../../../types/api';

export type RfqStatus = 'DRAFT' | 'OPEN' | 'QUOTED' | 'EXPIRED';
export type RfqStatusFilter = 'ALL' | 'OPEN' | 'QUOTED' | 'EXPIRED';

export interface RFQ extends BaseEntity {
  partNumber: string;
  description: string;
  quantity: number;
  neededBy: string;
  userId: string;
  quotes?: SupplierQuote[];
  status?: RfqStatus;
  bestQuote?: SupplierQuote | null;
  quoteCount?: number;
}

export interface RfqStats {
  total: number;
  open: number;
  quoted: number;
  expired: number;
}

export interface CreateRfqInput {
  partNumber: string;
  description: string;
  quantity: number;
  neededBy: string;
  userId?: string;
}

export interface UpdateRfqInput extends Partial<CreateRfqInput> {}

export interface RfqFilterParams {
  status?: RfqStatusFilter;
  search?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedRfqsResponse {
  data: RFQ[];
  meta: PaginationMeta;
  stats?: RfqStats;
}
