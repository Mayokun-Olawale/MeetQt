import Link from "next/link";
import { PageContainer, Card } from "@/components/ui/layout";
import { requireCompleteProfile } from "@/lib/profile/server";
import { EventForm } from "@/components/events/event-form";

export default async function NewEventPage() {
  await requireCompleteProfile();
  return <PageContainer className="onboarding-container"><p className="back-link"><Link href="/events">← Back to events</Link></p><Card><h1>Bring people together.</h1><p className="event-form-intro">A shared interest, a time, a place. Start something worth showing up for.</p><EventForm /></Card></PageContainer>;
}
