-- Run in a test Supabase database after 0011. All fixtures are rolled back.
begin;
do $$
declare n integer; member integer; event_id uuid;
begin
  for member in 1..13 loop
    insert into auth.users(id, email) values (md5('match-user-' || member)::uuid, 'match-' || member || '@example.invalid');
    update public.profiles set matching_opt_in = true, onboarding_completed_at = now(),
      display_name = 'Member ' || member, interests = case when member <= 3 then array['Coffee'] else array['Running'] end, compatibility_answers = '{"pace":"relaxed"}'
    where id = md5('match-user-' || member)::uuid;
  end loop;
  for n in 1..14 loop
    event_id := md5('match-event-' || n)::uuid;
    insert into public.events(id, creator_id, title, description, location, starts_at, time_zone, categories, price_cents, audience, rsvp_required)
    values(event_id, md5('match-user-1')::uuid, 'Matching test ' || n, 'A community event for matching tests.', 'Town square',
      now() + case when n = 14 then interval '13 hours' else interval '6 hours' end,
      'UTC', array['Fitness'], 0, '18+', false);
    for member in 1..least(n, 13) loop
      insert into public.event_interests(user_id, event_id) values(md5('match-user-' || member)::uuid, event_id);
    end loop;
  end loop;
end $$;
select public.generate_due_event_matches();
do $$
declare n integer; actual integer; groups integer; smallest integer; largest integer; snapshot jsonb;
begin
  if exists (select 1 from public.event_match_members where event_id = md5('match-event-1')::uuid) then raise exception 'Singleton assigned'; end if;
  if exists (select 1 from public.event_match_runs where event_id = md5('match-event-14')::uuid) then raise exception 'Generated too early'; end if;
  for n in 2..13 loop
    select count(*) into actual from public.event_match_members where event_id = md5('match-event-' || n)::uuid;
    if actual <> n then raise exception 'Missing or duplicate assignment for pool %', n; end if;
    select count(*), min(size), max(size) into groups, smallest, largest from (
      select count(*) size from public.event_match_members where event_id = md5('match-event-' || n)::uuid group by group_number
    ) sizes;
    if n <= 5 and (groups <> 1 or largest <> n) then raise exception 'Small pool split'; end if;
    if n >= 6 and (smallest < 2 or largest > 4) then raise exception 'Invalid group sizes'; end if;
  end loop;
  if exists (
    select m.group_number from public.event_match_members m join public.profiles p on p.id = m.user_id
    where m.event_id = md5('match-event-6')::uuid group by m.group_number
    having count(distinct p.interests) <> 1
  ) then raise exception 'Shared interests were not preferred'; end if;
  select jsonb_agg(to_jsonb(m) order by event_id, user_id) into snapshot from public.event_match_members m;
  perform public.generate_due_event_matches();
  if snapshot <> (select jsonb_agg(to_jsonb(m) order by event_id, user_id) from public.event_match_members m) then raise exception 'Retry changed assignments'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub', md5('match-user-1')::uuid::text, true);
select set_config('request.jwt.claims', jsonb_build_object('sub', md5('match-user-1')::uuid, 'role', 'authenticated')::text, true);
do $$
declare response jsonb; item jsonb; shared jsonb; member integer; allowed integer := 0; affected integer;
begin
  response := public.my_event_matches();
  select value into item from jsonb_array_elements(response) where value->>'event_id' = md5('match-event-14')::uuid::text;
  if item->>'status' <> 'waiting' or jsonb_array_length(item->'members') <> 0 then raise exception 'Early disclosure'; end if;
  select value into item from jsonb_array_elements(response) where value->>'event_id' = md5('match-event-1')::uuid::text;
  if item->>'status' <> 'unmatched' then raise exception 'Solo user did not get no-match state'; end if;
  select value into item from jsonb_array_elements(response) where value->>'event_id' = md5('match-event-5')::uuid::text;
  if item->>'status' <> 'matched' or jsonb_array_length(item->'members') <> 4 then raise exception 'Wrong peer list'; end if;
  if exists (
    select 1 from jsonb_array_elements(response) r, jsonb_array_elements(r->'members') m
    where m->>'id' = md5('match-user-1')::uuid::text
  ) then raise exception 'Viewer included in peer list'; end if;
  if response::text like '%email%' then raise exception 'Private field leaked'; end if;
  begin
    perform * from public.event_match_members;
    raise exception 'Raw memberships accessible';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.generate_due_event_matches();
    raise exception 'User can run privileged scheduler';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
-- A late join repairs a singleton on the next scheduler tick.
insert into public.event_interests(user_id, event_id) values(md5('match-user-2')::uuid, md5('match-event-1')::uuid);
select public.generate_due_event_matches();
do $$ begin
  if (select count(*) from public.event_match_members where event_id = md5('match-event-1')::uuid) <> 2 then raise exception 'Late join not matched'; end if;
end $$;
-- Opt-out takes effect immediately for reads, even before the scheduler reconciles.
update public.profiles set matching_opt_in = false where id = md5('match-user-2')::uuid;
set local role authenticated;
do $$
declare item jsonb;
begin
  select value into item from jsonb_array_elements(public.my_event_matches()) where value->>'event_id' = md5('match-event-1')::uuid::text;
  if item->>'status' <> 'processing' or jsonb_array_length(item->'members') <> 0 then raise exception 'Stale opted-out member visible'; end if;
end $$;
reset role;
select public.generate_due_event_matches();
update public.events set status = 'cancelled' where id = md5('match-event-3')::uuid;
update public.events set starts_at = now() - interval '1 minute' where id = md5('match-event-5')::uuid;
set local role authenticated;
do $$ begin
  if exists(select 1 from jsonb_array_elements(public.my_event_matches()) where value->>'event_id' = md5('match-event-3')::uuid::text) then raise exception 'Cancelled event revealed'; end if;
end $$;
select set_config('request.jwt.claim.sub', md5('match-user-2')::uuid::text, true);
select set_config('request.jwt.claims', jsonb_build_object('sub', md5('match-user-2')::uuid, 'role', 'authenticated')::text, true);
do $$ begin
  if public.my_event_matches() <> '[]'::jsonb then raise exception 'Opted-out user can read matches'; end if;
end $$;
reset role;
rollback;
