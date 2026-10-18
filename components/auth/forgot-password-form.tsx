"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import { FieldError, FormMessage } from "./form-message";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, {});
  return (
    <form action={action}>
      <h1>Reset your password</h1>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required autoComplete="email" />
      <FieldError state={state} name="email" />
      <button type="submit" disabled={pending}>{pending ? "Sending..." : "Send reset link"}</button>
      <FormMessage state={state} />
    </form>
  );
}
