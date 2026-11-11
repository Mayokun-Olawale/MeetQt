begin;

create table public.event_interests (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);
create index event_interests_event_idx on public.event_interests (event_id);
alter table public.event_interests enable row level security;
revoke all on public.event_interests from anon, authenticated;
grant select, insert on public.event_interests to authenticated;

create policy event_interests_read_own on public.event_interests
  for select to authenticated using (user_id = (select auth.uid()));
create policy event_interests_save_own on public.event_interests
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.profiles where id = (select auth.uid()) and onboarding_completed_at is not null)
    and exists (select 1 from public.events where id = event_id and status = 'published' and starts_at > now())
  );

commit;
