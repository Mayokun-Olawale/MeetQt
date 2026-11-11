import Link from "next/link";
import { PageContainer, Card } from "@/components/ui/layout";

export default function ProfileUnavailable() {
  return <PageContainer><Card className="empty-state"><h1>Profile unavailable</h1><p>This profile is available only while you share a revealed group for an upcoming event. Your group may have changed.</p><Link href="/dashboard?view=matches">Back to My Matches</Link></Card></PageContainer>;
}
