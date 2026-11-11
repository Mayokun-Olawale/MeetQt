export function upcomingEvents<T extends { starts_at: string; status: string; id: string }>(events: T[], now: number): T[] {
  return events.filter((event) => event.status === "published" && Date.parse(event.starts_at) > now)
    .sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at) || a.id.localeCompare(b.id));
}
