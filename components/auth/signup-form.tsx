"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";
import { FieldError, FormMessage } from "./form-message";
import { PasswordInput } from "./password-input";

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, {});
  return (
    <form action={action}>
      <h1>Create your MeetQ account</h1>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required autoComplete="email" />
      <FieldError state={state} name="email" />
      <label htmlFor="password">Password</label>
      <PasswordInput id="password" name="password" required minLength={8} autoComplete="new-password" />
      <FieldError state={state} name="password" />
      <label htmlFor="confirmPassword">Confirm password</label>
      <PasswordInput id="confirmPassword" name="confirmPassword" required minLength={8} autoComplete="new-password" />
      <FieldError state={state} name="confirmPassword" />
      <button type="submit" disabled={pending}>{pending ? "Creating account..." : "Sign up"}</button>
      <FormMessage state={state} />
      <p>Already have an account? <Link href="/login">Sign in</Link></p>
    </form>
  );
}
