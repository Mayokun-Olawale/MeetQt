import type { FormState } from "@/lib/validation/auth";

export function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return <p role="alert">{state.error}</p>;
  }
  if (state.success) {
    return <p role="status">{state.success}</p>;
  }
  return null;
}

export function FieldError({ state, name }: { state: FormState; name: string }) {
  const errors = state.fieldErrors?.[name];
  return errors?.length ? <p role="alert">{errors[0]}</p> : null;
}
