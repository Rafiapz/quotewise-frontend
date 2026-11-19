import { type SupplierQuote } from '../types/quotation.types';

export const findBestQuotation = (quotes: SupplierQuote[]): SupplierQuote | null => {
  if (!quotes || quotes.length === 0) return null;

  return quotes.reduce((best, current) => {
    return current.unitPrice < best.unitPrice ? current : best;
  }, quotes[0]);
};
