"use client";

import Link from "next/link";
import { FormField } from "@/components/ui/field";
import { useActionState } from "react";
import { updatePassword } from "@/app/actions/auth";
import { FormMessage } from "./form-message";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, {});
  return (
    <form action={action} className="meetq-form" aria-busy={pending}>
      <h1>Choose a new password</h1>
      <p className="form-intro">Use at least 8 characters for your new password.</p>
      <FormField label="New password" state={state} type="password" name="password" required minLength={8} autoComplete="new-password" />
      <FormField label="Confirm password" state={state} type="password" name="confirmPassword" required minLength={8} autoComplete="new-password" />
      <button type="submit" disabled={pending}>{pending ? "Updating..." : "Update password"}</button>
      <FormMessage state={state} />
      {state.success && <Link href="/login">Return to sign in</Link>}
    </form>
  );
}
