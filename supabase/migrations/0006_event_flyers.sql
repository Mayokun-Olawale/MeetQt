-- Old events are preserved; all new events must reference an uploaded flyer.
begin;

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

commit;
