"use client";
import Link from "next/link";

export default function SharedProfileError({ reset }: { reset: () => void }) {
  return <main id="main-content" className="page-container"><div className="card empty-state"><h1>Profile couldn’t load</h1><p role="alert">Please try again.</p><button onClick={reset}>Try again</button><Link href="/dashboard?view=matches">Back to My Matches</Link></div></main>;
}
