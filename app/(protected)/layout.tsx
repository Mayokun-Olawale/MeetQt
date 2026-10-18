import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data: { user }, error } = await (await createClient()).auth.getUser();
  if (error || !user) redirect("/login");
  return <>{children}</>;
}
