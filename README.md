# MeetQt

## First setup

This repository now contains the authentication foundation and account-access flow:

- Next.js App Router and TypeScript
- Supabase browser/server clients using cookie-aware SSR
- Next.js `proxy.ts` session refresh
- Minimal `public.profiles` table, signup trigger, and owner-only RLS
- Email/password signup and login
- Email confirmation and password recovery
- Protected dashboard and logout
- Server-side Zod validation and safe internal redirects

### Local setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the **Project URL** and **Publishable key**.
3. Copy `.env.example` to `.env.local` and fill in those two values. Do not add a service-role key.
4. In the Supabase SQL Editor, run all the files in ./supabase/migrations/.
5. In **Authentication → URL Configuration**, set the local Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/confirm` to the redirect allow-list.
6. In **Authentication → Email Templates**, ensure the confirmation and recovery links use the token hash callback format:

   ```text
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```

   Keep the recovery template's type as `recovery` if you customize it:

   ```text
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password
   ```

7. Install and start the app:

   ```bash
   npm install
   npm run dev
   ```

Available routes are `/signup`, `/login`, `/forgot-password`, `/reset-password`, `/dashboard`, and `/onboarding`.

The onboarding flow now collects a display name, Instagram handle, interests, matching preference, and compatibility answers. Run `supabase/migrations/0003_instagram_handle.sql` in the SQL Editor before testing `/onboarding`.