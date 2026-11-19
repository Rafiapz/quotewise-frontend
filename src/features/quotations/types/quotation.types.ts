import { type BaseEntity } from '../../../types/common';

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
  name?: string;
}
