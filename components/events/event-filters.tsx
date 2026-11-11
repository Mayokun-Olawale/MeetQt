"use client";

import Link from "next/link";
import { useState } from "react";
import { eventAudiences, eventCategories } from "@/lib/events/options";
import type { EventFilters } from "@/lib/events/filters";

export function EventFilterPanel({ filters }: { filters: EventFilters }) {
  const [price, setPrice] = useState(filters.price);
  const count = filters.categories.length + filters.audiences.length + Number(filters.price !== "any") + Number(filters.minCents !== undefined) + Number(filters.maxCents !== undefined);
  return <details className="event-filters" open={filters.error ? true : undefined}>
    <summary>Filters{count > 0 ? ` (${count})` : ""}<span className="filter-chevron" aria-hidden="true">⌄</span></summary>
    <form action="/events" method="get" className="filter-panel">
      <fieldset><legend>Categories</legend><p>Choose any number. Events can match any selected category.</p><div className="filter-chips">{eventCategories.map((value) => <label className="filter-chip" key={value}><input type="checkbox" name="category" value={value} defaultChecked={filters.categories.includes(value)} /><span>{value}</span></label>)}</div></fieldset>
      <fieldset><legend>Audience &amp; age limits</legend><p>Match any selected audience label.</p><div className="filter-chips">{eventAudiences.map((value) => <label className="filter-chip" key={value}><input type="checkbox" name="audience" value={value} defaultChecked={filters.audiences.includes(value)} /><span>{value}</span></label>)}</div></fieldset>
      <fieldset><legend>Price</legend><div className="filter-chips">{(["any", "free", "paid"] as const).map((value) => <label className="filter-chip" key={value}><input type="radio" name="price" value={value} checked={price === value} onChange={() => setPrice(value)} /><span>{value === "any" ? "Any price" : value === "free" ? "Free" : "Paid"}</span></label>)}</div>
        {price !== "free" && <div className="filter-price-range"><label>Minimum (USD)<input type="number" name="minPrice" min="0" max="999999.99" step="0.01" placeholder="No minimum" defaultValue={filters.minCents === undefined ? "" : filters.minCents / 100} /></label><label>Maximum (USD)<input type="number" name="maxPrice" min="0" max="999999.99" step="0.01" placeholder="No maximum" defaultValue={filters.maxCents === undefined ? "" : filters.maxCents / 100} /></label></div>}
      </fieldset>
      {filters.error && <p role="alert">{filters.error}</p>}
      <div className="actions"><button type="submit">Apply filters</button><Link href="/events">Clear filters</Link></div>
    </form>
  </details>;
}
