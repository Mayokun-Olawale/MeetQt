-- VIDEO DEMO: run this complete file in Supabase SQL Editor as administrator.
-- Filming accounts: mayolawale2@gmail.com and pelumiovershares@gmail.com.
-- Requires migrations 0001–0012. Rerun before filming to reset dates and scenes.
begin;
-- Run manually in the Supabase SQL Editor as administrator after migrations.
-- Creates 30 fictional, non-login test users: 24 opted in and 6 opted out.
-- No passwords, auth identities, email sends, events, or event interests are created.
-- Rerunning preserves any edits already made to these test profiles.

create temporary table meetq_demo_profiles on commit drop as
select md5('meetq-demo-users-v1-' || seed.sequence)::uuid as id,
  'meetq-demo-' || lpad(seed.sequence::text, 2, '0') || '@example.invalid' as email,
  seed.*
from jsonb_to_recordset($seed$[
  {
    "sequence": 1,
    "display_name": "[Test] Avery Brooks",
    "interests": [
      "Hiking",
      "Camping",
      "Nature",
      "Photography",
      "Coffee"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Staying in",
      "friendGroupRole": "The funny one",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Relaxing at home",
      "partyLocation": "With a small group",
      "friendDescription": "Adventurous",
      "awkwardSilence": "Depends on the person",
      "conversations": "Deep talks",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 2,
    "display_name": "[Test] Jordan Ellis",
    "interests": [
      "Hiking",
      "Camping",
      "Nature",
      "Photography",
      "Traveling"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Staying in",
      "friendGroupRole": "The funny one",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Relaxing at home",
      "partyLocation": "With a small group",
      "friendDescription": "Adventurous",
      "awkwardSilence": "Depends on the person",
      "conversations": "Deep talks",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 3,
    "display_name": "[Test] Morgan Reed",
    "interests": [
      "Hiking",
      "Camping",
      "Nature",
      "Photography",
      "Traveling"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Staying in",
      "friendGroupRole": "The funny one",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Relaxing at home",
      "partyLocation": "With a small group",
      "friendDescription": "Adventurous",
      "awkwardSilence": "Depends on the person",
      "conversations": "Deep talks",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 4,
    "display_name": "[Test] Taylor Quinn",
    "interests": [
      "Hiking",
      "Camping",
      "Nature",
      "Photography",
      "Traveling"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Chill",
      "awkwardSilence": "I try to fill it",
      "conversations": "Funny stories",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 5,
    "display_name": "[Test] Casey Lane",
    "interests": [
      "Hiking",
      "Camping",
      "Nature",
      "Photography",
      "Traveling"
    ],
    "matching_opt_in": false,
    "compatibility_answers": {
      "fridayNight": "Staying in",
      "friendGroupRole": "The funny one",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Relaxing at home",
      "partyLocation": "With a small group",
      "friendDescription": "Adventurous",
      "awkwardSilence": "Depends on the person",
      "conversations": "Deep talks",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 6,
    "display_name": "[Test] Riley Chen",
    "interests": [
      "Painting",
      "Pottery",
      "Museums",
      "Reading",
      "Basketball"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Chill",
      "awkwardSilence": "I try to fill it",
      "conversations": "Funny stories",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 7,
    "display_name": "[Test] Cameron Blake",
    "interests": [
      "Painting",
      "Pottery",
      "Museums",
      "Reading",
      "Coffee"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Chill",
      "awkwardSilence": "I try to fill it",
      "conversations": "Funny stories",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 8,
    "display_name": "[Test] Skyler Patel",
    "interests": [
      "Painting",
      "Pottery",
      "Museums",
      "Reading",
      "Coffee"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Chill",
      "awkwardSilence": "I try to fill it",
      "conversations": "Funny stories",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 9,
    "display_name": "[Test] Jamie Rivera",
    "interests": [
      "Painting",
      "Pottery",
      "Museums",
      "Reading",
      "Coffee"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Going out",
      "friendGroupRole": "The spontaneous one",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Doing something active",
      "partyLocation": "Making new friends",
      "friendDescription": "Outgoing",
      "awkwardSilence": "Comfortable",
      "conversations": "Casual chatting",
      "planChanges": "I prefer sticking to the plan"
    }
  },
  {
    "sequence": 10,
    "display_name": "[Test] Parker Hayes",
    "interests": [
      "Painting",
      "Pottery",
      "Museums",
      "Reading",
      "Coffee"
    ],
    "matching_opt_in": false,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Chill",
      "awkwardSilence": "I try to fill it",
      "conversations": "Funny stories",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 11,
    "display_name": "[Test] Quinn Davis",
    "interests": [
      "Running",
      "Gym",
      "Yoga",
      "Pickleball",
      "Cooking"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Going out",
      "friendGroupRole": "The spontaneous one",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Doing something active",
      "partyLocation": "Making new friends",
      "friendDescription": "Outgoing",
      "awkwardSilence": "Comfortable",
      "conversations": "Casual chatting",
      "planChanges": "I prefer sticking to the plan"
    }
  },
  {
    "sequence": 12,
    "display_name": "[Test] Rowan Kim",
    "interests": [
      "Running",
      "Gym",
      "Yoga",
      "Pickleball",
      "Basketball"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Going out",
      "friendGroupRole": "The spontaneous one",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Doing something active",
      "partyLocation": "Making new friends",
      "friendDescription": "Outgoing",
      "awkwardSilence": "Comfortable",
      "conversations": "Casual chatting",
      "planChanges": "I prefer sticking to the plan"
    }
  },
  {
    "sequence": 13,
    "display_name": "[Test] Sage Bennett",
    "interests": [
      "Running",
      "Gym",
      "Yoga",
      "Pickleball",
      "Basketball"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Going out",
      "friendGroupRole": "The spontaneous one",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Doing something active",
      "partyLocation": "Making new friends",
      "friendDescription": "Outgoing",
      "awkwardSilence": "Comfortable",
      "conversations": "Casual chatting",
      "planChanges": "I prefer sticking to the plan"
    }
  },
  {
    "sequence": 14,
    "display_name": "[Test] Emerson Cole",
    "interests": [
      "Running",
      "Gym",
      "Yoga",
      "Pickleball",
      "Basketball"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Anything spontaneous",
      "friendGroupRole": "The planner",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Hanging with friends",
      "partyLocation": "Talking to everyone",
      "friendDescription": "Thoughtful",
      "awkwardSilence": "Depends on the person",
      "conversations": "A mix",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 15,
    "display_name": "[Test] Finley Scott",
    "interests": [
      "Running",
      "Gym",
      "Yoga",
      "Pickleball",
      "Basketball"
    ],
    "matching_opt_in": false,
    "compatibility_answers": {
      "fridayNight": "Going out",
      "friendGroupRole": "The spontaneous one",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Doing something active",
      "partyLocation": "Making new friends",
      "friendDescription": "Outgoing",
      "awkwardSilence": "Comfortable",
      "conversations": "Casual chatting",
      "planChanges": "I prefer sticking to the plan"
    }
  },
  {
    "sequence": 16,
    "display_name": "[Test] Alex Monroe",
    "interests": [
      "Gaming",
      "Board Games",
      "Anime",
      "Movies",
      "Singing"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Anything spontaneous",
      "friendGroupRole": "The planner",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Hanging with friends",
      "partyLocation": "Talking to everyone",
      "friendDescription": "Thoughtful",
      "awkwardSilence": "Depends on the person",
      "conversations": "A mix",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 17,
    "display_name": "[Test] Drew Santos",
    "interests": [
      "Gaming",
      "Board Games",
      "Anime",
      "Movies",
      "Cooking"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Anything spontaneous",
      "friendGroupRole": "The planner",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Hanging with friends",
      "partyLocation": "Talking to everyone",
      "friendDescription": "Thoughtful",
      "awkwardSilence": "Depends on the person",
      "conversations": "A mix",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 18,
    "display_name": "[Test] Reese Walker",
    "interests": [
      "Gaming",
      "Board Games",
      "Anime",
      "Movies",
      "Cooking"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Anything spontaneous",
      "friendGroupRole": "The planner",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Hanging with friends",
      "partyLocation": "Talking to everyone",
      "friendDescription": "Thoughtful",
      "awkwardSilence": "Depends on the person",
      "conversations": "A mix",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 19,
    "display_name": "[Test] Harper Lin",
    "interests": [
      "Gaming",
      "Board Games",
      "Anime",
      "Movies",
      "Cooking"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Staying in",
      "friendGroupRole": "The funny one",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Relaxing at home",
      "partyLocation": "With a small group",
      "friendDescription": "Funny",
      "awkwardSilence": "I try to fill it",
      "conversations": "Deep talks",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 20,
    "display_name": "[Test] Dakota James",
    "interests": [
      "Gaming",
      "Board Games",
      "Anime",
      "Movies",
      "Cooking"
    ],
    "matching_opt_in": false,
    "compatibility_answers": {
      "fridayNight": "Anything spontaneous",
      "friendGroupRole": "The planner",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Hanging with friends",
      "partyLocation": "Talking to everyone",
      "friendDescription": "Thoughtful",
      "awkwardSilence": "Depends on the person",
      "conversations": "A mix",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 21,
    "display_name": "[Test] Blair Adams",
    "interests": [
      "Concerts",
      "Dancing",
      "Festivals",
      "Parties",
      "Baking"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Staying in",
      "friendGroupRole": "The funny one",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Relaxing at home",
      "partyLocation": "With a small group",
      "friendDescription": "Funny",
      "awkwardSilence": "I try to fill it",
      "conversations": "Deep talks",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 22,
    "display_name": "[Test] Charlie Bell",
    "interests": [
      "Concerts",
      "Dancing",
      "Festivals",
      "Parties",
      "Singing"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Staying in",
      "friendGroupRole": "The funny one",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Relaxing at home",
      "partyLocation": "With a small group",
      "friendDescription": "Funny",
      "awkwardSilence": "I try to fill it",
      "conversations": "Deep talks",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 23,
    "display_name": "[Test] Eden Clarke",
    "interests": [
      "Concerts",
      "Dancing",
      "Festivals",
      "Parties",
      "Singing"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Staying in",
      "friendGroupRole": "The funny one",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Relaxing at home",
      "partyLocation": "With a small group",
      "friendDescription": "Funny",
      "awkwardSilence": "I try to fill it",
      "conversations": "Deep talks",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 24,
    "display_name": "[Test] Hayden Ross",
    "interests": [
      "Concerts",
      "Dancing",
      "Festivals",
      "Parties",
      "Singing"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Creative",
      "awkwardSilence": "Comfortable",
      "conversations": "Funny stories",
      "planChanges": "I prefer sticking to the plan"
    }
  },
  {
    "sequence": 25,
    "display_name": "[Test] Jules Martin",
    "interests": [
      "Concerts",
      "Dancing",
      "Festivals",
      "Parties",
      "Singing"
    ],
    "matching_opt_in": false,
    "compatibility_answers": {
      "fridayNight": "Staying in",
      "friendGroupRole": "The funny one",
      "socialBattery": "Runs out quickly",
      "lastMinutePlans": "Sometimes",
      "idealWeekend": "Relaxing at home",
      "partyLocation": "With a small group",
      "friendDescription": "Funny",
      "awkwardSilence": "I try to fill it",
      "conversations": "Deep talks",
      "planChanges": "I need a moment"
    }
  },
  {
    "sequence": 26,
    "display_name": "[Test] Kai Foster",
    "interests": [
      "Volunteering",
      "Community Events",
      "Networking",
      "Languages",
      "Traveling"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Creative",
      "awkwardSilence": "Comfortable",
      "conversations": "Funny stories",
      "planChanges": "I prefer sticking to the plan"
    }
  },
  {
    "sequence": 27,
    "display_name": "[Test] Logan Price",
    "interests": [
      "Volunteering",
      "Community Events",
      "Networking",
      "Languages",
      "Baking"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Creative",
      "awkwardSilence": "Comfortable",
      "conversations": "Funny stories",
      "planChanges": "I prefer sticking to the plan"
    }
  },
  {
    "sequence": 28,
    "display_name": "[Test] Noel Perry",
    "interests": [
      "Volunteering",
      "Community Events",
      "Networking",
      "Languages",
      "Baking"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Creative",
      "awkwardSilence": "Comfortable",
      "conversations": "Funny stories",
      "planChanges": "I prefer sticking to the plan"
    }
  },
  {
    "sequence": 29,
    "display_name": "[Test] Robin Shaw",
    "interests": [
      "Volunteering",
      "Community Events",
      "Networking",
      "Languages",
      "Baking"
    ],
    "matching_opt_in": true,
    "compatibility_answers": {
      "fridayNight": "Going out",
      "friendGroupRole": "The spontaneous one",
      "socialBattery": "Usually full",
      "lastMinutePlans": "Love them",
      "idealWeekend": "Doing something active",
      "partyLocation": "Making new friends",
      "friendDescription": "Adventurous",
      "awkwardSilence": "Depends on the person",
      "conversations": "Casual chatting",
      "planChanges": "I adapt easily"
    }
  },
  {
    "sequence": 30,
    "display_name": "[Test] Sam Taylor",
    "interests": [
      "Volunteering",
      "Community Events",
      "Networking",
      "Languages",
      "Baking"
    ],
    "matching_opt_in": false,
    "compatibility_answers": {
      "fridayNight": "Dinner with friends",
      "friendGroupRole": "The listener",
      "socialBattery": "Depends on the day",
      "lastMinutePlans": "Need advance notice",
      "idealWeekend": "Exploring somewhere new",
      "partyLocation": "Near the snacks",
      "friendDescription": "Creative",
      "awkwardSilence": "Comfortable",
      "conversations": "Funny stories",
      "planChanges": "I prefer sticking to the plan"
    }
  }
]$seed$::jsonb)
as seed(sequence integer, display_name text, interests text[], matching_opt_in boolean, compatibility_answers jsonb);

do $$
begin
  if exists (
    select 1 from auth.users u join meetq_demo_profiles d on u.id = d.id or u.email = d.email
    where u.id <> d.id or u.email is distinct from d.email
      or u.raw_app_meta_data->>'meetq_seed' is distinct from 'demo-users-v1'
  ) then raise exception 'A seed identifier conflicts with a non-seed account. Nothing was changed.'; end if;
end $$;

insert into auth.users(id, email, aud, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
select id, email, 'authenticated', 'authenticated',
  '{"meetq_seed":"demo-users-v1"}'::jsonb,
  jsonb_build_object('display_name', display_name, 'is_test_user', true), now(), now()
from meetq_demo_profiles
on conflict (id) do nothing;

-- The signup trigger creates the profile row. Fill only incomplete seed profiles.
update public.profiles p set display_name = d.display_name,
  instagram_handle = null, interests = d.interests, matching_opt_in = d.matching_opt_in,
  compatibility_answers = d.compatibility_answers, onboarding_completed_at = now(), updated_at = now()
from meetq_demo_profiles d
where p.id = d.id and p.onboarding_completed_at is null;

select p.id, p.display_name, p.matching_opt_in, p.interests
from public.profiles p join meetq_demo_profiles d on d.id = p.id order by d.sequence;

-- Run demo_users.sql first, then this file in Supabase SQL Editor as admin.
-- Replace the email below with the account used for filming.
-- Rerun immediately before recording: resets only these five demo events,
-- their groups, and the filming account's demo-event interests.
-- Admin fixture insertion allows near-term demo events without weakening the
-- normal app/API 24-hour event-creation rule. No signup emails are sent.

create temporary table meetq_video_config on commit drop as
select 'mayolawale2@gmail.com'::text as email, 'pelumiovershares@gmail.com'::text as second_email, statement_timestamp() as anchor;

create temporary table meetq_video_account on commit drop as
select u.id, lower(u.email) = lower(c.email) as primary_account
from auth.users u join meetq_video_config c on lower(u.email) in (lower(c.email), lower(c.second_email));
do $$ begin
  if (select count(*) from meetq_video_account) <> 2 then
    raise exception 'Both filming accounts must exist: mayolawale2@gmail.com and pelumiovershares@gmail.com.';
  end if;
  if (select count(*) from public.profiles p join meetq_video_account a on p.id = a.id
    where p.onboarding_completed_at is not null and p.matching_opt_in is true) <> 2 then
    raise exception 'Complete onboarding and enable event matching on both filming accounts first.';
  end if;
  if (select count(*) from auth.users where raw_app_meta_data->>'meetq_seed' = 'demo-users-v1') <> 30 then
    raise exception 'Run demo_users.sql first to create the 30 demo attendees.';
  end if;
end $$;

create temporary table meetq_video_events on commit drop as
select md5('meetq-video-event-v1-' || sequence)::uuid as id, v.*
from (values
 (1, 'Coffee & Common Ground', 'Meet new people over coffee, conversation starters, and a relaxed afternoon. Fictional event for the MeetQ demo.', 'The Common Room · Demo venue', 6, array['Social/networking','Educational'], 0, '18+'),
 (2, 'Sunset Sketch Club', 'Bring your sketchbook for a creative meetup with warm-up prompts and plenty of time to chat. All experience levels welcome. Fictional demo event.', 'Golden Hour Studio · Demo venue', 9, array['Arts and crafts','Social/networking'], 1500, '18+'),
 (3, 'Trail & Talk', 'A friendly walk with fresh air and easy conversation. Bring water and comfortable shoes. Fictional event for the MeetQ demo.', 'Lakeside Trail · Demo meeting point', 30, array['Outdoors','Fitness'], 0, 'Family-friendly'),
 (4, 'Rooftop Rhythm', 'Discover live acoustic music and meet people who love a good set. Fictional event for the MeetQ demo.', 'Skyline Terrace · Demo venue', 48, array['Concert','Performance'], 2500, '21+'),
 (5, 'Board Game Social', 'Find your table for cooperative games, quick icebreakers, and a little friendly competition. Beginners welcome. Fictional demo event.', 'The Game Room · Demo venue', 72, array['Social/networking'], 800, '18+')
) v(sequence, title, description, location, hours_away, categories, price_cents, audience);

-- Refuse to modify an unrelated event if a deterministic ID collides.
do $$ begin
  if exists(select 1 from public.events e join meetq_video_events d on e.id = d.id
    where e.description not like '%Fictional%demo%' and e.description not like '%Fictional%Demo%') then
    raise exception 'A demo event ID conflicts with an unrelated event.';
  end if;
end $$;

insert into public.events(id, creator_id, title, description, location, starts_at, time_zone, status,
  categories, price_cents, audience, rsvp_required, rsvp_url)
select d.id, case when d.sequence = 5 then a.id else md5('meetq-demo-users-v1-1')::uuid end,
  d.title, d.description, d.location, c.anchor + d.hours_away * interval '1 hour', 'America/Chicago', 'published',
  d.categories, d.price_cents, d.audience, false, null
from meetq_video_events d cross join meetq_video_config c cross join meetq_video_account a
where a.primary_account
on conflict (id) do update set starts_at = excluded.starts_at, status = 'published';

-- Fake attendance: 4, 9, 7, 12, and 8 people (including opt-out examples).
insert into public.event_interests(user_id, event_id)
select md5('meetq-demo-users-v1-' || attendee)::uuid, d.id
from meetq_video_events d cross join lateral generate_series(1,
  case d.sequence when 1 then 4 when 2 then 9 when 3 then 7 when 4 then 12 else 8 end) attendee
on conflict (user_id, event_id) do nothing;

-- Pre-save the first three for the filming account. Leave the others in Discover.
delete from public.event_interests i using meetq_video_events d, meetq_video_account a
where i.event_id = d.id and i.user_id = a.id;
insert into public.event_interests(user_id, event_id)
select a.id, d.id from meetq_video_account a cross join meetq_video_events d where d.sequence <= 3;

-- Reset only these fixtures and create the two revealed matches immediately.
delete from public.event_match_runs r using meetq_video_events d where r.event_id = d.id;
select public.generate_due_event_matches();

-- Staged demo only: if the two filming accounts landed together, exchange
-- the second account with a seeded attendee in another group. Group sizes stay
-- unchanged; stable-roster scheduler retries preserve these stored assignments.
do $$
declare
  demo_event record;
  first_user uuid;
  second_user uuid;
  first_group integer;
  second_group integer;
  other_group integer;
  swap_user uuid;
begin
  select id into first_user from meetq_video_account where primary_account;
  select id into second_user from meetq_video_account where not primary_account;
  for demo_event in select id from meetq_video_events where sequence <= 2 loop
    select group_number into first_group from public.event_match_members where event_id = demo_event.id and user_id = first_user;
    select group_number into second_group from public.event_match_members where event_id = demo_event.id and user_id = second_user;
    if first_group is null or second_group is null then raise exception 'Demo matching did not assign both filming accounts'; end if;
    if first_group = second_group then
      select m.user_id, m.group_number into swap_user, other_group
      from public.event_match_members m join auth.users u on u.id = m.user_id
      where m.event_id = demo_event.id and m.group_number <> first_group
        and u.raw_app_meta_data->>'meetq_seed' = 'demo-users-v1'
      order by m.group_number, m.user_id limit 1;
      if swap_user is null then raise exception 'No seeded attendee available to stage separate demo groups'; end if;
      update public.event_match_members set group_number = other_group where event_id = demo_event.id and user_id = second_user;
      update public.event_match_members set group_number = first_group where event_id = demo_event.id and user_id = swap_user;
    end if;
  end loop;
end $$;

select d.title, e.starts_at, e.starts_at - interval '12 hours' as reveals_at,
  case when d.sequence <= 2 then 'Revealed match'
       when d.sequence = 3 then 'Countdown in My Matches'
       else 'Available to swipe in Discover' end as demo_scene
from meetq_video_events d join public.events e on e.id = d.id order by d.sequence;

commit;
