"use client";

import Link from "next/link";
import { FormField } from "@/components/ui/field";
import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";
import { FormMessage } from "./form-message";

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, {});
  return (
    <form action={action} className="meetq-form" aria-busy={pending}>
      <h1>Create your MeetQ account</h1>
      <p className="form-intro">Find people who share your interests.</p>
      <FormField label="Email" state={state} name="email" type="email" required autoComplete="email" />
      <FormField label="Password" state={state} type="password" name="password" required minLength={8} autoComplete="new-password" />
      <FormField label="Confirm password" state={state} type="password" name="confirmPassword" required minLength={8} autoComplete="new-password" />
      <button type="submit" disabled={pending}>{pending ? "Creating account..." : "Sign up"}</button>
      <FormMessage state={state} />
      <p className="form-footer">Already have an account? <Link href="/login">Sign in</Link></p>
    </form>
  );
}
