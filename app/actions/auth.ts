"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  credentialsSchema,
  resetPasswordSchema,
  signupSchema,
  type FormState,
  validationState,
} from "@/lib/validation/auth";
import { safeRedirectPath } from "@/lib/auth/redirect";

async function authOrigin() {
  const headerStore = await headers();
  return headerStore.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return validationState(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${await authOrigin()}/auth/confirm?next=/onboarding` },
  });

  if (error) return { error: "Unable to create your account. Please try again." };
  return {
    success: "Account created. Please verify your email before signing in. We sent a magic link to your inbox.",
  };
}

export async function signIn(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return validationState(parsed.error);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Unable to sign in with those credentials." };

  revalidatePath("/", "layout");
  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("onboarding_completed_at").eq("id", data.user.id).maybeSingle();
  if (profileError) return { error: "Signed in, but we could not load your profile. Please try again." };
  if (!profile?.onboarding_completed_at) redirect("/onboarding");
  redirect(safeRedirectPath(formData.get("next")));
}

export async function requestPasswordReset(_: FormState, formData: FormData): Promise<FormState> {
  const email = zEmail(formData.get("email"));
  if (!email) return { fieldErrors: { email: ["Enter a valid email address."] } };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await authOrigin()}/auth/confirm?next=/reset-password`,
  });

  if (error) return { error: "Unable to send reset instructions. Please try again." };
  return { success: "If an account exists for that email, you will receive reset instructions." };
}

function zEmail(value: FormDataEntryValue | null) {
  const parsed = credentialsSchema.shape.email.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export async function updatePassword(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return validationState(parsed.error);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: "Your reset link is invalid or has expired." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "Unable to update your password. Please request a new link." };

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { success: "Your password was updated. You can now sign in." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
