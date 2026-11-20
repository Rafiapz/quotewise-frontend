import * as yup from "yup";

export interface CreateQuotationFormValues {
  name: string;
  unitPrice: number | "";
  leadTimeDays: number | "";
  validUntil: string;
}

export const createQuotationSchema: yup.ObjectSchema<CreateQuotationFormValues> = yup.object({
  name: yup
    .string()
    .trim()
    .required("Supplier name is required")
    .min(2, "Supplier name must be at least 2 characters")
    .max(100, "Supplier name cannot exceed 100 characters"),
  unitPrice: yup
    .number()
    .typeError("Unit price must be a valid number")
    .required("Unit price is required")
    .positive("Unit price must be greater than 0"),
  leadTimeDays: yup
    .number()
    .typeError("Lead time must be a valid number")
    .required("Lead time is required")
    .integer("Lead time must be a whole number of days")
    .min(1, "Lead time must be at least 1 day"),
  validUntil: yup
    .string()
    .required("Quote validity date is required")
    .test("is-valid-date", "Invalid date format", (value) => {
      if (!value) return false;
      const d = new Date(value);
      return !isNaN(d.getTime());
    })
    .test("not-in-past", "Quote validity date cannot be in the past", (value) => {
      if (!value) return false;
      const d = new Date(value);
      if (isNaN(d.getTime())) return false;
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      return d >= startOfToday;
    }),
});
