-- Run after migrations in a test Supabase database. Fixtures are rolled back.
begin;
insert into auth.users (id, email) values
  ('44444444-2222-4333-8444-555555555551', 'interest-one@example.invalid'),
  ('44444444-2222-4333-8444-555555555552', 'interest-two@example.invalid');
update public.profiles set onboarding_completed_at = now()
where id in ('44444444-2222-4333-8444-555555555551', '44444444-2222-4333-8444-555555555552');
insert into public.events (id, creator_id, title, description, location, starts_at, time_zone, categories, price_cents, audience, rsvp_required) values
  ('55555555-2222-4333-8444-555555555551', '44444444-2222-4333-8444-555555555552', 'Future event', 'A friendly community gathering.', 'Town square', now() + interval '1 day', 'UTC', array['Fitness'], 0, '18+', false),
  ('55555555-2222-4333-8444-555555555552', '44444444-2222-4333-8444-555555555552', 'Past event', 'A friendly community gathering.', 'Town square', now() - interval '1 day', 'UTC', array['Fitness'], 0, '18+', false),
  ('55555555-2222-4333-8444-555555555553', '44444444-2222-4333-8444-555555555552', 'Cancelled event', 'A friendly community gathering.', 'Town square', now() + interval '2 days', 'UTC', array['Fitness'], 0, '18+', false);
update public.events set status = 'cancelled' where id = '55555555-2222-4333-8444-555555555553';
set local role authenticated;
select set_config('request.jwt.claim.sub', '44444444-2222-4333-8444-555555555551', true);
select set_config('request.jwt.claims', '{"sub":"44444444-2222-4333-8444-555555555551","role":"authenticated"}', true);
insert into public.event_interests (user_id, event_id) values ('44444444-2222-4333-8444-555555555551', '55555555-2222-4333-8444-555555555551');
insert into public.event_interests (user_id, event_id) values ('44444444-2222-4333-8444-555555555551', '55555555-2222-4333-8444-555555555551') on conflict (user_id, event_id) do nothing;
do $$
declare unavailable uuid;
begin
  if (select count(*) from public.event_interests) <> 1 then raise exception 'Duplicate save or own read failed'; end if;
  begin
    insert into public.event_interests (user_id, event_id) values ('44444444-2222-4333-8444-555555555552', '55555555-2222-4333-8444-555555555551');
    raise exception 'Forged user interest was allowed';
  exception when insufficient_privilege then null;
  end;
  foreach unavailable in array array['55555555-2222-4333-8444-555555555552'::uuid, '55555555-2222-4333-8444-555555555553'::uuid] loop
    begin
      insert into public.event_interests (user_id, event_id) values ('44444444-2222-4333-8444-555555555551', unavailable);
      raise exception 'Unavailable event interest was allowed';
    exception when insufficient_privilege then null;
    end;
  end loop;
end $$;
select set_config('request.jwt.claim.sub', '44444444-2222-4333-8444-555555555552', true);
select set_config('request.jwt.claims', '{"sub":"44444444-2222-4333-8444-555555555552","role":"authenticated"}', true);
do $$
begin
  if exists (select 1 from public.event_interests) then raise exception 'Another user interest was visible'; end if;
end $$;
reset role;
rollback;
