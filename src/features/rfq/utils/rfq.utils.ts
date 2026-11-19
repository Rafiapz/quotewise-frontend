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
  quotesCount: number
): RfqStatus => {
  const deadline = new Date(neededBy);
  const now = new Date();

  if (deadline < now) {
    return 'EXPIRED';
  }
  if (quotesCount > 0) {
    return 'QUOTED';
  }
  return 'OPEN';
};
