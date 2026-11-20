import { type SupplierQuote } from '../types/quotation.types';

/**
 * Calculates the BEST quote dynamically:
 * - The cheapest quote that is still valid AND can arrive in time for the "needed by" date.
 * - A cheaper quote that would arrive late is NOT the best quote.
 */
export const findBestQuotation = (
  quotes: SupplierQuote[],
  neededBy?: string | Date
): SupplierQuote | null => {
  if (!quotes || quotes.length === 0) return null;

  const now = new Date();
  const neededByTime = neededBy ? new Date(neededBy).getTime() : undefined;

  // Filter quotes: must be currently valid AND arrive on or before neededBy
  const eligibleQuotes = quotes.filter((q) => {
    const isValid = new Date(q.validUntil).getTime() >= now.getTime();
    if (!isValid) return false;

    if (neededByTime !== undefined) {
      const arrivalTime = new Date(q.leadTime).getTime();
      if (arrivalTime > neededByTime) return false; // Arrives late!
    }
    return true;
  });

  if (eligibleQuotes.length === 0) return null;

  // Sort: lowest price first; on price tie, earliest delivery first
  eligibleQuotes.sort((a, b) => {
    if (a.unitPrice !== b.unitPrice) {
      return a.unitPrice - b.unitPrice;
    }
    return new Date(a.leadTime).getTime() - new Date(b.leadTime).getTime();
  });

  return eligibleQuotes[0];
};
