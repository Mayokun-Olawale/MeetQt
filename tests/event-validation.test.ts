import assert from "node:assert/strict";
import { test } from "node:test";
import { flyerExtension } from "../lib/events/flyer";
import { eventSchema } from "../lib/events/validation";

const valid = () => ({ categories: ["Fitness"], priceType: "free", priceAmount: "", audience: "18+", rsvpRequired: "no", rsvpUrl: "", flyer: new File([new Uint8Array([137,80,78,71,13,10,26,10])], "flyer.png", { type: "image/png" }), title: "  Coffee & conversation  ", description: "Meet at the café for a relaxed afternoon.", location: "Local Café, 100 Main Street", startsAt: new Date(Date.now() + 86400000).toISOString(), timeZone: "America/Chicago" });
test("accepts a future event and trims its title", () => {
  const result = eventSchema.parse(valid());
  assert.equal(result.title, "Coffee & conversation");
});
test("rejects past dates and timestamps without an offset", () => {
  assert.equal(eventSchema.safeParse({ ...valid(), startsAt: "2000-01-01T12:00:00Z" }).success, false);
  assert.equal(eventSchema.safeParse({ ...valid(), startsAt: "2099-01-01T12:00" }).success, false);
});
test("rejects missing details, oversized descriptions, and invalid time zones", () => {
  for (const change of [{ title: " " }, { description: "short" }, { description: "word ".repeat(251) }, { location: "" }, { timeZone: "not-a-zone" }]) {
    assert.equal(eventSchema.safeParse({ ...valid(), ...change }).success, false);
  }
});
test("ignores forged ownership and status fields", () => {
  const result = eventSchema.parse({ ...valid(), creator_id: "another-user", status: "cancelled" });
  assert.equal("creator_id" in result, false);
  assert.equal("status" in result, false);
});

test("requires a nonempty image flyer within the size limit", () => {
  for (const flyer of [undefined, new File([], "empty.png", { type: "image/png" }), new File(["pdf"], "flyer.pdf", { type: "application/pdf" }), new File([new Uint8Array(4 * 1024 * 1024 + 1)], "large.png", { type: "image/png" })]) {
    assert.equal(eventSchema.safeParse({ ...valid(), flyer }).success, false);
  }
});
test("rejects files whose bytes do not match their image type", () => {
  assert.equal(flyerExtension(new TextEncoder().encode("not an image"), "image/png"), null);
  assert.equal(flyerExtension(new Uint8Array([137,80,78,71,13,10,26,10]), "image/png"), "png");
});

test("requires one to three known distinct categories", () => {
  for (const categories of [[], ["Unknown"], ["Fitness", "Fitness"], ["Fitness", "Outdoors", "Concert", "Sports"]]) assert.equal(eventSchema.safeParse({ ...valid(), categories }).success, false);
  assert.equal(eventSchema.safeParse({ ...valid(), categories: ["Fitness", "Outdoors", "Sports"] }).success, true);
});
test("accepts 250 words and rejects 251 even across newlines", () => {
  assert.equal(eventSchema.safeParse({ ...valid(), description: "hello ".repeat(250) }).success, true);
  assert.equal(eventSchema.safeParse({ ...valid(), description: "hello\n".repeat(251) }).success, false);
});
test("requires a valid positive dollar amount for paid events", () => {
  for (const priceAmount of ["", "0", "-1", "1.001", "abc", "1000000", "1e2"]) assert.equal(eventSchema.safeParse({ ...valid(), priceType: "paid", priceAmount }).success, false);
  assert.equal(eventSchema.safeParse({ ...valid(), priceType: "paid", priceAmount: "12.50" }).success, true);
});
test("requires a safe RSVP URL only when RSVP is needed", () => {
  for (const rsvpUrl of ["", "example.com", "javascript:alert(1)", "https://user:pass@example.com"]) assert.equal(eventSchema.safeParse({ ...valid(), rsvpRequired: "yes", rsvpUrl }).success, false);
  assert.equal(eventSchema.safeParse({ ...valid(), rsvpRequired: "yes", rsvpUrl: "https://example.com/rsvp" }).success, true);
});
test("requires an audience and explicit price and RSVP choices", () => {
  for (const change of [{ audience: "" }, { priceType: "" }, { rsvpRequired: "" }]) assert.equal(eventSchema.safeParse({ ...valid(), ...change }).success, false);
});
