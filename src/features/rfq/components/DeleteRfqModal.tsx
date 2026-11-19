import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface DeleteRfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  partNumber: string;
  description: string;
  quoteCount?: number;
  isDeleting?: boolean;
}

export const DeleteRfqModal: React.FC<DeleteRfqModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  partNumber,
  description,
  quoteCount = 0,
  isDeleting = false,
}) => {
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

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header with Close */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 flex-shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-4 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Delete RFQ & Quotations?
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{partNumber}</span> ({description})?
          </p>

          <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl text-xs text-red-700 leading-normal">
            <span className="font-semibold">Note:</span> Soft delete will remove this RFQ from your workspace along with all{' '}
            <span className="font-semibold">{quoteCount} associated supplier quote{quoteCount === 1 ? '' : 's'}</span>.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isDeleting}
            className="flex items-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Delete RFQ
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
