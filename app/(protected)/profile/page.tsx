import Link from "next/link";
import { PageContainer, Card } from "@/components/ui/layout";
import { requireCompleteProfile } from "@/lib/profile/server";
import { compatibilityQuestions, interestCategories } from "@/lib/onboarding/options";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { user, profile } = await requireCompleteProfile();
  const { saved } = await searchParams;
  const handle = profile.instagram_handle?.replace(/^@/, "");
  return <PageContainer className="profile-container">
    {saved === "1" && <p className="form-message form-message-success" role="status">Your profile has been updated.</p>}
    <div className="profile-heading"><div><p className="eyebrow">Your own little corner</p><h1>{profile.display_name}</h1><p className="profile-handle">@{handle}</p></div><Link className="button" href="/profile/edit">Edit profile</Link></div>
    <p className="profile-privacy">Only you can view and edit this profile.</p>
    <div className="profile-grid">
      <Card><h2>Contact & account</h2><dl className="profile-details"><dt>Instagram</dt><dd>@{handle}</dd><dt>Account email</dt><dd>{user.email}</dd></dl><p className="field-hint">Your account email is read-only.</p></Card>
      <Card><h2>Event matching</h2><p className="status-badge">{profile.matching_opt_in ? "Matching enabled" : "Not opted in"}</p><p>{profile.matching_opt_in ? "You’ve opted into a group of 2–4 people, matched 12 hours before an event." : "You can turn matching on whenever you’re ready."}</p></Card>
      <Card className="profile-wide"><h2>Your interests</h2><div className="interest-groups">{interestCategories.map(({ category, interests }) => {
        const selected = interests.filter((interest) => profile.interests.includes(interest));
        return selected.length ? <div key={category}><h3>{category}</h3><ul className="interest-badges">{selected.map((interest) => <li key={interest}>{interest}</li>)}</ul></div> : null;
      })}</div></Card>
      <Card className="profile-wide"><h2>A little more about you</h2><p className="field-hint">Your compatibility answers are private to your account.</p><dl className="compatibility-details">{compatibilityQuestions.map(({ id, question }) => <div key={id}><dt>{question}</dt><dd>{profile.compatibility_answers[id] ?? "Not answered"}</dd></div>)}</dl></Card>
    </div>
  </PageContainer>;
}
