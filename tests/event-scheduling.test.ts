import assert from "node:assert/strict";
import { test } from "node:test";
import { hasMinimumEventNotice, EVENT_NOTICE_MS } from "../lib/events/scheduling";

test("allows exactly 24 hours notice and rejects one millisecond less", () => {
  const now = Date.parse("2030-05-01T12:00:00Z");
  assert.equal(hasMinimumEventNotice(new Date(now + EVENT_NOTICE_MS).toISOString(), now), true);
  assert.equal(hasMinimumEventNotice(new Date(now + EVENT_NOTICE_MS - 1).toISOString(), now), false);
  assert.equal(hasMinimumEventNotice(new Date(now + EVENT_NOTICE_MS + 1).toISOString(), now), true);
  assert.equal(hasMinimumEventNotice("invalid", now), false);
});
test("compares elapsed hours across offsets and daylight saving transitions", () => {
  const now = Date.parse("2030-03-09T12:00:00-06:00");
  assert.equal(hasMinimumEventNotice("2030-03-10T12:00:00-05:00", now), false);
  assert.equal(hasMinimumEventNotice("2030-03-10T13:00:00-05:00", now), true);
});
