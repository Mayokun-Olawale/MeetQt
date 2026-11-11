begin;

-- Enforce the creation deadline for direct API inserts as well as the app.
-- Existing events remain readable and cancellable as their start approaches.
drop policy if exists events_create on public.events;
create policy events_create on public.events for insert to authenticated
with check (
  creator_id = (select auth.uid()) and status = 'published'
  and starts_at >= statement_timestamp() + interval '24 hours'
  and exists (select 1 from public.profiles where id = (select auth.uid()) and onboarding_completed_at is not null)
  and flyer_path is not null and public.owns_event_flyer(flyer_path)
);

commit;
