import { AuthLayout } from "@/components/ui/layout";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  if (!user) redirect("/forgot-password");
  return <AuthLayout><ResetPasswordForm /></AuthLayout>;
}
