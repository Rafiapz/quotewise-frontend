import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Filter, Search, AlertCircle } from 'lucide-react';
import { useRfq } from '../hooks/useRfq';
import { RfqCard } from '../components/RfqCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { EmptyState } from '../../../components/common/EmptyState';
import { type CreateRfqInput, type RfqStatus } from '../types/rfq.types';

export const RfqListPage: React.FC = () => {
  const { rfqs, isLoading, isSubmitting, error, fetchRfqs, createRfq } = useRfq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<CreateRfqInput>({
    partNumber: '',
    description: '',
    quantity: 100,
    neededBy: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateRfqInput, string>>>({});

  useEffect(() => {
    fetchRfqs();
  }, [fetchRfqs]);

  const handleInputChange = (field: keyof CreateRfqInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CreateRfqInput, string>> = {};
    if (!formData.partNumber.trim()) errors.partNumber = 'Part number is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Quantity must be > 0';
    if (!formData.neededBy) {
      errors.neededBy = 'Needed by deadline is required';
    } else {
      const deadline = new Date(formData.neededBy);
      if (deadline.getTime() <= Date.now()) {
        errors.neededBy = 'Deadline must be a future date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await createRfq({
      ...formData,
      quantity: Number(formData.quantity),
      neededBy: new Date(formData.neededBy).toISOString(),
    });

    if (success) {
      setIsModalOpen(false);
      setFormData({
        partNumber: '',
        description: '',
        quantity: 100,
        neededBy: '',
      });
    }
  };

  const filteredRfqs = useMemo(() => {
    return rfqs.filter((rfq) => {
      const matchesSearch =
        rfq.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfq.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? rfq.status === (statusFilter as RfqStatus) : true;
      return matchesSearch && matchesStatus;
    });
  }, [rfqs, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Requests for Quotation (RFQs)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage part requests, monitor supplier quotations, and select optimal bids.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> New RFQ
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by part number or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            options={[
              { value: 'OPEN', label: 'Status: Open' },
              { value: 'QUOTED', label: 'Status: Quoted' },
              { value: 'EXPIRED', label: 'Status: Expired' },
            ]}
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Content State */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <LoadingSpinner label="Loading RFQs from server..." />
        </div>
      ) : filteredRfqs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRfqs.map((rfq) => (
            <RfqCard key={rfq.id} rfq={rfq} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <EmptyState
            title={searchTerm || statusFilter ? 'No matching RFQs found' : 'No RFQs available yet'}
            description={
              searchTerm || statusFilter
                ? 'Try adjusting your search criteria or resetting the status filter.'
                : 'Create your first Request for Quotation to start inviting and managing supplier quotes.'
            }
            action={
              !searchTerm && !statusFilter ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Create RFQ
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                  }}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" /> Clear Filters
                </Button>
              )
            }
          />
        </div>
      )}

      {/* Create RFQ Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New RFQ"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Part Number"
            placeholder="e.g. BRG-6204-2RS"
            value={formData.partNumber}
            onChange={(e) => handleInputChange('partNumber', e.target.value)}
            error={formErrors.partNumber}
          />

          <Input
            label="Description"
            placeholder="e.g. Deep groove ball bearing, sealed"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={formErrors.description}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
              error={formErrors.quantity}
            />

            <Input
              label="Needed By Date"
              type="date"
              value={formData.neededBy}
              onChange={(e) => handleInputChange('neededBy', e.target.value)}
              error={formErrors.neededBy}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Create RFQ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
