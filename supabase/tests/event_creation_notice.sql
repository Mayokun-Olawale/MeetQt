-- Run after migrations in a test Supabase database. Fixtures are rolled back.
begin;
insert into auth.users (id, email) values ('66666666-2222-4333-8444-555555555551', 'notice-test@example.invalid');
update public.profiles set onboarding_completed_at = now() where id = '66666666-2222-4333-8444-555555555551';
insert into storage.objects (bucket_id, name) values ('event-flyers', '66666666-2222-4333-8444-555555555551/test.png');
set local role authenticated;
select set_config('request.jwt.claim.sub', '66666666-2222-4333-8444-555555555551', true);
select set_config('request.jwt.claims', '{"sub":"66666666-2222-4333-8444-555555555551","role":"authenticated"}', true);
do $$
begin
  begin
    insert into public.events (creator_id, title, description, location, starts_at, time_zone, categories, price_cents, audience, rsvp_required, flyer_path)
    values ('66666666-2222-4333-8444-555555555551', 'Too soon', 'A friendly community gathering.', 'Town square', statement_timestamp() + interval '24 hours' - interval '1 millisecond', 'UTC', array['Fitness'], 0, '18+', false, '66666666-2222-4333-8444-555555555551/test.png');
    raise exception 'Less than 24 hours notice was allowed';
  exception when insufficient_privilege then null;
  end;
  insert into public.events (creator_id, title, description, location, starts_at, time_zone, categories, price_cents, audience, rsvp_required, flyer_path)
  values ('66666666-2222-4333-8444-555555555551', 'Enough notice', 'A friendly community gathering.', 'Town square', statement_timestamp() + interval '24 hours', 'UTC', array['Fitness'], 0, '18+', false, '66666666-2222-4333-8444-555555555551/test.png');
end $$;
reset role;
rollback;
