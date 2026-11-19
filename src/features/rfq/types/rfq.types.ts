import { type BaseEntity } from '../../../types/common';
import { type SupplierQuote } from '../../quotations/types/quotation.types';

export type RfqStatus = 'DRAFT' | 'OPEN' | 'QUOTED' | 'EXPIRED';

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

export interface CreateRfqInput {
  partNumber: string;
  description: string;
  quantity: number;
  neededBy: string;
  userId?: string;
}

export interface UpdateRfqInput extends Partial<CreateRfqInput> {}

export interface RfqFilterParams {
  status?: RfqStatus;
  search?: string;
  userId?: string;
  page?: number;
  limit?: number;
}
