import Link from "next/link";
import { PageContainer, Card } from "@/components/ui/layout";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { requireCompleteProfile, profileValues } from "@/lib/profile/server";

export default async function EditProfilePage() {
  const { profile } = await requireCompleteProfile();
  return <PageContainer className="onboarding-container"><p className="back-link"><Link href="/profile">← Back to your profile</Link></p><Card><OnboardingForm mode="edit" initialValues={profileValues(profile)} /></Card></PageContainer>;
}
