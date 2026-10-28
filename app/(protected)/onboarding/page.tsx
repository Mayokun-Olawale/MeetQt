import { redirect } from "next/navigation";
import { PageContainer, Card } from "@/components/ui/layout";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getOwnProfile, profileValues } from "@/lib/profile/server";

export default async function OnboardingPage() {
  const { profile } = await getOwnProfile();
  if (profile?.onboarding_completed_at) redirect("/profile");
  return <PageContainer className="onboarding-container"><Card><OnboardingForm initialValues={profileValues(profile)} /></Card></PageContainer>;
}
