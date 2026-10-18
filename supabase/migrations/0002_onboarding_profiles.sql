alter table public.profiles
  add column if not exists display_name text,
  add column if not exists interests text[] not null default '{}',
  add column if not exists matching_opt_in boolean,
  add column if not exists compatibility_answers jsonb not null default '{}'::jsonb,
  add column if not exists onboarding_completed_at timestamptz;

alter table public.profiles
  add constraint profiles_display_name_length
  check (display_name is null or char_length(display_name) between 1 and 80);

alter table public.profiles
  add constraint profiles_interests_count
  check (cardinality(interests) between 0 and 50);
