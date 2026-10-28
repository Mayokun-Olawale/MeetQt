-- Consolidated application database setup. Maintain schema changes in this file.
-- Fresh Supabase projects only. Run ONCE as administrator in the SQL Editor.
-- Do not run this alongside the individual migrations or on an existing installation.
-- Creates application schema, RLS, signup trigger, and flyer Storage bucket.

begin;

-- Source: migrations/0001_profiles_auth.sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_read_own"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.create_profile_for_new_user();

-- Source: migrations/0002_onboarding_profiles.sql
alter table public.profiles
  add column if not exists display_name text,
  add column if not exists interests text[] not null default '{}',
  add column if not exists matching_opt_in boolean,
  add column if not exists compatibility_answers jsonb not null default '{}'::jsonb,
  add column if not exists onboarding_completed_at timestamptz;

alter table public.profiles
  add constraint profiles_display_name_length
  check (display_name is null or char_length(display_name) between 1 and 80);

alter table public.profiles
  add constraint profiles_interests_count
  check (cardinality(interests) between 0 and 50);

-- Source: migrations/0003_instagram_handle.sql
alter table public.profiles
  add column if not exists instagram_handle text;

alter table public.profiles
  add constraint profiles_instagram_handle_format
  check (
    instagram_handle is null
    or instagram_handle ~ '^@?[A-Za-z0-9._]{1,30}$'
  );

-- Source: migrations/0004_backfill_missing_profiles.sql
-- Accounts created before the profile trigger also need an incomplete profile.
-- Existing profiles and their completion timestamps are preserved.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- Source: migrations/0005_events.sql
create table public.events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 3 and 100),
  description text not null check (char_length(btrim(description)) between 10 and 2000),
  location text not null check (char_length(btrim(location)) between 3 and 200),
  starts_at timestamptz not null,
  time_zone text not null check (char_length(time_zone) between 1 and 100),
  status text not null default 'published' check (status in ('published', 'cancelled')),
  created_at timestamptz not null default now()
);
create index events_discovery_idx on public.events (starts_at, id) where status = 'published';
create index events_creator_idx on public.events (creator_id, starts_at);
alter table public.events enable row level security;

-- Readers can discover events; cancelled events remain available to their creator.
create policy events_read on public.events for select to authenticated
  using (status = 'published' or creator_id = (select auth.uid()));
create policy events_create on public.events for insert to authenticated
  with check (
    creator_id = (select auth.uid()) and status = 'published' and starts_at > now()
    and exists (select 1 from public.profiles where id = (select auth.uid()) and onboarding_completed_at is not null)
  );
create policy events_cancel_own on public.events for update to authenticated
  using (creator_id = (select auth.uid()) and status = 'published')
  with check (creator_id = (select auth.uid()) and status = 'cancelled');

-- Only cancellation is editable, including when using the Supabase API directly.
revoke all on public.events from anon, authenticated;
grant select, insert on public.events to authenticated;
grant update (status) on public.events to authenticated;

-- Source: migrations/0006_event_flyers.sql
-- Old events are preserved; all new events must reference an uploaded flyer.

alter table public.events add column if not exists flyer_path text;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-flyers', 'event-flyers', false, 4194304, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists event_flyers_upload on storage.objects;
create policy event_flyers_upload on storage.objects for insert to authenticated
with check (bucket_id = 'event-flyers' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.profiles where id = (select auth.uid()) and onboarding_completed_at is not null));
drop policy if exists event_flyers_read on storage.objects;
create policy event_flyers_read on storage.objects for select to authenticated
using (bucket_id = 'event-flyers' and (
  (storage.foldername(name))[1] = (select auth.uid())::text
  or exists (select 1 from public.events where flyer_path = name and status = 'published')
));
-- Only unreferenced uploads can be removed, e.g. after a failed event insert.
drop policy if exists event_flyers_cleanup on storage.objects;
create policy event_flyers_cleanup on storage.objects for delete to authenticated
using (bucket_id = 'event-flyers' and (storage.foldername(name))[1] = (select auth.uid())::text
  and not exists (select 1 from public.events where flyer_path = name));

