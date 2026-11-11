-- Run manually in the Supabase SQL Editor as administrator after migrations.
-- Creates 30 fictional, non-login test users: 24 opted in and 6 opted out.
-- No passwords, auth identities, email sends, events, or event interests are created.
-- Rerunning preserves any edits already made to these test profiles.
begin;
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
commit;
