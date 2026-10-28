# MeetQ Next Steps

## Phase: Event discovery and group matching

The next phase is to help users discover events, find compatible people attending
the same event, and connect with their group before it starts. Keep the existing
cream background, black text, pink highlights, and MeetQ logo.

## Current foundation

- Authentication and onboarding collect display name, Instagram handle, interests,
  matching opt-in status, and compatibility answers.
- Users can view and edit their own profile.
- The header contains Events, Dashboard, and Profile, in that order.
- Event creation includes a required flyer, up to three categories, free or paid
  pricing, audience selection, an RSVP preference/link, and a short description.
- Creators can cancel their own events from My events on the dashboard.
- My matches currently shows an opted-in empty state or “Matching not enabled.”
- The final event/flyer policy section in `supabase/setup.sql` addresses the
  event/flyer policy dependency. Confirm publishing works against the live database before building
  on this flow; live upload and database checks remain outstanding.

## 1. Build swipe-style event discovery

- Redesign `/events` with a Tinder-style card interface, focused on one event at a
  time, with its flyer as the main visual.
- Show the event name, date/time and time zone, location, categories, price,
  audience, short description, and RSVP link when required.
- Support swiping to skip an event or express interest in attending.
- Provide labeled buttons and keyboard controls for the same actions so swiping
  is never the only way to use discovery.
- Keep the Add event button easy to find.
- Include loading, error, no-events, and end-of-results states.
- Make the experience work on mobile, tablet, and desktop using the existing
  theme, without neon, gradients, or decorative fading effects.

## 2. Add category filters

- Add a filter section on discovery using the event categories:
  Fitness, Outdoors, Arts and crafts, Concert, Sports, Performance,
  Community service, Social/networking, Marketplace, and Educational.
- Allow users to select multiple filters and clear them to see all categories.
- Show events matching any selected category; an event's three-category creation
  limit does not limit how many discovery filters a user can select.
- Apply filters before building the discovery card stack.
- Only show upcoming, published events; exclude cancelled events.
- Show a useful empty state when no events match the selected filters.

## 3. Implement event participation and group matching

- Persist each user's event interest/participation so matching can identify who
  plans to attend a specific event.
- Make the discovery action's meaning clear: expressing interest in MeetQ does
  not complete an external RSVP. Keep required RSVP links visible.
- Match only users participating in the same event who have opted into matching.
- Use onboarding interests and compatibility answers to form compatible groups
  of 2–4 people.
- Store groups and their membership in the database rather than generating new
  groups each time a page loads.
- Make matching repeatable without duplicate groups or multiple assignments for
  the same user and event.
- Define behavior for too few participants, leftover participants, late joins,
  opt-outs, and cancelled events before enabling automated matching.
- Keep “Matching not enabled” for opted-out users and never assign them to groups.

## 4. Reveal groups 12 hours before the event

- Calculate the reveal time as the event's start timestamp minus 12 hours.
- Schedule group generation/reveal on the server; it must work without someone
  opening the app at the reveal time.
- Show a waiting state in My matches before the reveal time, with the scheduled
  reveal date/time.
- At the reveal time, display the user's group in My matches, with the event
  details and the other group members.
- Enforce the reveal time in server/database access rules, including direct API
  requests, rather than hiding group data only in the interface.
- Use stored timestamps consistently across time zones and daylight saving time.
- Handle events created fewer than 12 hours before their start and make scheduled
  jobs safe to retry. Do not reveal groups for cancelled events.

## 5. Open profiles from a revealed group

- Make each member in a revealed group clickable.
- Show their display name, Instagram/social media handle, categorized interests,
  preferences, and compatibility answers supplied during onboarding.
- Limit access to members of the same revealed event group. Profiles should not
  become browsable by unrelated users just because group viewing is added.
- Keep account email private; do not include it in another member's profile view.
- Preserve owner-only profile editing. Viewing another group member's profile
  must never allow updating their information.
- Use a dedicated group-member profile view/query that returns only the fields
  intended for sharing, while keeping the existing private account profile.

## 6. Database and access rules

- Add migrations for event participation, groups, and group membership, with
  indexes and uniqueness constraints for the matching queries.
- Keep profile ownership rules intact and add narrowly scoped read access for
  revealed group members.
- Verify participation, matching opt-in, group membership, event cancellation,
  and reveal time on the server/database.
- Keep privileged matching/scheduling credentials server-side.

## Testing checklist

- Discovery works with swipes, buttons, and keyboard controls on small and large
  screens, with visible focus and accessible labels.
- Category filters show the correct events and handle empty results.
- Participation persists without duplicate records and does not imply completion
  of an external RSVP.
- Only opted-in participants in the same event are matched.
- Groups contain 2–4 members; retries do not create duplicate assignments.
- Group data is inaccessible before the 12-hour reveal time, including via API.
- Groups become visible at the scheduled time across time zones.
- Cancelled events and insufficient-participant cases have clear states.
- Users can open profiles only for members of their own revealed groups.
- Shared profiles include preferences and social handles, exclude account email,
  and cannot be edited by another user.
- Run lint, TypeScript, automated tests, and the production build, plus live
  database policy tests and browser checks for these flows.

## Definition of done

- Users discover events through swipe-style cards and category filters.
- Opted-in participants are assigned to persistent, compatible event groups.
- Groups appear in My matches 12 hours before the event starts.
- Users can open their group members' profiles and see shared onboarding details
  and social handles, with access enforced beyond the interface.
- The existing theme, accessible controls, and owner-only editing are preserved.
