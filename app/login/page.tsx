import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { data: { user } } = await (await createClient()).auth.getUser();
  if (user) redirect("/dashboard");
  const params = await searchParams;
  return <main><LoginForm next={params.next} /></main>;
}
