import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, onboarding_completed_at")
    .eq("id", user?.id ?? "")
    .maybeSingle();
  if (!profile?.onboarding_completed_at) redirect("/onboarding");

  return <main><h1>Welcome to MeetQ</h1><p>Your account is ready.</p><SignOutButton /></main>;
}
