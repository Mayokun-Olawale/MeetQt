import { eventAudiences, eventCategories } from "./options";

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
const many = (value: string | string[] | undefined) => typeof value === "string" ? [value] : value ?? [];
function cents(value: string | undefined) {
  if (!value || !/^\d{1,6}(\.\d{1,2})?$/.test(value)) return undefined;
  return Math.round(Number(value) * 100);
}
export function parseEventFilters(params: Params) {
  const categories = eventCategories.filter((value) => many(params.category).includes(value));
  const audiences = eventAudiences.filter((value) => many(params.audience).includes(value));
  const requestedPrice = first(params.price);
  const price = requestedPrice === "free" || requestedPrice === "paid" ? requestedPrice : "any";
  const minCents = price === "free" ? undefined : cents(first(params.minPrice));
  const maxCents = price === "free" ? undefined : cents(first(params.maxPrice));
  const error = minCents !== undefined && maxCents !== undefined && minCents > maxCents
    ? "Minimum price must be less than or equal to maximum price." : undefined;
  return { categories, audiences, price, minCents, maxCents, error };
}
export type EventFilters = ReturnType<typeof parseEventFilters>;
