import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Calendar, Hash, FileText, Layers } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../../components/ui/Button';
import { useRfq } from '../hooks/useRfq';

export interface CreateRfqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRfqModal: React.FC<CreateRfqModalProps> = ({ isOpen, onClose }) => {
  const { createRfq, isSubmitting } = useRfq();

  const [partNumber, setPartNumber] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [neededBy, setNeededBy] = useState('');
  const [errors, setErrors] = useState<{
    partNumber?: string;
    description?: string;
    quantity?: string;
    neededBy?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: {
      partNumber?: string;
      description?: string;
      quantity?: string;
      neededBy?: string;
    } = {};

    if (!partNumber.trim()) {
      newErrors.partNumber = 'Part number is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (quantity === '' || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    if (!neededBy) {
      newErrors.neededBy = 'Required delivery date is required';
    } else {
      const selectedDate = new Date(neededBy);
      if (isNaN(selectedDate.getTime())) {
        newErrors.neededBy = 'Invalid date format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await createRfq({
      partNumber: partNumber.trim(),
      description: description.trim(),
      quantity: Number(quantity),
      neededBy: new Date(neededBy).toISOString(),
    });

    if (success) {
      toast.success(`RFQ ${partNumber.trim()} created successfully!`);
      // Reset form
      setPartNumber('');
      setDescription('');
      setQuantity('');
      setNeededBy('');
      setErrors({});
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create New RFQ</h2>
              <p className="text-xs text-slate-500">Request quotes from suppliers for parts or materials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Part / Item Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Hash className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. PN-4820-ALUM"
                value={partNumber}
                onChange={(e) => {
                  setPartNumber(e.target.value);
                  if (errors.partNumber) setErrors((prev) => ({ ...prev, partNumber: undefined }));
                }}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                  errors.partNumber
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
            </div>
            {errors.partNumber && <p className="mt-1 text-xs text-red-600">{errors.partNumber}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Description / Specifications <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                <FileText className="h-4 w-4" />
              </div>
              <textarea
                rows={3}
                placeholder="Detailed specifications, material grade, dimensions, tolerances, finishing..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
                }}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                  errors.description
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
            </div>
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Required Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 500"
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                  setQuantity(val);
                  if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: undefined }));
                }}
                className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                  errors.quantity
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Needed By Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="date"
                  value={neededBy}
                  onChange={(e) => {
                    setNeededBy(e.target.value);
                    if (errors.neededBy) setErrors((prev) => ({ ...prev, neededBy: undefined }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                    errors.neededBy
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
              </div>
              {errors.neededBy && <p className="mt-1 text-xs text-red-600">{errors.neededBy}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Create RFQ
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
