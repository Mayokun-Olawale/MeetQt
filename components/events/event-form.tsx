"use client";

import { useActionState, useState } from "react";
import { eventCategories, eventAudiences, wordCount } from "@/lib/events/options";
import { createEvent } from "@/app/actions/events";
import { FormField } from "@/components/ui/field";
import { FieldError, FormMessage } from "@/components/auth/form-message";

export function EventForm() {
  const [state, action, pending] = useActionState(createEvent, {});
  const [flyer, setFlyer] = useState<File | null>(null);
  const [values, setValues] = useState({ title: "", description: "", location: "", localDate: "", startsAt: "", timeZone: "UTC", categories: [] as string[], priceType: "", priceAmount: "", audience: "", rsvpRequired: "", rsvpUrl: "" });
  return <form action={(formData) => {
    if (flyer) formData.set("flyer", flyer);
    action(formData);
  }} className="meetq-form" aria-busy={pending}>
    <div className="form-field">
      <label htmlFor="flyer">Event flyer (required)</label>
      <p id="flyer-hint" className="field-hint">Upload a JPG, PNG, or WebP image, up to 4 MB.</p>
      <input id="flyer" name="flyer" type="file" accept="image/jpeg,image/png,image/webp" required={!flyer} onChange={(event) => setFlyer(event.target.files?.[0] ?? null)} aria-invalid={Boolean(state.fieldErrors?.flyer)} aria-describedby={`flyer-hint${state.fieldErrors?.flyer ? " flyer-error" : ""}`} />
      {flyer && <p className="field-hint" role="status">Selected: {flyer.name}</p>}
      <FieldError state={state} name="flyer" />
    </div>
    <FormField name="title" label="Event name" state={state} required minLength={3} maxLength={100} value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} />
    <div className="form-field"><label htmlFor="description">What’s the plan?</label><p id="description-hint" className="field-hint">Keep it short: 250 words maximum. {wordCount(values.description)} / 250 words.</p><textarea id="description" name="description" required minLength={10} rows={5} value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} aria-invalid={Boolean(state.fieldErrors?.description)} aria-describedby={`description-hint${state.fieldErrors?.description ? " description-error" : ""}`} /><FieldError state={state} name="description" /></div>
    <fieldset aria-describedby="categories-help categories-error"><legend>Categories</legend><p id="categories-help">Choose 1–3 categories. {values.categories.length} / 3 selected.</p><div className="option-list">{eventCategories.map((category) => <label className="choice" key={category}><input type="checkbox" name="categories" value={category} checked={values.categories.includes(category)} disabled={values.categories.length >= 3 && !values.categories.includes(category)} onChange={(e) => setValues({ ...values, categories: e.target.checked ? [...values.categories, category] : values.categories.filter((value) => value !== category) })} />{category}</label>)}</div><FieldError state={state} name="categories" /></fieldset>
    <fieldset aria-describedby="priceType-error"><legend>Price (USD)</legend><div className="option-list">{["free", "paid"].map((type) => <label className="choice" key={type}><input type="radio" name="priceType" value={type} required checked={values.priceType === type} onChange={() => setValues({ ...values, priceType: type })} />{type === "free" ? "Free" : "Paid"}</label>)}</div><FieldError state={state} name="priceType" />{values.priceType === "paid" ? <FormField name="priceAmount" label="Dollar amount (USD)" type="number" min="0.01" max="999999.99" step="0.01" required state={state} value={values.priceAmount} onChange={(e) => setValues({ ...values, priceAmount: e.target.value })} /> : <input type="hidden" name="priceAmount" value="" />}</fieldset>
    <fieldset aria-describedby="audience-help audience-error"><legend>Who is this for?</legend><p id="audience-help">Choose one audience or age restriction.</p><div className="option-list">{eventAudiences.map((audience) => <label className="choice" key={audience}><input type="radio" name="audience" value={audience} required checked={values.audience === audience} onChange={() => setValues({ ...values, audience })} />{audience}</label>)}</div><FieldError state={state} name="audience" /></fieldset>
    <fieldset aria-describedby="rsvpRequired-error"><legend>Is RSVP required?</legend><div className="option-list">{["yes", "no"].map((value) => <label className="choice" key={value}><input type="radio" name="rsvpRequired" value={value} required checked={values.rsvpRequired === value} onChange={() => setValues({ ...values, rsvpRequired: value })} />{value === "yes" ? "Yes" : "No"}</label>)}</div><FieldError state={state} name="rsvpRequired" />{values.rsvpRequired === "yes" ? <FormField name="rsvpUrl" label="RSVP link" type="url" required maxLength={2000} placeholder="https://" state={state} value={values.rsvpUrl} onChange={(e) => setValues({ ...values, rsvpUrl: e.target.value })} /> : <input type="hidden" name="rsvpUrl" value="" />}</fieldset>
    <FormField name="location" label="Where" hint="Add a venue and address, or an online meeting location." state={state} required minLength={3} maxLength={200} value={values.location} onChange={(e) => setValues({ ...values, location: e.target.value })} />
    <div className="form-field"><label htmlFor="localDate">Date and time</label><p id="date-hint" className="field-hint">Enter the time in your device’s local time zone. The event will display its time zone for everyone.</p><input id="localDate" type="datetime-local" required value={values.localDate} onChange={(e) => {
      const date = new Date(e.target.value);
      setValues({ ...values, localDate: e.target.value, startsAt: Number.isNaN(date.getTime()) ? "" : date.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    }} aria-invalid={Boolean(state.fieldErrors?.startsAt)} aria-describedby={`date-hint${state.fieldErrors?.startsAt ? " startsAt-error" : ""}`} /><FieldError state={state} name="startsAt" /><FieldError state={state} name="timeZone" /></div>
    <input type="hidden" name="startsAt" value={values.startsAt} /><input type="hidden" name="timeZone" value={values.timeZone} />
    <p className="field-hint">Your event will be visible to signed-in MeetQ members. You can cancel it from your dashboard.</p>
    <button disabled={pending}>{pending ? "Publishing…" : "Publish event"}</button><FormMessage state={state} />
  </form>;
}
