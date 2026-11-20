import { type SupplierQuote } from '../types/quotation.types';

/**
 * Finds the BEST quote for an RFQ:
 * The cheapest quote that is still valid AND can arrive in time for the "needed by" date.
 * A cheaper quote that would arrive late is not the best quote.
 */
export const findBestQuotation = (
  quotes: SupplierQuote[],
  neededBy?: string | Date
): SupplierQuote | null => {
  if (!quotes || quotes.length === 0) return null;

  const now = new Date().getTime();
  const neededByTime = neededBy ? new Date(neededBy).getTime() : undefined;

  // 1. Filter: quotes that are still valid AND arrive in time
  const eligibleQuotes = quotes.filter((q) => {
    const isValid = new Date(q.validUntil).getTime() >= now;
    const arrivesInTime =
      neededByTime === undefined || new Date(q.leadTime).getTime() <= neededByTime;
    return isValid && arrivesInTime;
  });

  if (eligibleQuotes.length === 0) return null;

  // 2. Select cheapest; if tied on price, pick earliest delivery
  return eligibleQuotes.reduce((best, current) => {
    if (current.unitPrice < best.unitPrice) return current;
    if (current.unitPrice === best.unitPrice) {
      return new Date(current.leadTime).getTime() < new Date(best.leadTime).getTime()
        ? current
        : best;
    }
    return best;
  });
};
