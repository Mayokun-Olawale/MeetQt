import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/auth/redirect";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = safeRedirectPath(url.searchParams.get("next"), type === "recovery" ? "/reset-password" : "/onboarding");

  if (!tokenHash || (type !== "email" && type !== "signup" && type !== "recovery")) {
    return NextResponse.redirect(new URL("/login?error=invalid-link", url.origin));
  }

  const supabase = await createClient();
  const verificationType = type === "email" ? "email" : type;
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: verificationType });
  if (error) return NextResponse.redirect(new URL("/login?error=expired-link", url.origin));

  return NextResponse.redirect(new URL(next, url.origin));
}
