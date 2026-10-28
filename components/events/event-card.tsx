import Image from "next/image";
import { Card } from "@/components/ui/layout";
import type { Event } from "@/lib/events/server";
import { CancelEventButton } from "./cancel-event-button";

export function EventCard({ event, own = false }: { event: Event; own?: boolean }) {
  const date = new Intl.DateTimeFormat("en-US", { timeZone: event.time_zone, dateStyle: "medium", timeStyle: "short" }).format(new Date(event.starts_at));
  return <Card className="event-card">
    {event.flyer_url ? <a href={event.flyer_url} target="_blank" rel="noopener noreferrer" aria-label={`View full flyer for ${event.title}`}><Image className="event-flyer" src={event.flyer_url} alt={`Flyer for ${event.title}`} width={800} height={1000} unoptimized /></a> : event.flyer_path ? <p className="field-hint">Flyer temporarily unavailable.</p> : null}
    <div className="event-meta"><time dateTime={event.starts_at}>{date} ({event.time_zone.replaceAll("_", " ")})</time>{event.status === "cancelled" && <span className="status-badge">Cancelled</span>}</div>
    <h3>{event.title}</h3><p className="event-location">{event.location}</p><p className="event-description">{event.description}</p>
    <ul className="interest-badges">{event.categories?.map((category) => <li key={category}>{category}</li>)}</ul>
    <p>{event.price_cents === null ? "Price not specified" : event.price_cents === 0 ? "Free" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(event.price_cents / 100)}{event.audience ? ` · ${event.audience}` : ""}</p>
    {event.rsvp_required && event.rsvp_url ? <a href={event.rsvp_url} target="_blank" rel="noopener noreferrer">RSVP for this event ↗</a> : event.rsvp_required === false ? <p className="field-hint">No RSVP needed</p> : null}
    {own && event.status === "published" && <CancelEventButton id={event.id} />}
  </Card>;
}
