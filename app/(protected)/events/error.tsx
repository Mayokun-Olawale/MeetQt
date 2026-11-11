"use client";

export default function EventsError({ reset }: { reset: () => void }) {
  return <main id="main-content" className="page-container"><div className="card discovery-end"><h1>Events couldn’t load.</h1><p role="alert">Please try again to continue discovering events.</p><button onClick={reset}>Try again</button></div></main>;
}
