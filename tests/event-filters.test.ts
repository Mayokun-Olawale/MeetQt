import assert from "node:assert/strict";
import { test } from "node:test";
import { parseEventFilters } from "../lib/events/filters";
import { eventCategories } from "../lib/events/options";

test("discovery accepts all ten categories and only known audience labels", () => {
  const filters = parseEventFilters({ category: [...eventCategories, "fake", "Fitness"], audience: ["21+", "fake"] });
  assert.deepEqual(filters.categories, [...eventCategories]);
  assert.deepEqual(filters.audiences, ["21+"]);
});
test("converts USD bounds to exact cents and rejects reversed ranges", () => {
  const filters = parseEventFilters({ price: "paid", minPrice: "0.29", maxPrice: "25.99" });
  assert.equal(filters.minCents, 29);
  assert.equal(filters.maxCents, 2599);
  assert.equal(filters.error, undefined);
  assert.ok(parseEventFilters({ minPrice: "30", maxPrice: "20" }).error);
});
test("free ignores stale range values and malformed query values are ignored", () => {
  const free = parseEventFilters({ price: "free", minPrice: "20", maxPrice: "30" });
  assert.equal(free.minCents, undefined);
  assert.equal(free.maxCents, undefined);
  const invalid = parseEventFilters({ price: "fake", minPrice: "-10", maxPrice: "Infinity" });
  assert.equal(invalid.price, "any");
  assert.equal(invalid.minCents, undefined);
  assert.equal(invalid.maxCents, undefined);
});
