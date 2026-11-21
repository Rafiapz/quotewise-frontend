import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Building2, Calendar, Clock, IndianRupee } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui/Button";
import { useQuotations } from "../hooks/useQuotations";
import { formatCurrency } from "../../../utils/formatters";
import {
  createQuotationSchema,
  CreateQuotationFormValues,
} from "../validators/quotation.validator";
import { validateSyncWithYup } from "../../../utils/validation.utils";

export interface AddQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqId: string;
  partNumber: string;
  quantity?: number;
  onSuccess?: () => void;
}

export const AddQuoteModal: React.FC<AddQuoteModalProps> = ({
  isOpen,
  onClose,
  rfqId,
  partNumber,
  quantity,
  onSuccess,
}) => {
  const { createQuotation, isSubmitting } = useQuotations();

  const [name, setName] = useState("");
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [leadTimeDays, setLeadTimeDays] = useState<number | "">("");
  const [validUntil, setValidUntil] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateQuotationFormValues, string>>
  >({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const result = validateSyncWithYup(createQuotationSchema, {
      name,
      unitPrice,
      leadTimeDays,
      validUntil,
    });
    setErrors(result.errors);
    return result.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await createQuotation({
      name: name.trim(),
      rfqId,
      unitPrice: Number(unitPrice),
      leadTime: Number(leadTimeDays), // lead time in days
      validUntil: new Date(validUntil).toISOString(),
    });

    if (success) {
      toast.success(`Quote from ${name.trim()} added successfully!`);
      // Reset form
      setName("");
      setUnitPrice("");
      setLeadTimeDays("");
      setValidUntil("");
      setErrors({});
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  const calculatedTotal =
    quantity && unitPrice !== "" && !isNaN(Number(unitPrice))
      ? Number(unitPrice) * quantity
      : undefined;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                {partNumber}
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Add Supplier Quote
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Record a supplier price proposal and promised lead time
            </p>
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
              Supplier / Vendor Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building2 className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Tata Advanced Materials Ltd"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                  errors.name
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Unit Price (INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 1250.00"
                  value={unitPrice}
                  onChange={(e) => {
                    const val =
                      e.target.value === "" ? "" : parseFloat(e.target.value);
                    setUnitPrice(val);
                    if (errors.unitPrice)
                      setErrors((prev) => ({ ...prev, unitPrice: undefined }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                    errors.unitPrice
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
              </div>
              {errors.unitPrice && (
                <p className="mt-1 text-xs text-red-600">{errors.unitPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Lead Time (in Days) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Clock className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 14"
                  value={leadTimeDays}
                  onChange={(e) => {
                    const val =
                      e.target.value === "" ? "" : parseInt(e.target.value, 10);
                    setLeadTimeDays(val);
                    if (errors.leadTimeDays)
                      setErrors((prev) => ({
                        ...prev,
                        leadTimeDays: undefined,
                      }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                    errors.leadTimeDays
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
              </div>
              {errors.leadTimeDays && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.leadTimeDays}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Valid Until <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={validUntil}
                onChange={(e) => {
                  setValidUntil(e.target.value);
                  if (errors.validUntil)
                    setErrors((prev) => ({ ...prev, validUntil: undefined }));
                }}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                  errors.validUntil
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
            </div>
            {errors.validUntil && (
              <p className="mt-1 text-xs text-red-600">{errors.validUntil}</p>
            )}
          </div>

          {/* Real-time Total Estimate Preview */}
          {calculatedTotal !== undefined && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
              <span>Total calculated quote value ({quantity} units):</span>
              <span className="text-sm font-bold text-slate-900">
                {formatCurrency(calculatedTotal)}
              </span>
            </div>
          )}

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
              <Plus className="h-4 w-4" /> Submit Quotation
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