drop policy if exists events_create on public.events;
create policy events_create on public.events for insert to authenticated
with check (
  creator_id = (select auth.uid()) and status = 'published' and starts_at > now()
  and exists (select 1 from public.profiles where id = (select auth.uid()) and onboarding_completed_at is not null)
  and flyer_path is not null and split_part(flyer_path, '/', 1) = (select auth.uid())::text
  and exists (select 1 from storage.objects where bucket_id = 'event-flyers' and name = flyer_path)
);

-- Source: migrations/0007_event_details.sql
alter table public.events
  add column if not exists categories text[],
  add column if not exists price_cents integer,
  add column if not exists audience text,
  add column if not exists rsvp_required boolean,
  add column if not exists rsvp_url text;

-- The description limit is now words, rather than 2,000 characters.
alter table public.events drop constraint if exists events_description_check;
alter table public.events add constraint events_description_check check (char_length(btrim(description)) >= 10);
alter table public.events drop constraint if exists events_categories_check;
alter table public.events add constraint events_categories_check check (
  categories is null or (
    cardinality(categories) between 1 and 3
    and array_position(categories, null) is null
    and categories <@ array['Fitness','Outdoors','Arts and crafts','Concert','Sports','Performance','Community service','Social/networking','Marketplace','Educational']::text[]
  )
);
alter table public.events drop constraint if exists events_price_check;
alter table public.events add constraint events_price_check check (price_cents between 0 and 99999999);
alter table public.events drop constraint if exists events_audience_check;
alter table public.events add constraint events_audience_check check (audience in ('Kid-friendly','Family-friendly','18+','21+'));
alter table public.events drop constraint if exists events_rsvp_check;
alter table public.events add constraint events_rsvp_check check (
  rsvp_required is null or
  (rsvp_required = false and rsvp_url is null) or
  (rsvp_required = true and rsvp_url is not null and char_length(rsvp_url) <= 2000
   and rsvp_url ~* '^https?://[^[:space:]/@]+([/:?#]|$)' and rsvp_url !~ '[[:space:]]')
);

-- Require details on new events without inventing values for older events or
-- preventing their owners from cancelling them.
create or replace function public.validate_new_event_details()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.categories is null or new.price_cents is null or new.audience is null or new.rsvp_required is null then
    raise exception 'Categories, price, audience, and RSVP preference are required.' using errcode = '23514';
  end if;
  if cardinality(new.categories) <> (select count(distinct category) from unnest(new.categories) as category) then
    raise exception 'Choose distinct event categories.' using errcode = '23514';
  end if;
  if cardinality(regexp_split_to_array(btrim(new.description), '[[:space:]]+')) > 250 then
    raise exception 'Description must be 250 words or fewer.' using errcode = '23514';
  end if;
  return new;
end;
$$;
drop trigger if exists validate_new_event_details on public.events;
create trigger validate_new_event_details before insert on public.events
for each row execute function public.validate_new_event_details();

-- Source: migrations/0008_fix_event_flyer_policy.sql
-- The insert policy previously read storage.objects directly, whose read policy
-- reads events. Break that RLS dependency cycle with a narrowly scoped lookup.
create or replace function public.owns_event_flyer(flyer_path text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and split_part(flyer_path, '/', 1) = (select auth.uid())::text
    and exists (
      select 1 from storage.objects as object
      where object.bucket_id = 'event-flyers' and object.name = flyer_path
    );
$$;
revoke all on function public.owns_event_flyer(text) from public, anon;
grant execute on function public.owns_event_flyer(text) to authenticated;

drop policy if exists events_create on public.events;
create policy events_create on public.events for insert to authenticated
with check (
  creator_id = (select auth.uid()) and status = 'published' and starts_at > now()
  and exists (select 1 from public.profiles where id = (select auth.uid()) and onboarding_completed_at is not null)
  and flyer_path is not null and public.owns_event_flyer(flyer_path)
);

commit;
