begin;

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
