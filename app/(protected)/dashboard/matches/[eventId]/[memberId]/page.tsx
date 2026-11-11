import Link from "next/link";
import { notFound } from "next/navigation";
import { databaseId } from "@/lib/validation/database-id";
import { PageContainer, Card } from "@/components/ui/layout";
import { requireCompleteProfile } from "@/lib/profile/server";
import { createClient } from "@/lib/supabase/server";
import { compatibilityQuestions, interestCategories } from "@/lib/onboarding/options";
import { MatchProfileRefresh } from "@/components/events/match-profile-refresh";

type SharedProfile = {
  id: string; display_name: string | null; instagram_handle: string | null;
  interests: string[]; compatibility_answers: Record<string, string>; event_title: string;
};

export default async function GroupMemberProfile({ params }: { params: Promise<{ eventId: string; memberId: string }> }) {
  await requireCompleteProfile();
  const { eventId, memberId } = await params;
  if (!databaseId.safeParse(eventId).success || !databaseId.safeParse(memberId).success) notFound();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("group_member_profile", { requested_event: eventId, requested_member: memberId });
  if (error) throw new Error("We couldn’t load this shared profile. Please try again.");
  if (!data) notFound();
  const profile = data as SharedProfile;
  const handle = profile.instagram_handle?.replace(/^@/, "");
  return <PageContainer className="profile-container">
    <MatchProfileRefresh />
    <Link href="/dashboard?view=matches">← Back to My Matches</Link>
    <div className="profile-heading"><div><p className="eyebrow">Your group for {profile.event_title}</p><h1>{profile.display_name ?? "MeetQ member"}</h1>{handle && <p className="profile-handle">@{handle}</p>}</div></div>
    <p className="profile-privacy">Shared with members of your revealed event group.</p>
    <div className="profile-grid">
      <Card className="profile-wide"><h2>Connect</h2>{handle ? <a href={`https://www.instagram.com/${encodeURIComponent(handle)}/`} target="_blank" rel="noopener noreferrer">@{handle} on Instagram ↗</a> : <p>No Instagram handle shared.</p>}</Card>
      <Card className="profile-wide"><h2>Interests</h2><div className="interest-groups">{interestCategories.map(({ category, interests }) => {
        const selected = interests.filter((interest) => profile.interests.includes(interest));
        return selected.length ? <div key={category}><h3>{category}</h3><ul className="interest-badges">{selected.map((interest) => <li key={interest}>{interest}</li>)}</ul></div> : null;
      })}</div>{profile.interests.length === 0 && <p>No interests shared yet.</p>}</Card>
      <Card className="profile-wide"><h2>A little more about {profile.display_name ?? "your group member"}</h2><dl className="compatibility-details">{compatibilityQuestions.map(({ id, question }) => <div key={id}><dt>{question}</dt><dd>{profile.compatibility_answers[id] ?? "Not answered"}</dd></div>)}</dl></Card>
    </div>
  </PageContainer>;
}
