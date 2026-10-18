"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { compatibilityQuestions } from "@/lib/onboarding/options";

export type OnboardingState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveOnboarding(_: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const instagramHandle = String(formData.get("instagramHandle") ?? "")
    .trim()
    .replace(/^@/, "");
  const interests = formData.getAll("interests").filter((value): value is string => typeof value === "string");
  const matching = formData.get("matchingOptIn");

  const fieldErrors: Record<string, string> = {};
  if (!displayName) fieldErrors.displayName = "Enter your name.";
  if (displayName.length > 80) fieldErrors.displayName = "Name must be 80 characters or fewer.";
  if (!instagramHandle) fieldErrors.instagramHandle = "Enter your Instagram handle.";
  if (instagramHandle.length > 30 || !/^[A-Za-z0-9._]+$/.test(instagramHandle)) {
    fieldErrors.instagramHandle = "Enter a valid Instagram handle.";
  }
  if (interests.length === 0) fieldErrors.interests = "Choose at least one interest.";
  if (matching !== "yes" && matching !== "no") fieldErrors.matchingOptIn = "Choose yes or no.";

  const compatibilityAnswers: Record<string, string> = {};
  for (const question of compatibilityQuestions) {
    const answer = formData.get(question.id);
    if (typeof answer !== "string" || !question.answers.includes(answer as never)) {
      fieldErrors[question.id] = "Choose an answer.";
    } else {
      compatibilityAnswers[question.id] = answer;
    }
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Please sign in again." };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      instagram_handle: instagramHandle,
      interests,
      matching_opt_in: matching === "yes",
      compatibility_answers: compatibilityAnswers,
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: "We could not save your profile. Please try again." };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
