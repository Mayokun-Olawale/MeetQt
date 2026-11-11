# Demo users

Run `demo_users.sql` in your Supabase project's SQL Editor after applying the application migrations. This is a manual seed, not a migration and not part of `setup.sql`.

It inserts 30 clearly labeled fictional users with complete matching profiles:

- Six interest clusters, with varied answers to all ten compatibility questions.
- 24 matching-enabled and 6 opted-out profiles.
- Reserved `example.invalid` email addresses and no Instagram handles.
- No login passwords or authentication identities; no signup emails are sent.
- Stable IDs and a seed marker; reruns preserve existing profile edits and reject conflicts with non-seed accounts.

These users appear in Auth and profiles, but will not appear in matches until explicitly added to the same event's `event_interests`. Do not assign them to real events unless you want test users in those matches. No event interests are inserted by this seed.
