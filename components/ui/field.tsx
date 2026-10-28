import type { InputHTMLAttributes } from "react";
import type { FormState } from "@/lib/validation/auth";
import { FieldError } from "@/components/auth/form-message";
import { PasswordInput } from "@/components/auth/password-input";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; state: FormState; hint?: string };
export function FormField({ name, label, state, hint, type, ...props }: FieldProps) {
  const invalid = Boolean(state.fieldErrors?.[name]?.length);
  const describedBy = [hint && `${name}-hint`, invalid && `${name}-error`].filter(Boolean).join(" ") || undefined;
  const shared = { ...props, id: name, name, "aria-invalid": invalid, "aria-describedby": describedBy };
  return <div className="form-field"><label htmlFor={name}>{label}</label>{hint && <p id={`${name}-hint`} className="field-hint">{hint}</p>}{type === "password" ? <PasswordInput {...shared} autoComplete={props.autoComplete ?? "new-password"} /> : <input {...shared} type={type} />}<FieldError state={state} name={name} /></div>;
}
