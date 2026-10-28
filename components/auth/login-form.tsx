"use client";

import Link from "next/link";
import { FormField } from "@/components/ui/field";
import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import { FormMessage } from "./form-message";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="meetq-form" aria-busy={pending}>
      <h1>Sign in to MeetQ</h1>
      <p className="form-intro">Good to see you again.</p>
      <input type="hidden" name="next" value={next ?? ""} />
      <FormField label="Email" state={state} name="email" type="email" required autoComplete="email" />
      <FormField label="Password" state={state} type="password" name="password" required autoComplete="current-password" />
      <button type="submit" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</button>
      <FormMessage state={state} />
      <p className="form-footer"><Link href="/forgot-password">Forgot password?</Link></p>
      <p className="form-footer">New to MeetQ? <Link href="/signup">Create an account</Link></p>
    </form>
  );
}
