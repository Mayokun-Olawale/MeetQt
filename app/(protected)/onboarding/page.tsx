import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, instagram_handle")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  return (
    <main>
      <OnboardingForm
        initialName={profile?.display_name ?? ""}
        initialInstagramHandle={profile?.instagram_handle ?? ""}
      />
      <SignOutButton />
    </main>
  );
}
