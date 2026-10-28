import { eventCategories, eventAudiences, wordCount } from "./options";
import { z } from "zod";
import { MAX_FLYER_BYTES, FLYER_TYPES } from "./flyer";

export const eventSchema = z.object({
  flyer: z.file("Add an event flyer.").min(1, "Add an event flyer.").max(MAX_FLYER_BYTES, "Flyer must be 4 MB or smaller.").mime(FLYER_TYPES, "Choose a JPG, PNG, or WebP image."),
  categories: z.array(z.enum(eventCategories)).min(1, "Choose at least one category.").max(3, "Choose up to 3 categories.").refine((values) => new Set(values).size === values.length, "Choose distinct categories."),
  priceType: z.enum(["free", "paid"], "Choose free or paid."),
  priceAmount: z.string().trim(),
  audience: z.enum(eventAudiences, "Choose who this event is suitable for."),
  rsvpRequired: z.enum(["yes", "no"], "Choose whether RSVP is required."),
  rsvpUrl: z.string().trim().max(2000, "Use a shorter RSVP link."),
  title: z.string().trim().min(3, "Use at least 3 characters.").max(100, "Use 100 characters or fewer."),
  description: z.string().trim().min(10, "Tell people a little more (at least 10 characters).").refine((value) => wordCount(value) <= 250, "Use 250 words or fewer."),
  location: z.string().trim().min(3, "Enter a location.").max(200, "Use 200 characters or fewer."),
  startsAt: z.iso.datetime({ offset: true }).refine((value) => Date.parse(value) > Date.now(), "Choose a future date and time."),
  timeZone: z.string().max(100).refine((value) => {
    try { new Intl.DateTimeFormat("en-US", { timeZone: value }); return Boolean(value); } catch { return false; }
  }, "Choose a valid time zone."),
}).superRefine((values, context) => {
  if (values.priceType === "paid" && (!/^\d{1,6}(\.\d{1,2})?$/.test(values.priceAmount) || Number(values.priceAmount) <= 0)) {
    context.addIssue({ code: "custom", path: ["priceAmount"], message: "Enter a dollar amount greater than zero, up to 999,999.99, with at most 2 decimal places." });
  }
  if (values.rsvpRequired === "yes") {
    try {
      const url = new URL(values.rsvpUrl);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error();
    } catch { context.addIssue({ code: "custom", path: ["rsvpUrl"], message: "Enter a full RSVP link beginning with https:// or http://." }); }
  }
});
