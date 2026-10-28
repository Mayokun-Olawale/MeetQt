import { AuthLayout } from "@/components/ui/layout";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  if (user) redirect("/profile");
  return <AuthLayout><SignupForm /></AuthLayout>;
}
