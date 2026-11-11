begin;

-- Reuse the match reader's identity, reveal time, event status, opt-in and
-- current-roster checks. Private profile table policies remain owner-only.
create function public.group_member_profile(requested_event uuid, requested_member uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  allowed_match jsonb;
  shared_profile jsonb;
begin
  select match into allowed_match
  from jsonb_array_elements(public.my_event_matches()) match
  where match->>'event_id' = requested_event::text
    and match->>'status' = 'matched'
    and exists (select 1 from jsonb_array_elements(match->'members') member where member->>'id' = requested_member::text);
  if allowed_match is null then return null; end if;

  select jsonb_build_object(
    'id', p.id, 'display_name', p.display_name, 'instagram_handle', p.instagram_handle,
    'interests', p.interests, 'compatibility_answers', p.compatibility_answers,
    'event_title', allowed_match->>'title'
  ) into shared_profile from public.profiles p where p.id = requested_member;
  return shared_profile;
end;
$$;
revoke all on function public.group_member_profile(uuid, uuid) from public, anon;
grant execute on function public.group_member_profile(uuid, uuid) to authenticated;

commit;
