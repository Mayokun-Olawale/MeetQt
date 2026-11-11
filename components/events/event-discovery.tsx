"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import type { Event } from "@/lib/events/server";
import { swipeDecision, type SwipeDecision } from "@/lib/events/swipe";

type Choice = { event: Event; decision: SwipeDecision };

export function EventDiscovery({ events }: { events: Event[] }) {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [offset, setOffset] = useState(0);
  const [notice, setNotice] = useState("");
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const region = useRef<HTMLElement>(null);
  const seenIds = new Set(choices.map((choice) => choice.event.id));
  const event = events.find((candidate) => !seenIds.has(candidate.id));
  const saving = false;
  const saveError = "";
  const savingRef = useRef(false);

  function choose(decision: SwipeDecision) {
    if (!event) return;
    setOffset(0);
    drag.current = null;
    setChoices((current) => [...current, { event, decision }]);
    setNotice(`${decision === "skip" ? "Skipped" : "Interested in"} ${event.title}.`);
    region.current?.focus({ preventScroll: true });
  }

  function startDrag(e: PointerEvent<HTMLDivElement>) {
    if (savingRef.current || !e.isPrimary || e.button !== 0 || (e.target as HTMLElement).closest("a, button, summary")) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function finishDrag(e: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    drag.current = null;
    setOffset(0);
    if (!start || start.id !== e.pointerId) return;
    const decision = swipeDecision(e.clientX - start.x, e.clientY - start.y);
    if (decision) choose(decision);
  }

  return <section className="event-discovery" aria-label="Event discovery" aria-describedby="discovery-help" tabIndex={0} ref={region} onKeyDown={(e) => {
    if (e.target !== e.currentTarget || e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
    if (event && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      choose(e.key === "ArrowLeft" ? "skip" : "interested");
    }
  }}>
    <p id="discovery-help" className="discovery-help">Swipe left to skip or right if you’re interested. Use the buttons below, or focus this area and use the arrow keys.</p>
    <p className="discovery-progress">{event ? `Event ${choices.length + 1} of ${events.length}` : `You’ve viewed all ${events.length} events in this set`}</p>
    <p className="discovery-announcement" role="status" aria-live="polite">{notice}</p>
    {event ? <>
      <div className="discovery-stage">
        <div className={`discovery-card${offset ? " is-dragging" : ""}`} style={{ transform: `translateX(${offset}px) rotate(${offset / 25}deg)` }} onPointerDown={startDrag} onPointerMove={(e) => {
          const start = drag.current;
          if (!start || start.id !== e.pointerId) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) { drag.current = null; setOffset(0); return; }
          setOffset(Math.max(-130, Math.min(130, dx)));
        }} onPointerUp={finishDrag} onPointerCancel={() => { drag.current = null; setOffset(0); }} onLostPointerCapture={() => { drag.current = null; setOffset(0); }}>
          {Math.abs(offset) >= 80 && <span className={`swipe-label ${offset > 0 ? "swipe-interested" : "swipe-skip"}`} aria-hidden="true">{offset > 0 ? "Interested" : "Skip"}</span>}
          <div className="discovery-visual">
            {event.flyer_url ? <Image src={event.flyer_url} alt={`Flyer for ${event.title}`} width={800} height={1000} unoptimized draggable={false} className="discovery-flyer" /> : <div className="discovery-no-flyer"><span aria-hidden="true">✳</span><p>{event.title}</p><small>Flyer temporarily unavailable</small></div>}
          </div>
          <div className="discovery-details">
            <div className="event-meta"><time dateTime={event.starts_at}>{new Intl.DateTimeFormat("en-US", { timeZone: event.time_zone, dateStyle: "medium", timeStyle: "short" }).format(new Date(event.starts_at))} ({event.time_zone.replaceAll("_", " ")})</time></div>
            <h2>{event.title}</h2>
            <p className="event-location">{event.location}</p>
            <p className="discovery-price">{event.price_cents === null ? "Price not specified" : event.price_cents === 0 ? "Free" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(event.price_cents / 100)}{event.audience ? ` · ${event.audience}` : ""}</p>
            <ul className="interest-badges">{event.categories?.map((category) => <li key={category}>{category}</li>)}</ul>
            <p className="event-description">{event.description}</p>
            {event.rsvp_required && event.rsvp_url ? <a href={event.rsvp_url} target="_blank" rel="noopener noreferrer">RSVP for this event ↗</a> : event.rsvp_required === false ? <p className="field-hint">No RSVP needed</p> : null}
          </div>
        </div>
      </div>
      <div className="discovery-controls" aria-busy={saving}><button disabled={saving} className="button-secondary" onClick={() => choose("skip")}><span aria-hidden="true">←</span> Skip</button><button disabled={saving} onClick={() => choose("interested")}><span aria-hidden="true">♡</span> {saving ? "Saving…" : "Interested"}</button></div>
    </> : <div className="card discovery-end"><h2>You’re all caught up.</h2><p>Change your filters to find more plans, or revisit events you skipped.</p><div className="actions"><button onClick={() => { setChoices((current) => current.filter((choice) => choice.decision === "interested")); setNotice("Browsing skipped events again. Interested events stay on your dashboard."); region.current?.focus(); }}>Browse again</button><Link href="/events">Clear filters</Link></div></div>}
    {saveError && <p role="alert" className="form-message">{saveError}</p>}
    <p className="field-hint discovery-note">Interest is temporary until you leave this page. Expressing interest does not complete an external RSVP.</p>
  </section>;
}
