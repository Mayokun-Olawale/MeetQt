import assert from "node:assert/strict";
import { test } from "node:test";
import { matchCountdown } from "../lib/matching/countdown";

test("match countdown uses days, hours and minutes without counting down past zero", () => {
  const now = Date.parse("2030-05-01T12:00:00Z");
  assert.deepEqual(matchCountdown("2030-05-02T14:03:00Z", now), { days: 1, hours: 2, minutes: 3 });
  assert.deepEqual(matchCountdown("2030-05-01T12:00:01Z", now), { days: 0, hours: 0, minutes: 1 });
  assert.deepEqual(matchCountdown("2030-05-01T12:00:00Z", now), { days: 0, hours: 0, minutes: 0 });
  assert.deepEqual(matchCountdown("2030-04-01T12:00:00Z", now), { days: 0, hours: 0, minutes: 0 });
});
test("countdown compares absolute times across time zones", () => {
  assert.deepEqual(matchCountdown("2030-05-01T12:00:00-05:00", Date.parse("2030-05-01T16:00:00Z")), { days: 0, hours: 1, minutes: 0 });
});
