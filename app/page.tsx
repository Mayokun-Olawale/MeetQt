import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>MeetQ</h1>
      <p>Meet people who share your interests.</p>
      <p><Link href="/login">Sign in</Link> or <Link href="/signup">create an account</Link>.</p>
    </main>
  );
}
