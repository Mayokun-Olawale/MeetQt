alter table public.profiles
  add column if not exists instagram_handle text;

alter table public.profiles
  add constraint profiles_instagram_handle_format
  check (
    instagram_handle is null
    or instagram_handle ~ '^@?[A-Za-z0-9._]{1,30}$'
  );
