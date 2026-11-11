import "server-only";
import { createClient } from "@/lib/supabase/server";

export type EventMatch = {
  event_id: string;
  title: string;
  starts_at: string;
  time_zone: string;
  reveals_at: string;
  status: "waiting" | "processing" | "unmatched" | "matched";
  members: { id: string; display_name: string }[];
};

export async function ownMatches() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("my_event_matches");
  return { matches: (data ?? []) as EventMatch[], error: Boolean(error), serverNow: Date.now() };
}
