-- Run against a local/test Supabase database after applying migrations.
-- All fixtures and updates are rolled back.
begin;
insert into auth.users (id, email) values
  ('11111111-2222-4333-8444-555555555551', 'meetq-owner-test@example.invalid'),
  ('11111111-2222-4333-8444-555555555552', 'meetq-other-test@example.invalid');
set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-2222-4333-8444-555555555551', true);
select set_config('request.jwt.claims', '{"sub":"11111111-2222-4333-8444-555555555551","role":"authenticated"}', true);
do $$
declare affected integer;
begin
  if (select count(*) from public.profiles) <> 1 then
    raise exception 'An account must see only its own profile';
  end if;
  if (select onboarding_completed_at from public.profiles) is not null then
    raise exception 'New profiles must start incomplete';
  end if;
  update public.profiles set display_name = 'Owner' where id = '11111111-2222-4333-8444-555555555551';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Owner update failed'; end if;
  update public.profiles set display_name = 'Not allowed' where id = '11111111-2222-4333-8444-555555555552';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Cross-account update was allowed'; end if;
end $$;
reset role;
do $$
begin
  if (select display_name from public.profiles where id = '11111111-2222-4333-8444-555555555552') is not null then
    raise exception 'The other profile was changed';
  end if;
end $$;
rollback;
