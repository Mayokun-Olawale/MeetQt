import assert from "node:assert/strict";
import { test } from "node:test";
import { swipeDecision } from "../lib/events/swipe";

test("horizontal swipes map to skip and interested", () => {
  assert.equal(swipeDecision(-100, 10), "skip");
  assert.equal(swipeDecision(100, -10), "interested");
});
test("taps, short drags and vertical scrolling do not choose events", () => {
  for (const [x, y] of [[0, 0], [79, 0], [-79, 0], [20, 180], [90, 100], [-90, -100]]) {
    assert.equal(swipeDecision(x, y), null);
  }
});
test("requires the horizontal threshold and a predominantly horizontal gesture", () => {
  assert.equal(swipeDecision(80, 0), "interested");
  assert.equal(swipeDecision(-80, 0), "skip");
  assert.equal(swipeDecision(100, 70), null);
});
