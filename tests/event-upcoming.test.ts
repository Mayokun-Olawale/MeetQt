import assert from "node:assert/strict";
import { test } from "node:test";
import { upcomingEvents } from "../lib/events/upcoming";

test("interested events exclude started and cancelled events and sort by absolute start time", () => {
  const now = Date.parse("2030-05-01T12:00:00Z");
  const events = [
    { id: "later", status: "published", starts_at: "2030-05-01T10:00:00-05:00" },
    { id: "started", status: "published", starts_at: "2030-05-01T12:00:00Z" },
    { id: "cancelled", status: "cancelled", starts_at: "2030-05-02T12:00:00Z" },
    { id: "sooner", status: "published", starts_at: "2030-05-01T14:00:00Z" },
    { id: "past", status: "published", starts_at: "2030-04-30T12:00:00Z" },
  ];
  assert.deepEqual(upcomingEvents(events, now).map((event) => event.id), ["sooner", "later"]);
  assert.equal(events[0].id, "later");
  assert.deepEqual(upcomingEvents(events, Date.parse("2030-05-01T15:00:00Z")), []);
});
