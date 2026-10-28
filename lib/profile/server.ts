import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileValues } from "./validation";

export type Profile = {
  id: string;
  display_name: string | null;
  instagram_handle: string | null;
  interests: string[];
  matching_opt_in: boolean | null;
  compatibility_answers: Record<string, string>;
  onboarding_completed_at: string | null;
};

// React cache deduplicates reads within this request, never across accounts.
export const getOwnProfile = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");
  const { data, error } = await supabase.from("profiles")
    .select("id, display_name, instagram_handle, interests, matching_opt_in, compatibility_answers, onboarding_completed_at")
    .eq("id", user.id).maybeSingle();
  if (error) throw new Error("We could not load your profile. Please try again.");
  return { user, profile: data as Profile | null };
});

export async function requireCompleteProfile() {
  const { user, profile } = await getOwnProfile();
  if (!profile?.onboarding_completed_at) redirect("/onboarding");
  return { user, profile };
}

export function profileValues(profile: Profile | null): ProfileValues {
  return {
    displayName: profile?.display_name ?? "",
    instagramHandle: profile?.instagram_handle?.replace(/^@/, "") ?? "",
    interests: profile?.interests ?? [],
    matchingOptIn: profile?.matching_opt_in == null ? "" : profile.matching_opt_in ? "yes" : "no",
    compatibilityAnswers: profile?.compatibility_answers ?? {},
  };
}
