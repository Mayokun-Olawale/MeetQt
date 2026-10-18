import { z } from "zod";

const password = z.string().min(8, "Password must be at least 8 characters.");

export const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password,
});

export const signupSchema = credentialsSchema
  .extend({ confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type FormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function validationState(error: z.ZodError): FormState {
  return { fieldErrors: z.flattenError(error).fieldErrors };
}
