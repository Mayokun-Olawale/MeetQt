import { signOut } from "@/app/actions/auth";

export function SignOutButton() {
  return <form action={signOut}><button className="button-secondary button-small" type="submit">Sign out</button></form>;
}
