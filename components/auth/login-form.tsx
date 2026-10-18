"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import { FieldError, FormMessage } from "./form-message";
import { PasswordInput } from "./password-input";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action}>
      <h1>Sign in to MeetQ</h1>
      <input type="hidden" name="next" value={next ?? ""} />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required autoComplete="email" />
      <FieldError state={state} name="email" />
      <label htmlFor="password">Password</label>
      <PasswordInput id="password" name="password" required autoComplete="current-password" />
      <FieldError state={state} name="password" />
      <button type="submit" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</button>
      <FormMessage state={state} />
      <p><Link href="/forgot-password">Forgot password?</Link></p>
      <p>New to MeetQ? <Link href="/signup">Create an account</Link></p>
    </form>
  );
}
