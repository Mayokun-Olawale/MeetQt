export const interestCategories = [
  {
    category: "Arts & Crafts",
    interests: ["Painting", "Drawing", "Crocheting", "Sewing", "Pottery", "Scrapbooking"],
  },
  {
    category: "Music & Performing Arts",
    interests: ["Singing", "Instruments", "Dancing", "Concerts", "Theater"],
  },
  {
    category: "Sports & Fitness",
    interests: ["Running", "Gym", "Yoga", "Pickleball", "Golf", "Basketball"],
  },
  {
    category: "Outdoors & Adventure",
    interests: ["Hiking", "Camping", "Fishing", "Nature", "Kayaking"],
  },
  {
    category: "Gaming & Entertainment",
    interests: ["Gaming", "Anime", "Cosplay", "Movies", "TV Shows", "Board Games"],
  },
  {
    category: "Food & Drinks",
    interests: ["Baking", "Cooking", "Restaurants", "Coffee", "Food Festivals"],
  },
  {
    category: "Learning & Creativity",
    interests: ["Reading", "Writing", "Languages", "Blogging", "Podcasting", "Photography"],
  },
  {
    category: "Travel & Exploration",
    interests: ["Traveling", "Road Trips", "Museums", "Sightseeing", "Cultural Events"],
  },
  {
    category: "Fashion & Lifestyle",
    interests: ["Shopping", "Thrifting", "Fashion", "Beauty"],
  },
  {
    category: "Social & Community",
    interests: ["Parties", "Festivals", "Volunteering", "Networking", "Community Events"],
  },
] as const;

export const compatibilityQuestions = [
  {
    id: "fridayNight",
    question: "What's your ideal Friday night?",
    answers: ["Staying in", "Dinner with friends", "Going out", "Anything spontaneous"],
  },
  {
    id: "friendGroupRole",
    question: "What role do you play in a friend group?",
    answers: ["The planner", "The funny one", "The listener", "The spontaneous one"],
  },
  {
    id: "socialBattery",
    question: "What's your social battery like?",
    answers: ["Runs out quickly", "Depends on the day", "Usually full"],
  },
  {
    id: "lastMinutePlans",
    question: "How do you feel about last-minute plans?",
    answers: ["Love them", "Sometimes", "Need advance notice"],
  },
  {
    id: "idealWeekend",
    question: "What's your ideal weekend?",
    answers: ["Relaxing at home", "Exploring somewhere new", "Doing something active", "Hanging with friends"],
  },
  {
    id: "partyLocation",
    question: "At a party, where would we find you?",
    answers: ["Talking to everyone", "With a small group", "Near the snacks", "Making new friends"],
  },
  {
    id: "friendDescription",
    question: "How would your friends describe you?",
    answers: ["Adventurous", "Chill", "Outgoing", "Thoughtful", "Funny", "Creative"],
  },
  {
    id: "awkwardSilence",
    question: "How do you feel about awkward silence?",
    answers: ["Comfortable", "Depends on the person", "I try to fill it"],
  },
  {
    id: "conversations",
    question: "What kind of conversations do you enjoy?",
    answers: ["Deep talks", "Funny stories", "Casual chatting", "A mix"],
  },
  {
    id: "planChanges",
    question: "What happens when plans change?",
    answers: ["I adapt easily", "I need a moment", "I prefer sticking to the plan"],
  },
] as const;
