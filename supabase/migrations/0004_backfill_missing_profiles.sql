-- Accounts created before the profile trigger also need an incomplete profile.
-- Existing profiles and their completion timestamps are preserved.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;
