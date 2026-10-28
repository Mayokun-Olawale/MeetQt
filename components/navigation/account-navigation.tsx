"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function AccountNavigation({ name, complete }: { name: string; complete: boolean }) {
  const pathname = usePathname();
  return <>
    {complete && [{ href: "/events", label: "Events" }, { href: "/dashboard", label: "Dashboard" }, { href: "/profile", label: "Profile" }].map(({ href, label }) =>
      <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}</Link>
    )}
    <span className="account-name">{name}</span>
    <SignOutButton />
  </>;
}
