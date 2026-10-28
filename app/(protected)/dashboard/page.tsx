import Link from "next/link";
import { PageContainer, Card } from "@/components/ui/layout";
import { requireCompleteProfile } from "@/lib/profile/server";
import { ownEvents } from "@/lib/events/server";
import { EventCard } from "@/components/events/event-card";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const { user, profile } = await requireCompleteProfile();
  const { events, error } = await ownEvents(user.id);
  const { created } = await searchParams;
  return <PageContainer>
    {created === "1" && <p className="form-message form-message-success" role="status">Your event is published.</p>}
    <div className="dashboard-heading"><p className="eyebrow">Your plans, all together</p><h1>Welcome, {profile.display_name}</h1></div>
    <section className="dashboard-section" aria-labelledby="my-events"><div className="section-title"><h2 id="my-events">My events</h2><Link className="button button-small" href="/events/new">Add event</Link></div><p className="field-hint">Events you’ve created, including past and cancelled plans.</p>
      {error ? <p role="alert" className="form-message">We couldn’t load your events. Please refresh and try again.</p> : events.length ? <div className="event-grid">{events.map((event) => <EventCard key={event.id} event={event} own />)}</div> : <Card className="empty-state"><h3>Got a plan in mind?</h3><p>You haven’t created any events yet.</p><Link href="/events/new">Add your first event</Link></Card>}
    </section>
    <section className="dashboard-section" aria-labelledby="my-matches"><h2 id="my-matches">My matches</h2><Card className="empty-state">{profile.matching_opt_in ? <><h3>No matches yet</h3><p>You’re opted in. Event matching is coming soon; your matches will appear here once it’s available.</p><Link href="/events">Discover events</Link></> : <><h3>Matching not enabled</h3><p>You’ve opted out of event matching. You can change this in your profile whenever you’re ready.</p><Link href="/profile/edit">Update matching preference</Link></>}</Card></section>
  </PageContainer>;
}
