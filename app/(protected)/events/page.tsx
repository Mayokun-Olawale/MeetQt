import Link from "next/link";
import { PageContainer, Card } from "@/components/ui/layout";
import { requireCompleteProfile } from "@/lib/profile/server";
import { discoverEvents } from "@/lib/events/server";
import { EventDiscovery } from "@/components/events/event-discovery";
import { parseEventFilters } from "@/lib/events/filters";
import { EventFilterPanel } from "@/components/events/event-filters";

export default async function EventsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireCompleteProfile();
  const filters = parseEventFilters(await searchParams);
  const hasFilters = filters.categories.length > 0 || filters.audiences.length > 0 || filters.price !== "any" || filters.minCents !== undefined || filters.maxCents !== undefined;
  const { events, error } = filters.error ? { events: [], error: false } : await discoverEvents(filters);
  return <PageContainer><div className="profile-heading"><div><p className="eyebrow">Find your next plan</p><h1>Events</h1></div><Link className="button" href="/events/new">Add event <span aria-hidden="true">＋</span></Link></div><p className="event-page-intro">Discover upcoming plans from the MeetQ community.</p>
    <EventFilterPanel key={JSON.stringify(filters)} filters={filters} />
    {filters.error ? <p role="alert" className="form-message">Update the price range above to see matching events.</p> : error ? <p role="alert" className="form-message">We couldn’t load events. Please refresh and try again.</p> : events.length ? <EventDiscovery key={JSON.stringify(filters) + events.map((event) => event.id).join(",")} events={events} /> : hasFilters ? <Card className="empty-state"><h2>No events match these filters yet.</h2><p>Try different filters or clear your selections to browse all upcoming events.</p><Link href="/events">See all events</Link></Card> : <Card className="empty-state"><h2>You’re all caught up.</h2><p>No new upcoming events to discover. Your saved events are in Interested Events.</p><Link href="/dashboard?view=interested">View interested events</Link></Card>}
  </PageContainer>;
}
