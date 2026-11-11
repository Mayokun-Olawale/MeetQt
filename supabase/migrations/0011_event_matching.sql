begin;

create table public.event_match_runs (
  event_id uuid primary key references public.events(id) on delete cascade,
  eligible_ids uuid[] not null,
  generated_at timestamptz not null default now()
);
create table public.event_match_members (
  event_id uuid not null references public.event_match_runs(event_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  group_number integer not null check (group_number > 0),
  primary key (event_id, user_id)
);
create index event_match_members_user_idx on public.event_match_members(user_id, event_id);
create index event_match_members_group_idx on public.event_match_members(event_id, group_number);
alter table public.event_match_runs enable row level security;
alter table public.event_match_members enable row level security;
-- No direct client access. A narrowly scoped RPC below checks identity and reveal time.
revoke all on public.event_match_runs, public.event_match_members from public, anon, authenticated;

create function public.generate_due_event_matches()
returns void language plpgsql security definer set search_path = '' as $$
declare
  event_row record;
  eligible uuid[];
  previous uuid[];
  remaining uuid[];
  current_group uuid[];
  candidate uuid;
  total integer;
  group_count integer;
  group_size integer;
  group_index integer;
begin
  -- The transaction lock makes scheduled/manual retries safe to run concurrently.
  if not pg_try_advisory_xact_lock(731204, 1) then return; end if;
  for event_row in
    select e.id from public.events e
    where e.status = 'published' and e.starts_at > statement_timestamp()
      and e.starts_at <= statement_timestamp() + interval '12 hours'
    order by e.starts_at, e.id
  loop
    select coalesce(array_agg(p.id order by p.id), '{}'::uuid[]) into eligible
    from public.event_interests i join public.profiles p on p.id = i.user_id
    where i.event_id = event_row.id and p.matching_opt_in is true and p.onboarding_completed_at is not null;
    select r.eligible_ids into previous from public.event_match_runs r where r.event_id = event_row.id;
    if previous is not distinct from eligible then continue; end if;

    insert into public.event_match_runs(event_id, eligible_ids) values (event_row.id, eligible)
    on conflict (event_id) do update set eligible_ids = excluded.eligible_ids, generated_at = statement_timestamp();
    delete from public.event_match_members where event_id = event_row.id;
    total := cardinality(eligible);
    if total < 2 then continue; end if;
    -- 2–5 stay together; larger pools are balanced into groups of 2–4.
    group_count := case when total <= 5 then 1 else (total + 3) / 4 end;
    remaining := eligible;
    for group_index in 1..group_count loop
      group_size := total / group_count + case when group_index <= total % group_count then 1 else 0 end;
      current_group := array[remaining[1]];
      remaining := array_remove(remaining, remaining[1]);
      while cardinality(current_group) < group_size loop
        -- Greedily choose the person with the most shared interests and answers
        -- across this group. UUID ordering breaks ties deterministically.
        select p.id into candidate from public.profiles p where p.id = any(remaining)
        order by (
          select coalesce(sum(
            (select count(*) from unnest(p.interests) interest where interest = any(peer.interests))
            + (select count(*) from jsonb_each_text(p.compatibility_answers) answer
               where peer.compatibility_answers ->> answer.key = answer.value)
          ), 0) from public.profiles peer where peer.id = any(current_group)
        ) desc, p.id
        limit 1;
        current_group := array_append(current_group, candidate);
        remaining := array_remove(remaining, candidate);
      end loop;
      insert into public.event_match_members(event_id, user_id, group_number)
      select event_row.id, member_id, group_index from unnest(current_group) member_id;
    end loop;
  end loop;
end;
$$;
revoke all on function public.generate_due_event_matches() from public, anon, authenticated;
grant execute on function public.generate_due_event_matches() to service_role;

create function public.my_event_matches()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  viewer uuid := (select auth.uid());
  event_row record;
  peers jsonb;
  group_id integer;
  state text;
  result jsonb := '[]'::jsonb;
  eligible uuid[];
  generated uuid[];
begin
  if viewer is null or not exists (
    select 1 from public.profiles p where p.id = viewer
      and p.matching_opt_in is true and p.onboarding_completed_at is not null
  ) then return result; end if;
  for event_row in
    select e.* from public.events e join public.event_interests i on i.event_id = e.id
    where i.user_id = viewer and e.status = 'published' and e.starts_at > statement_timestamp()
    order by e.starts_at, e.id
  loop
    peers := '[]'::jsonb;
    state := 'waiting';
    if statement_timestamp() >= event_row.starts_at - interval '12 hours' then
      select coalesce(array_agg(p.id order by p.id), '{}'::uuid[]) into eligible
      from public.event_interests i join public.profiles p on p.id = i.user_id
      where i.event_id = event_row.id and p.matching_opt_in is true and p.onboarding_completed_at is not null;
      select r.eligible_ids into generated from public.event_match_runs r where r.event_id = event_row.id;
      state := 'processing';
      -- Never expose a stale group after an opt-out or late join; wait for the scheduler.
      if generated is not distinct from eligible then
        state := 'unmatched';
        select m.group_number into group_id from public.event_match_members m
        where m.event_id = event_row.id and m.user_id = viewer;
        if group_id is not null then
          select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', coalesce(p.display_name, 'MeetQ member')) order by p.display_name, p.id), '[]'::jsonb)
          into peers from public.event_match_members m join public.profiles p on p.id = m.user_id
          where m.event_id = event_row.id and m.group_number = group_id and m.user_id <> viewer
            and p.id = any(eligible);
          if jsonb_array_length(peers) > 0 then state := 'matched'; end if;
        end if;
      end if;
    end if;
    result := result || jsonb_build_array(jsonb_build_object(
      'event_id', event_row.id, 'title', event_row.title, 'starts_at', event_row.starts_at,
      'time_zone', event_row.time_zone, 'reveals_at', event_row.starts_at - interval '12 hours',
      'status', state, 'members', peers
    ));
  end loop;
  return result;
end;
$$;
revoke all on function public.my_event_matches() from public, anon;
grant execute on function public.my_event_matches() to authenticated;

-- Supabase Cron runs even when no user has the app open. Results become
-- available on the first tick after the reveal time (normally within one minute).
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('meetq-event-matching', '* * * * *', 'select public.generate_due_event_matches();');

commit;
