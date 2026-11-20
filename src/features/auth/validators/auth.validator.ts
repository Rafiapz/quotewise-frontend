import * as yup from "yup";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const loginSchema: yup.ObjectSchema<LoginFormValues> = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email address is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema: yup.ObjectSchema<RegisterFormValues> = yup.object({
  companyName: yup
    .string()
    .trim()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters"),
  email: yup
    .string()
    .trim()
    .required("Email address is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
