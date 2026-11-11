-- Run in a test Supabase database after migrations. Fixtures are rolled back.
begin;
insert into auth.users (id, email) values
  ('22222222-2222-4333-8444-555555555551', 'event-owner@example.invalid'),
  ('22222222-2222-4333-8444-555555555552', 'event-other@example.invalid');
update public.profiles set onboarding_completed_at = now()
where id in ('22222222-2222-4333-8444-555555555551', '22222222-2222-4333-8444-555555555552');
insert into public.events (id, creator_id, title, description, location, starts_at, time_zone, categories, price_cents, audience, rsvp_required) values
  ('33333333-2222-4333-8444-555555555551', '22222222-2222-4333-8444-555555555551', 'Owner event', 'A friendly community gathering.', 'Town square', now() + interval '1 day', 'America/Chicago', array['Fitness'], 0, 'Family-friendly', false),
  ('33333333-2222-4333-8444-555555555552', '22222222-2222-4333-8444-555555555552', 'Other event', 'Another community gathering.', 'Town square', now() + interval '1 day', 'America/Chicago', array['Fitness'], 0, 'Family-friendly', false);
set local role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-4333-8444-555555555551', true);
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4333-8444-555555555551","role":"authenticated"}', true);
do $$
declare affected integer;
begin
  if not exists (select 1 from public.events where id = '33333333-2222-4333-8444-555555555552') then
    raise exception 'Members must be able to discover other members events';
  end if;
  update public.events set status = 'cancelled' where id = '33333333-2222-4333-8444-555555555552';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Cross-account cancellation was allowed'; end if;
  update public.events set status = 'cancelled' where id = '33333333-2222-4333-8444-555555555551';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Owner cancellation failed'; end if;
  update public.events set status = 'published' where id = '33333333-2222-4333-8444-555555555551';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Cancelled event was republished'; end if;
  begin
    update public.events set title = 'Changed' where id = '33333333-2222-4333-8444-555555555551';
    raise exception 'Event fields were editable through the API';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.events (creator_id, title, description, location, starts_at, time_zone, categories, price_cents, audience, rsvp_required)
    values ('22222222-2222-4333-8444-555555555552', 'Forged event', 'A forged community gathering.', 'Town square', now() + interval '1 day', 'UTC', array['Fitness'], 0, 'Family-friendly', false);
    raise exception 'Forged ownership was allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
select set_config('request.jwt.claim.sub', '22222222-2222-4333-8444-555555555552', true);
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4333-8444-555555555552","role":"authenticated"}', true);
do $$
begin
  if exists (select 1 from public.events where id = '33333333-2222-4333-8444-555555555551') then
    raise exception 'Cancelled events must be hidden from other members';
  end if;
end $$;
reset role;
rollback;
