"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateProfile } from "@/lib/profile/validation";

export type OnboardingState = { error?: string; fieldErrors?: Record<string, string> };

async function persistProfile(formData: FormData, editing: boolean): Promise<OnboardingState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Your session has expired. Please sign in again." };
  const { data: existing, error: readError } = await supabase.from("profiles")
    .select("onboarding_completed_at").eq("id", user.id).maybeSingle();
  if (readError) return { error: "We could not load your profile. Please try again." };
  if (editing && !existing?.onboarding_completed_at) redirect("/onboarding");
  if (!editing && existing?.onboarding_completed_at) redirect("/profile");

  const { values, fieldErrors } = validateProfile(formData);
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  // The account ID always comes from the verified session, never the form.
  const { data, error } = await supabase.from("profiles").update({
    display_name: values.displayName,
    instagram_handle: values.instagramHandle,
    interests: values.interests,
    matching_opt_in: values.matchingOptIn === "yes",
    compatibility_answers: values.compatibilityAnswers,
    onboarding_completed_at: existing?.onboarding_completed_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", user.id).select("id").maybeSingle();
  if (error || !data) return { error: "We could not save your profile. Please try again." };
  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  redirect(editing ? "/profile?saved=1" : "/profile");
}

export async function saveOnboarding(_: OnboardingState, formData: FormData): Promise<OnboardingState> {
  return persistProfile(formData, false);
}

export async function updateProfile(_: OnboardingState, formData: FormData): Promise<OnboardingState> {
  return persistProfile(formData, true);
}
