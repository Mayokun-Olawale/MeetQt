begin;
alter table public.events
  add column if not exists categories text[],
  add column if not exists price_cents integer,
  add column if not exists audience text,
  add column if not exists rsvp_required boolean,
  add column if not exists rsvp_url text;

-- The description limit is now words, rather than 2,000 characters.
alter table public.events drop constraint if exists events_description_check;
alter table public.events add constraint events_description_check check (char_length(btrim(description)) >= 10);
alter table public.events drop constraint if exists events_categories_check;
alter table public.events add constraint events_categories_check check (
  categories is null or (
    cardinality(categories) between 1 and 3
    and array_position(categories, null) is null
    and categories <@ array['Fitness','Outdoors','Arts and crafts','Concert','Sports','Performance','Community service','Social/networking','Marketplace','Educational']::text[]
  )
);
alter table public.events drop constraint if exists events_price_check;
alter table public.events add constraint events_price_check check (price_cents between 0 and 99999999);
alter table public.events drop constraint if exists events_audience_check;
alter table public.events add constraint events_audience_check check (audience in ('Kid-friendly','Family-friendly','18+','21+'));
alter table public.events drop constraint if exists events_rsvp_check;
alter table public.events add constraint events_rsvp_check check (
  rsvp_required is null or
  (rsvp_required = false and rsvp_url is null) or
  (rsvp_required = true and rsvp_url is not null and char_length(rsvp_url) <= 2000
   and rsvp_url ~* '^https?://[^[:space:]/@]+([/:?#]|$)' and rsvp_url !~ '[[:space:]]')
);

-- Require details on new events without inventing values for older events or
-- preventing their owners from cancelling them.
create or replace function public.validate_new_event_details()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.categories is null or new.price_cents is null or new.audience is null or new.rsvp_required is null then
    raise exception 'Categories, price, audience, and RSVP preference are required.' using errcode = '23514';
  end if;
  if cardinality(new.categories) <> (select count(distinct category) from unnest(new.categories) as category) then
    raise exception 'Choose distinct event categories.' using errcode = '23514';
  end if;
  if cardinality(regexp_split_to_array(btrim(new.description), '[[:space:]]+')) > 250 then
    raise exception 'Description must be 250 words or fewer.' using errcode = '23514';
  end if;
  return new;
end;
$$;
drop trigger if exists validate_new_event_details on public.events;
create trigger validate_new_event_details before insert on public.events
for each row execute function public.validate_new_event_details();
commit;
