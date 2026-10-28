import { AuthLayout } from "@/components/ui/layout";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { data: { user } } = await (await createClient()).auth.getUser();
  if (user) redirect("/profile");
  const params = await searchParams;
  return <AuthLayout><LoginForm next={params.next} /></AuthLayout>;
}
