import Link from "next/link";
import { PageContainer, Card } from "@/components/ui/layout";
import { requireCompleteProfile } from "@/lib/profile/server";
import { discoverEvents } from "@/lib/events/server";
import { EventCard } from "@/components/events/event-card";

export default async function EventsPage() {
  await requireCompleteProfile();
  const { events, error } = await discoverEvents();
  return <PageContainer><div className="profile-heading"><div><p className="eyebrow">Find your next plan</p><h1>Events</h1></div><Link className="button" href="/events/new">Add event <span aria-hidden="true">＋</span></Link></div><p className="event-page-intro">Discover upcoming plans from the MeetQ community.</p>
    {error ? <p role="alert" className="form-message">We couldn’t load events. Please refresh and try again.</p> : events.length ? <><h2 className="section-heading">Coming up</h2><div className="event-grid">{events.map((event) => <EventCard key={event.id} event={event} />)}</div></> : <Card className="empty-state"><h2>Good plans start with someone.</h2><p>No upcoming events yet. Share a plan and give people a reason to get together.</p><Link href="/events/new">Create the first event</Link></Card>}
  </PageContainer>;
}
