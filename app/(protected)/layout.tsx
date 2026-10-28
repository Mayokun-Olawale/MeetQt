import { SiteHeader } from "@/components/ui/layout";
import { AccountNavigation } from "@/components/navigation/account-navigation";
import { getOwnProfile } from "@/lib/profile/server";

export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await getOwnProfile();
  return <><SiteHeader><AccountNavigation name={profile?.display_name || (profile?.instagram_handle ? `@${profile.instagram_handle.replace(/^@/, "")}` : "Your account")} complete={Boolean(profile?.onboarding_completed_at)} /></SiteHeader>{children}</>;
}
