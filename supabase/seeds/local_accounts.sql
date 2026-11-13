-- Local development only. These public demo credentials must not be used in production.
begin;
create extension if not exists pgcrypto with schema extensions;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, confirmation_token, recovery_token, email_change_token_new,
  email_change, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
select md5('meetqt-local-account-' || n)::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated',
  'demo' || n || '@example.com', extensions.crypt('MeetQ-Demo-2026!', extensions.gen_salt('bf')),
  now(), '', '', '', '', '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb, now(), now()
from generate_series(1, 2) n;

insert into auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
select gen_random_uuid(), id, id::text,
  jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true),
  'email', now(), now()
from auth.users where id in (md5('meetqt-local-account-1')::uuid, md5('meetqt-local-account-2')::uuid);

update public.profiles p set
  display_name = case when p.id = md5('meetqt-local-account-1')::uuid then 'Demo Alex' else 'Demo Sam' end,
  interests = source.interests, compatibility_answers = source.compatibility_answers,
  matching_opt_in = true, onboarding_completed_at = now()
from public.profiles source
where source.id = md5('meetq-demo-users-v1-1')::uuid
  and p.id in (md5('meetqt-local-account-1')::uuid, md5('meetqt-local-account-2')::uuid);
commit;
