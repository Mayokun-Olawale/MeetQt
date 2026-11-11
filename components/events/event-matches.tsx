"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { EventMatch } from "@/lib/matching/server";
import { matchCountdown } from "@/lib/matching/countdown";

export function EventMatches({ matches, serverNow }: { matches: EventMatch[]; serverNow: number }) {
  const router = useRouter();
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    const start = performance.now();
    const tick = setInterval(() => setNow(serverNow + performance.now() - start), 1000);
    // Poll the server so reveals, late joins, opt-outs and cancellations update.
    const poll = setInterval(() => router.refresh(), 15_000);
    const refresh = () => { if (document.visibilityState === "visible") router.refresh(); };
    document.addEventListener("visibilitychange", refresh);
    return () => { clearInterval(tick); clearInterval(poll); document.removeEventListener("visibilitychange", refresh); };
  }, [serverNow, router]);
  const upcoming = matches.filter((match) => Date.parse(match.starts_at) > now);
  return <div className="match-list">
    <p className="field-hint">Matches are revealed 12 hours before each event. Only people interested in the same event with matching enabled are included.</p>
    {!upcoming.length && <div className="card empty-state"><h3>No event matches yet</h3><p>Add an event to Interested Events to start your countdown.</p><Link href="/events">Discover events</Link></div>}
    {upcoming.map((match) => {
      const time = matchCountdown(match.reveals_at, now);
      const waiting = Date.parse(match.reveals_at) > now;
      const format = (value: string) => new Intl.DateTimeFormat("en-US", { timeZone: match.time_zone, dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
      return <article key={match.event_id} className="card match-card">
        <h3>{match.title}</h3>
        <p className="field-hint"><time dateTime={match.starts_at}>{format(match.starts_at)}</time> ({match.time_zone.replaceAll("_", " ")})</p>
        {waiting ? <><p className="match-countdown" role="timer">{time.days} days, {time.hours} hours, {time.minutes} minutes till match</p><p className="field-hint">Reveals {format(match.reveals_at)} ({match.time_zone.replaceAll("_", " ")})</p></> : match.status === "matched" ? <><h4>Your match</h4><ul className="match-members">{match.members.map((member) => <li key={member.id}>{member.display_name}</li>)}</ul></> : match.status === "unmatched" ? <><p>Sorry, we couldn’t make a match.</p><p className="field-hint">There aren’t enough eligible people yet. We’ll check again if someone else joins.</p></> : <p role="status">We’re preparing your match. This page will update automatically.</p>}
      </article>;
    })}
  </div>;
}
