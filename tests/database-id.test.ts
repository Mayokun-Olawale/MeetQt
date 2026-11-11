import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { test } from "node:test";
import { databaseId } from "../lib/validation/database-id";

function seededId(value: string) {
  const hex = createHash("md5").update(value).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
test("accepts every seeded profile and event ID, as well as generated account IDs", () => {
  for (let i = 1; i <= 30; i++) assert.equal(databaseId.safeParse(seededId(`meetq-demo-users-v1-${i}`)).success, true);
  for (let i = 1; i <= 5; i++) assert.equal(databaseId.safeParse(seededId(`meetq-video-event-v1-${i}`)).success, true);
  assert.equal(databaseId.safeParse(randomUUID()).success, true);
});
test("rejects malformed IDs before making database requests", () => {
  for (const id of ["", "not-an-id", "../profile", "' OR true--", "ef94ff22-c377-5be8-7633-0f2676fbf61z", null, undefined]) {
    assert.equal(databaseId.safeParse(id).success, false);
  }
});
