"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Event } from "@/lib/events/server";
import { upcomingEvents } from "@/lib/events/upcoming";
import { EventCard } from "./event-card";

export function InterestedEvents({ events }: { events: Event[] }) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function update() {
      clearTimeout(timer);
      const time = Date.now();
      setNow(time);
      const next = upcomingEvents(events, time)[0];
      // Recheck the clock at least once a minute, including after waking a tab.
      timer = setTimeout(update, next ? Math.min(60_000, Math.max(1, Date.parse(next.starts_at) - time + 25)) : 60_000);
    }
    timer = setTimeout(update, 0);
    document.addEventListener("visibilitychange", update);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", update); };
  }, [events]);
  const upcoming = upcomingEvents(events, now);
  return upcoming.length ? <div className="event-grid">{upcoming.map((event) => <EventCard key={event.id} event={event} />)}</div> : <div className="card empty-state"><h3>Find your next plan.</h3><p>Events you’re interested in will appear here, with the soonest first.</p><Link href="/events">Discover events</Link></div>;
}
