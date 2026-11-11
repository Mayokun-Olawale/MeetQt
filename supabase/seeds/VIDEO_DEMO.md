# MeetQ video demo

Run **video_demo.sql** in Supabase's SQL Editor as administrator. It includes the fake users and event setup; there is no need to run the other seed files separately. Apply migrations through 0012 first.

The script uses `mayolawale2@gmail.com` and `pelumiovershares@gmail.com`. Both accounts must already exist, have completed onboarding, and have matching enabled. It does not create or change your password. Thirty fictional non-login accounts are inserted without sending signup emails.

## When to run

Run once for rehearsal, then **rerun immediately before filming on November 12, 2026**. Dates are relative to the time you execute the script, so the scene setup works at any filming time. The first event expires six hours after execution.

A rerun resets dates and group assignments for these five demo events and resets both filming accounts’ saved interests on them. Other events and your profile settings are left alone. This is an administrator-only fixture setup; normal event creation still requires 24 hours' notice.

## Recording sequence

1. Open **My Events** to show **Board Game Social**, created by your account.
2. Open **Interested Events** to show three saved events, in chronological order.
3. Open **My Matches**:
   - **Coffee & Common Ground** starts in 6 hours and has two revealed groups of three, with the filming accounts in different groups.
   - **Sunset Sketch Club** starts in 9 hours and has a revealed group from a larger pool, split into groups of 2–4.
   - **Trail & Talk** starts in 30 hours and shows about 18 hours till match.
4. Click a revealed group member to show their interests and compatibility answers. Fake users have no Instagram accounts, so no real person's social profile is used.
5. Open **Discover** for **Rooftop Rhythm** (48 hours away) and **Board Game Social** (72 hours away). Show the flyers, filters, skip, and Interested actions.
6. Save one and return to **Interested Events** and **My Matches** to show the saved event and its countdown. It should no longer appear in Discover.

The five flyers are local SVG assets in `public/demo-events`, mapped only to these seeded IDs. Run the updated app code to see them; no Storage upload is needed. Existing non-demo events can also appear in Discover.

Test users carry `[Test]` in their names, the flyers say “fictional event,” and the descriptions identify demo content. The seed calls the matching generator immediately for the revealed scenes, so rehearsal does not have to wait for Cron. Live ongoing changes still depend on the matching scheduler.

## Two-account comparison

Switch between the two accounts (separate browser profiles work well) and open
My Matches. Both accounts have Coffee & Common Ground and Sunset Sketch Club,
but see different group members for each. Each can open only profiles within
its own group. Both also have the Trail & Talk countdown.

This seed deliberately stages separate groups by swapping one filming account
with a fictional attendee if necessary. It preserves group sizes and does not
change the production algorithm or either real account's preferences. Scheduler
retries preserve these groups unless eligibility changes; rerun the seed to
reset the scene if participants join or opt out. Board Game Social remains owned
by the first account.
