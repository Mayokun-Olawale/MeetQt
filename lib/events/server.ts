import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Event = {
  categories: string[] | null; price_cents: number | null; audience: string | null; rsvp_required: boolean | null; rsvp_url: string | null;
  flyer_path: string | null; flyer_url?: string; id: string; creator_id: string; title: string; description: string;
  location: string; starts_at: string; time_zone: string; status: "published" | "cancelled";
};
const columns = "categories, price_cents, audience, rsvp_required, rsvp_url, flyer_path, id, creator_id, title, description, location, starts_at, time_zone, status";

export async function discoverEvents() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select(columns).eq("status", "published")
    .gt("starts_at", new Date().toISOString()).order("starts_at").order("id").limit(100);
  return { events: await withFlyers((data ?? []) as Event[]), error: Boolean(error) };
}

export async function ownEvents(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select(columns).eq("creator_id", userId)
    .order("starts_at", { ascending: false }).limit(100);
  return { events: await withFlyers((data ?? []) as Event[]), error: Boolean(error) };
}

async function withFlyers(events: Event[]) {
  const paths = events.flatMap((event) => event.flyer_path ? [event.flyer_path] : []);
  if (!paths.length) return events;
  const supabase = await createClient();
  const { data } = await supabase.storage.from("event-flyers").createSignedUrls(paths, 3600);
  const urls = new Map(data?.map((item) => [item.path, item.signedUrl]));
  return events.map((event) => ({ ...event, flyer_url: event.flyer_path ? (urls.get(event.flyer_path) ?? undefined) : undefined }));
}
