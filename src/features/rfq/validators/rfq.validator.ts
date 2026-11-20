import * as yup from "yup";

export interface CreateRfqFormValues {
  partNumber: string;
  description: string;
  quantity: number | "";
  neededBy: string;
}

export const createRfqSchema: yup.ObjectSchema<CreateRfqFormValues> = yup.object({
  partNumber: yup
    .string()
    .trim()
    .required("Part number is required")
    .max(50, "Part number cannot exceed 50 characters"),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description cannot exceed 500 characters"),
  quantity: yup
    .number()
    .typeError("Quantity must be a valid number")
    .required("Quantity is required")
    .positive("Quantity must be a positive number")
    .integer("Quantity must be a whole number"),
  neededBy: yup
    .string()
    .required("Required delivery date is required")
    .test("is-valid-date", "Invalid date format", (value) => {
      if (!value) return false;
      const d = new Date(value);
      return !isNaN(d.getTime());
    })
    .test("not-in-past", "Needed by date cannot be in the past", (value) => {
      if (!value) return false;
      const d = new Date(value);
      if (isNaN(d.getTime())) return false;
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      return d >= startOfToday;
    }),
});
