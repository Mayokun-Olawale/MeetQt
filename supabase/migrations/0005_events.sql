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
