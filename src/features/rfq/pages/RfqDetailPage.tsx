import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Package, AlertCircle } from 'lucide-react';
import { useRfq } from '../hooks/useRfq';
import { useQuotations } from '../../quotations/hooks/useQuotations';
import { QuotationCard } from '../../quotations/components/QuotationCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { EmptyState } from '../../../components/common/EmptyState';
import { getRfqStatusBadgeVariant } from '../utils/rfq.utils';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { type CreateQuotationInput } from '../../quotations/types/quotation.types';

export const RfqDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedRfq, isLoading: isRfqLoading, error: rfqError, fetchRfqById } = useRfq();
  const {
    quotations,
    isLoading: isQuotesLoading,
    isSubmitting: isQuoteSubmitting,
    createQuotation,
    fetchByRfq,
  } = useQuotations();

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateQuotationInput, 'rfqId'>>({
    supplierName: '',
    unitPrice: 10,
    leadTime: 14,
    validUntil: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchRfqById(id);
      fetchByRfq(id);
    }
  }, [id, fetchRfqById, fetchByRfq]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateQuoteForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.supplierName.trim()) errors.supplierName = 'Supplier name is required';
    if (!formData.unitPrice || formData.unitPrice <= 0) errors.unitPrice = 'Unit price must be > 0';
    if (!formData.leadTime || formData.leadTime <= 0) errors.leadTime = 'Lead time must be >= 1';
    if (!formData.validUntil) {
      errors.validUntil = 'Validity date is required';
    } else {
      const validDate = new Date(formData.validUntil);
      if (validDate.getTime() <= Date.now()) {
        errors.validUntil = 'Validity date must be in the future';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !validateQuoteForm()) return;

    const success = await createQuotation({
      rfqId: id,
      supplierName: formData.supplierName,
      unitPrice: Number(formData.unitPrice),
      leadTime: Number(formData.leadTime),
      validUntil: new Date(formData.validUntil).toISOString(),
    });

    if (success) {
      setIsQuoteModalOpen(false);
      setFormData({
        supplierName: '',
        unitPrice: 10,
        leadTime: 14,
        validUntil: '',
      });
      fetchRfqById(id);
      fetchByRfq(id);
    }
  };

  if (isRfqLoading && !selectedRfq) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <LoadingSpinner label="Loading RFQ details..." />
      </div>
    );
  }

  if (rfqError || !selectedRfq) {
    return (
      <div className="space-y-4">
        <Link
          to="/rfqs"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to RFQs
        </Link>
        <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <h2 className="text-lg font-bold">RFQ Not Found</h2>
          <p className="text-sm mt-1">{rfqError || 'The requested RFQ could not be loaded.'}</p>
        </div>
      </div>
    );
  }

  const status = selectedRfq.status || 'OPEN';
  const isExpired = status === 'EXPIRED';

  // Mark best price on the quotes list
  const bestQuoteId = selectedRfq.bestQuote?.id;
  const quotesWithBestFlag = quotations.map((q) => ({
    ...q,
    isBestPrice: q.id === bestQuoteId,
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/rfqs"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded">
                {selectedRfq.partNumber}
              </span>
              <Badge variant={getRfqStatusBadgeVariant(status)}>{status}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{selectedRfq.description}</h1>
          </div>
        </div>

        <div>
          <Button
            variant="primary"
            onClick={() => setIsQuoteModalOpen(true)}
            disabled={isExpired}
            title={isExpired ? 'Cannot add quotations to an expired RFQ' : undefined}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Supplier Quote
          </Button>
        </div>
      </div>

      {isExpired && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <span>
            This RFQ neededBy deadline passed on {formatDate(selectedRfq.neededBy)}. New supplier quotations can no longer be submitted.
          </span>
        </div>
      )}

      {/* RFQ Meta Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Requested Quantity</p>
            <p className="text-lg font-bold text-slate-900">{selectedRfq.quantity.toLocaleString()} units</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Needed By Deadline</p>
            <p className="text-lg font-bold text-slate-900">{formatDate(selectedRfq.neededBy)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Best Available Quote</p>
            <p className="text-lg font-bold text-slate-900">
              {selectedRfq.bestQuote
                ? `${formatCurrency(selectedRfq.bestQuote.unitPrice)} / unit`
                : 'No quotes yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Quotations List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Supplier Quotations ({quotations.length})
          </h2>
        </div>

        {isQuotesLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <LoadingSpinner label="Loading quotes..." />
          </div>
        ) : quotesWithBestFlag.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotesWithBestFlag.map((quote) => (
              <QuotationCard key={quote.id} quote={quote} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <EmptyState
              title="No quotations received yet"
              description="Suppliers have not submitted quotes for this RFQ yet."
              action={
                !isExpired ? (
                  <Button
                    variant="primary"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add First Quotation
                  </Button>
                ) : undefined
              }
            />
          </div>
        )}
      </div>

      {/* Add Supplier Quote Modal */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        title="Add Supplier Quotation"
      >
        <form onSubmit={handleQuoteSubmit} className="space-y-4">
          <Input
            label="Supplier Name"
            placeholder="e.g. Acme Industrial Solutions"
            value={formData.supplierName}
            onChange={(e) => handleInputChange('supplierName', e.target.value)}
            error={formErrors.supplierName}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Unit Price ($)"
              type="number"
              step="0.01"
              min={0.01}
              value={formData.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', Number(e.target.value))}
              error={formErrors.unitPrice}
            />

            <Input
              label="Lead Time (Days)"
              type="number"
              min={1}
              value={formData.leadTime}
              onChange={(e) => handleInputChange('leadTime', Number(e.target.value))}
              error={formErrors.leadTime}
            />
          </div>

          <Input
            label="Valid Until Date"
            type="date"
            value={formData.validUntil}
            onChange={(e) => handleInputChange('validUntil', e.target.value)}
            error={formErrors.validUntil}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsQuoteModalOpen(false)}
              disabled={isQuoteSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isQuoteSubmitting}
            >
              Submit Quotation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
