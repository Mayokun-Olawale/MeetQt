"use client";

import { useActionState } from "react";
import { cancelEvent } from "@/app/actions/events";
import { FormMessage } from "@/components/auth/form-message";

export function CancelEventButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(cancelEvent, {});
  return <form action={action} className="cancel-event-form" aria-busy={pending} onSubmit={(event) => { if (!window.confirm("Cancel this event? It will no longer appear on the Events page.")) event.preventDefault(); }}>
    <input type="hidden" name="eventId" value={id} />
    <button className="button-secondary button-small" disabled={pending || Boolean(state.success)}>{pending ? "Cancelling…" : state.success ? "Cancelled" : "Cancel event"}</button>
    <FormMessage state={state} />
  </form>;
}
