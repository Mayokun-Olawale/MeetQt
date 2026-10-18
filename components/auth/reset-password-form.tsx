"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updatePassword } from "@/app/actions/auth";
import { FieldError, FormMessage } from "./form-message";
import { PasswordInput } from "./password-input";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, {});
  return (
    <form action={action}>
      <h1>Choose a new password</h1>
      <label htmlFor="password">New password</label>
      <PasswordInput id="password" name="password" required minLength={8} autoComplete="new-password" />
      <FieldError state={state} name="password" />
      <label htmlFor="confirmPassword">Confirm password</label>
      <PasswordInput id="confirmPassword" name="confirmPassword" required minLength={8} autoComplete="new-password" />
      <FieldError state={state} name="confirmPassword" />
      <button type="submit" disabled={pending}>{pending ? "Updating..." : "Update password"}</button>
      <FormMessage state={state} />
      {state.success && <Link href="/login">Return to sign in</Link>}
    </form>
  );
}
