import { Schema, ValidationError } from "yup";

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
  data?: T;
}

/**
 * Validates data synchronously against a Yup schema.
 * Returns a typed result object with formatted field errors.
 */
export const validateSyncWithYup = <T extends Record<string, unknown>>(
  schema: Schema<T>,
  data: unknown,
): ValidationResult<T> => {
  try {
    const validData = schema.validateSync(data, {
      abortEarly: false,
      stripUnknown: false,
    });

    return {
      isValid: true,
      errors: {},
      data: validData as T,
    };
  } catch (err) {
    if (err instanceof ValidationError) {
      const fieldErrors: Partial<Record<keyof T, string>> = {};

      err.inner.forEach((issue) => {
        if (issue.path && !fieldErrors[issue.path as keyof T]) {
          fieldErrors[issue.path as keyof T] = issue.message;
        }
      });

      return {
        isValid: false,
        errors: fieldErrors,
      };
    }

    return {
      isValid: false,
      errors: {},
    };
  }
};
