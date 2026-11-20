import { type RfqStatus } from '../types/rfq.types';
import { type StatusVariant } from '../../../types/common';

export const getRfqStatusBadgeVariant = (status: RfqStatus): StatusVariant => {
  switch (status) {
    case 'OPEN':
      return 'info';
    case 'QUOTED':
      return 'success';
    case 'EXPIRED':
      return 'danger';
    case 'DRAFT':
    default:
      return 'default';
  }
};

export const calculateRfqStatus = (
  neededBy: string | Date,
  quotesCount: number,
  quotes?: { validUntil?: string | Date }[]
): RfqStatus => {
  const deadline = new Date(neededBy);
  const now = new Date();

  // 1. Expired if the "needed by" date has passed
  if (deadline < now) {
    return 'EXPIRED';
  }

  // 2. Open if no quotes yet
  if (quotesCount === 0 || !quotes || quotes.length === 0) {
    return 'OPEN';
  }

  // 3. Quoted if at least one quote is still valid
  const hasValidQuote = quotes.some((q) => {
    if (!q.validUntil) return true;
    return new Date(q.validUntil).getTime() >= now.getTime();
  });

  if (hasValidQuote) {
    return 'QUOTED';
  }

  // 4. Expired if every quote is past its "valid until" date
  return 'EXPIRED';
};
