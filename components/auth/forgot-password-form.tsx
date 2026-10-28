"use client";

import { FormField } from "@/components/ui/field";
import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import { FormMessage } from "./form-message";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, {});
  return (
    <form action={action} className="meetq-form" aria-busy={pending}>
      <h1>Reset your password</h1>
      <p className="form-intro">We’ll email you a link to get back into your account.</p>
      <FormField label="Email" state={state} name="email" type="email" required autoComplete="email" />
      <button type="submit" disabled={pending}>{pending ? "Sending..." : "Send reset link"}</button>
      <FormMessage state={state} />
    </form>
  );
}
