"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireCompleteProfile } from "@/lib/profile/server";
import { flyerExtension } from "@/lib/events/flyer";
import { eventSchema } from "@/lib/events/validation";
import type { FormState } from "@/lib/validation/auth";
import { validationState } from "@/lib/validation/auth";
import { z } from "zod";

export async function createEvent(_: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireCompleteProfile();
  const parsed = eventSchema.safeParse({ ...Object.fromEntries(formData), categories: formData.getAll("categories") });
  if (!parsed.success) return validationState(parsed.error);
  const { title, description, location, startsAt, timeZone, flyer, categories, priceType, priceAmount, audience, rsvpRequired, rsvpUrl } = parsed.data;
  const supabase = await createClient();
  const bytes = new Uint8Array(await flyer.arrayBuffer());
  const extension = flyerExtension(bytes, flyer.type);
  if (!extension) return { fieldErrors: { flyer: ["Choose a valid JPG, PNG, or WebP image."] } };
  const flyerPath = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("event-flyers").upload(flyerPath, bytes, { contentType: flyer.type, upsert: false });
  if (uploadError) return { error: "We couldn’t upload your flyer. Please try again." };
  const { error } = await supabase.from("events").insert({
    categories, price_cents: priceType === "free" ? 0 : Math.round(Number(priceAmount) * 100), audience,
    rsvp_required: rsvpRequired === "yes", rsvp_url: rsvpRequired === "yes" ? rsvpUrl : null,
    flyer_path: flyerPath, creator_id: user.id, title, description, location, starts_at: startsAt, time_zone: timeZone,
  });
  if (error) {
    // Log database diagnostics on the server, without form data or account details.
    console.error("Event insert failed", { code: error.code, message: error.message });
    await supabase.storage.from("event-flyers").remove([flyerPath]);
    const reference = error.code ? ` (reference: ${error.code})` : "";
    return { error: `We couldn’t publish your event. Please try again.${reference}` };
  }
  revalidatePath("/events");
  revalidatePath("/dashboard");
  redirect("/dashboard?created=1");
}

export async function cancelEvent(_: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireCompleteProfile();
  const id = z.uuid().safeParse(formData.get("eventId"));
  if (!id.success) return { error: "This event could not be found." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").update({ status: "cancelled" })
    .eq("id", id.data).eq("creator_id", user.id).eq("status", "published").select("id").maybeSingle();
  if (error || !data) return { error: "We couldn’t cancel this event. It may already be cancelled, or you may not own it." };
  revalidatePath("/events");
  revalidatePath("/dashboard");
  return { success: "Event cancelled." };
}
