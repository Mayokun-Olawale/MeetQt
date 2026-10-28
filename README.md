# MeetQ

MeetQ helps people discover events and connect over shared interests. It uses
Next.js App Router, React, TypeScript, Supabase Auth/Postgres/Storage.

## 1. Get the source and install dependencies

Clone the repository using its actual URL, or extract a complete source archive,
then open a terminal in the project directory:

```bash
npm ci
```

Use `npm ci` to install the versions in the committed lockfile. If sharing through
Git, commit the application files, logo, consolidated setup SQL, and lockfile first.
Do not include `.env.local`, `node_modules`, or `.next` in a source archive.

## 2. Create a Supabase project and configure the environment

Create a project in the [Supabase dashboard](https://supabase.com/dashboard).
Copy its Project URL and publishable API key from the project's Connect/API
settings. Supabase documents these in its
[Next.js setup guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs).

Copy `.env.example` to `.env.local` in the project root and replace the placeholders:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use the URL and key from the same project. Never put a service-role/secret key
in a `NEXT_PUBLIC_` variable. Restart the development server after changing this
file. Keep the Supabase Data API enabled with the `public` schema exposed.

## 3. Set up the database and flyer storage

For a **new, empty Supabase project**, open the project's SQL Editor, paste the
entire contents of [supabase/setup.sql](supabase/setup.sql), and run it once as
the database administrator. This is the consolidated version of migrations
0001–0008, including:

- Profiles, the signup trigger, onboarding fields, and owner-only access rules.
- Events, ownership/cancellation rules, categories, pricing, audience, and RSVP.
- The private `event-flyers` Storage bucket, a 4 MB image limit, and upload rules.
- The event/flyer policy fix needed for publishing.

The script runs in one transaction. It requires Supabase's existing `auth` and
`storage` schemas; it is not a standalone vanilla PostgreSQL setup. The bucket
is created by the SQL, so there is no separate manual bucket creation step.

The consolidated script is for fresh installations and must not be rerun on an
existing project. Earlier migration files retained in the repository are historical;
the complete schema is maintained in `supabase/setup.sql`.

For an **existing project**, preserve its data and apply only the schema changes
that have not already been applied. Review the source sections in `setup.sql`
against the installed schema before running any SQL. Do not delete tables to
resolve an “already exists” error.

Auth dashboard settings below are configured separately from SQL.

## 4. Configure email authentication

In Supabase Authentication, enable email/password sign-in and email confirmation.
Under URL Configuration, set:

- Site URL: `http://localhost:3000`
- Allowed redirect URL: `http://localhost:3000/auth/confirm`

In Email Templates, use the following confirmation link for Confirm signup:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your email</a>
```

For Reset password, use:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password">Reset your password</a>
```

These match the app's `/auth/confirm` token-hash callback. Configuration background
is available in [Supabase's server-side Auth guide](https://supabase.com/docs/guides/auth/server-side/nextjs).
Email delivery limits/settings may require configuring SMTP for testing with
additional recipients or for production.

## 5. Start and verify the app

```bash
npm run dev
```

Open `http://localhost:3000`. Create an account, confirm its email, and complete
onboarding. Sign in again to check that completed accounts reach their profile.
Then publish an event with a JPG, PNG, or WebP flyer (up to 4 MB), confirm it
appears in Events and My events, and cancel it from the dashboard.

Use a second account to check that it can discover the event while published,
but cannot edit the first account's profile or cancel its events. Cancellation
removes the event from discovery while keeping it in the creator's dashboard.

## Current application behavior

| Route | Purpose |
| --- | --- |
| `/` | Public landing page |
| `/signup`, `/login` | Account creation and sign-in |
| `/forgot-password`, `/reset-password` | Password recovery |
| `/onboarding` | Required profile setup |
| `/profile`, `/profile/edit` | Private profile and owner-only editing |
| `/events`, `/events/new` | Upcoming event discovery and event creation |
| `/dashboard` | My events and My matches |

`profiles.onboarding_completed_at` is null until setup finishes. Incomplete
accounts go to onboarding; completed accounts can access the account pages.
Profiles contain names, Instagram handles, interests, matching preferences, and
compatibility answers. Current profile reads/updates are restricted to the owner.

Events require a flyer, 1–3 categories, a free/paid price in USD, one audience
selection, an RSVP preference/link when required, and a description of at most
250 words. Prices are stored in cents. Date entry uses the creator's device time
zone; event cards display the stored time zone. Discovery lists up to 100 upcoming
published events. My events lists up to 100 of the account's events, including
past and cancelled ones. Flyer images use temporary signed URLs.

My matches displays “Matching not enabled” for opted-out accounts. Opted-in
accounts currently see a coming-soon empty state. Event participation, automated
matching, scheduled group reveals, and group-member profiles remain future work.

## Checks and database tests

```bash
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

For the production server after building:

```bash
npm start
```

Validation tests do not require a live database. Database access rules and
end-to-end flows have not been verified against a fresh hosted project. Verify
signup, uploads, publishing, and account isolation using the steps above.

## Common setup problems

- **Missing environment variable or connection failure:** check `.env.local`, the
  project URL/key pair, and restart Next.js.
- **Table/column missing:** apply the complete setup on a fresh project, or the
  missing schema changes on an existing project.
- **Policy already exists:** do not rerun the consolidated setup or previously
  applied migrations on an existing installation.
- **Flyer upload fails:** confirm the consolidated setup created
  the bucket, and choose a supported image no larger than 4 MB.
- **Publishing fails after the flyer uploads:** confirm the final event/flyer policy section in
  `setup.sql` has been applied. The form shows a database reference code and the server logs
  include the database error code/message for diagnosis.
- **Confirmation/recovery links fail:** verify Site URL, redirect allow-list,
  email templates, and that the link has not expired or already been used.

## Hosting another copy

Deploy the source to a host that supports Next.js server rendering and server
actions. Set the same three environment variables using the new copy's Supabase
project and real HTTPS site URL. Update Supabase's Site URL and redirect allow-list
for `https://YOUR_DOMAIN/auth/confirm`, then rebuild/redeploy. The host must accept
the configured 6 MB server-action request limit for flyer uploads. The setup SQL
does not provision hosting, SMTP, or future matching schedules.
