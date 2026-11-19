import { type BaseEntity } from '../../../types/common';

export interface SupplierQuote extends BaseEntity {
  rfqId: string;
  supplierName: string;
  unitPrice: number;
  leadTime: number;
  validUntil: string;
  isBestPrice?: boolean;
}

export interface CreateQuotationInput {
  rfqId: string;
  supplierName: string;
  unitPrice: number;
  leadTime: number;
  validUntil: string;
}

export interface QuotationFilterParams {
  rfqId?: string;
  supplierName?: string;
}
