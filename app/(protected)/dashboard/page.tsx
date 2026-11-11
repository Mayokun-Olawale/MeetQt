import Link from "next/link";
import { PageContainer, Card } from "@/components/ui/layout";
import { requireCompleteProfile } from "@/lib/profile/server";
import { ownEvents, interestedEvents } from "@/lib/events/server";
import { InterestedEvents } from "@/components/events/interested-events";
import { EventCard } from "@/components/events/event-card";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ created?: string; view?: string }> }) {
  const { user, profile } = await requireCompleteProfile();
  const { created, view } = await searchParams;
  const selectedView = view === "interested" || view === "matches" ? view : "created";
  const { events, error } = selectedView === "created" ? await ownEvents(user.id)
    : selectedView === "interested" ? await interestedEvents(user.id) : { events: [], error: false };
  return <PageContainer>
    {created === "1" && <p className="form-message form-message-success" role="status">Your event is published.</p>}
    <div className="dashboard-heading"><p className="eyebrow">Your plans, all together</p><h1>Welcome, {profile.display_name}</h1></div>
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <nav aria-label="My Events sections">
          {[{ value: "created", label: "My Events", href: "/dashboard" }, { value: "interested", label: "Interested Events", href: "/dashboard?view=interested" }, { value: "matches", label: "My Matches", href: "/dashboard?view=matches" }].map((item) => <Link key={item.value} href={item.href} aria-current={selectedView === item.value ? "page" : undefined}>{item.label}</Link>)}
        </nav>
      </aside>
      <div className="dashboard-content">
    {selectedView === "interested" && <section className="dashboard-section" aria-labelledby="interested-events"><h2 id="interested-events">Interested events</h2><p className="field-hint">Your saved upcoming events, soonest first. Events leave this list when they start or are cancelled.</p>
      {error ? <p role="alert" className="form-message">We couldn’t load your interested events. Please refresh and try again.</p> : <InterestedEvents events={events} />}
    </section>}
    {selectedView === "created" && <section className="dashboard-section" aria-labelledby="my-events"><div className="section-title"><h2 id="my-events">My events</h2><Link className="button button-small" href="/events/new">Add event</Link></div><p className="field-hint">Events you’ve created, including past and cancelled plans.</p>
      {error ? <p role="alert" className="form-message">We couldn’t load your events. Please refresh and try again.</p> : events.length ? <div className="event-grid">{events.map((event) => <EventCard key={event.id} event={event} own />)}</div> : <Card className="empty-state"><h3>Got a plan in mind?</h3><p>You haven’t created any events yet.</p><Link href="/events/new">Add your first event</Link></Card>}
    </section>}
    {selectedView === "matches" && <section className="dashboard-section" aria-labelledby="my-matches"><h2 id="my-matches">My matches</h2>
      {!profile.matching_opt_in ? <Card className="empty-state"><h3>Matching not enabled</h3><p>You’ve opted out of event matching. You can change this in your profile whenever you’re ready.</p><Link href="/profile/edit">Update matching preference</Link></Card> : <Card className="empty-state"><h3>No matches yet</h3><p>Event matching is coming soon.</p><Link href="/events">Discover events</Link></Card>}
    </section>}
      </div>
    </div>
  </PageContainer>;
}
