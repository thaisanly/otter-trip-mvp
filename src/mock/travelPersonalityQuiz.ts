// ===== TYPE DEFINITIONS =====

export type QuizQuestion = {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
};

export type QuizOption = {
  id: string;
  label: string;
  icon: string;
  description?: string;
};

export type PersonalityType = {
  id: string;
  type: string;
  description: string;
  icon: string;
  traits: string[];
  matches: ExpertMatch[];
};

export type ExpertMatch = {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  matchPercentage: number;
  specialties: string[];
  languages: string[];
  experience: number;
  tourCount: number;
};

// ===== QUIZ QUESTIONS DATA =====

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'pace',
    question: "What's your ideal travel pace?",
    description: 'This helps us understand how you like to structure your time while traveling.',
    options: [
      {
        id: 'relaxed',
        label: 'Relaxed & Unhurried',
        icon: '🧘',
        description: 'I prefer taking my time, with plenty of downtime between activities',
      },
      {
        id: 'balanced',
        label: 'Balanced Mix',
        icon: '⚖️',
        description: 'I like a good mix of planned activities and free time',
      },
      {
        id: 'active',
        label: 'Active & Packed',
        icon: '🏃',
        description: 'I want to maximize my time and experience as much as possible',
      },
    ],
  },
  {
    id: 'accommodation',
    question: "What's your preferred accommodation style?",
    options: [
      {
        id: 'luxury',
        label: 'Luxury & Comfort',
        icon: '🏨',
        description: 'High-end hotels with all amenities',
      },
      {
        id: 'boutique',
        label: 'Boutique & Unique',
        icon: '🏡',
        description: 'Charming, smaller hotels with character',
      },
      {
        id: 'local',
        label: 'Authentic & Local',
        icon: '🏠',
        description: 'Homestays, guesthouses, or local accommodations',
      },
      {
        id: 'budget',
        label: 'Practical & Budget',
        icon: '🎒',
        description: 'Hostels or budget-friendly options',
      },
    ],
  },
  {
    id: 'activities',
    question: 'Which activities do you enjoy most while traveling?',
    description: 'Select all that apply to you.',
    options: [
      {
        id: 'adventure',
        label: 'Adventure & Outdoors',
        icon: '🧗',
        description: 'Hiking, water sports, physical activities',
      },
      {
        id: 'culture',
        label: 'Culture & History',
        icon: '🏛️',
        description: 'Museums, historical sites, local traditions',
      },
      {
        id: 'food',
        label: 'Food & Cuisine',
        icon: '🍜',
        description: 'Culinary experiences, cooking classes, food tours',
      },
      {
        id: 'relaxation',
        label: 'Relaxation & Wellness',
        icon: '🌴',
        description: 'Beaches, spas, yoga, peaceful settings',
      },
    ],
  },
  {
    id: 'group-size',
    question: "What's your preferred group size when traveling?",
    options: [
      {
        id: 'solo',
        label: 'Solo Travel',
        icon: '🧍',
        description: 'I prefer traveling on my own',
      },
      {
        id: 'couple',
        label: 'Couple/With Partner',
        icon: '👫',
        description: 'Just me and my partner',
      },
      {
        id: 'small',
        label: 'Small Group',
        icon: '👥',
        description: '3-8 people, intimate setting',
      },
      {
        id: 'large',
        label: 'Larger Group',
        icon: '👨‍👩‍👧‍👦',
        description: 'I enjoy the energy of larger groups',
      },
    ],
  },
  {
    id: 'planning',
    question: 'How do you prefer to plan your trips?',
    options: [
      {
        id: 'detailed',
        label: 'Detailed Itinerary',
        icon: '📝',
        description: 'I like having everything planned in advance',
      },
      {
        id: 'flexible',
        label: 'Flexible Framework',
        icon: '🗓️',
        description: 'I plan major activities but leave room for spontaneity',
      },
      {
        id: 'spontaneous',
        label: 'Spontaneous',
        icon: '🎲',
        description: 'I prefer minimal planning and going with the flow',
      },
    ],
  },
  {
    id: 'food-adventure',
    question: "What's your food adventure level?",
    options: [
      {
        id: 'adventurous',
        label: 'Very Adventurous',
        icon: '🦞',
        description: "I'll try anything, the more unusual the better",
      },
      {
        id: 'open',
        label: 'Open to New Things',
        icon: '🍲',
        description: 'I enjoy trying local cuisine but have some limits',
      },
      {
        id: 'cautious',
        label: 'Somewhat Cautious',
        icon: '🍕',
        description: 'I stick to familiar foods with occasional ventures',
      },
      {
        id: 'comfort',
        label: 'Comfort Foods',
        icon: '🍔',
        description: "I prefer familiar foods that I know I'll enjoy",
      },
    ],
  },
  {
    id: 'budget',
    question: "What's your typical travel budget approach?",
    options: [
      {
        id: 'luxury',
        label: 'Luxury Experience',
        icon: '💎',
        description: "I'm willing to spend for premium experiences",
      },
      {
        id: 'mid-range',
        label: 'Mid-range',
        icon: '💰',
        description: 'I balance cost with quality, occasional splurges',
      },
      {
        id: 'budget',
        label: 'Budget-conscious',
        icon: '💵',
        description: 'I look for good value and affordable options',
      },
      {
        id: 'backpacker',
        label: 'Backpacker Style',
        icon: '🎒',
        description: 'I stretch my budget to travel longer',
      },
    ],
  },
];

// ===== PERSONALITY TYPES DATA =====

export const personalityTypes: PersonalityType[] = [
  {
    id: 'cultural-explorer',
    type: 'Cultural Explorer',
    description:
      'You travel to immerse yourself in different cultures, learn about history, and experience authentic local traditions. You value meaningful connections with locals and seek to understand the places you visit on a deeper level.',
    icon: '🏛️',
    traits: [
      'Cultural immersion',
      'History buff',
      'Local experiences',
      'Authentic cuisine',
      'Museum lover',
    ],
    matches: [
      {
        id: '1',
        name: 'Sarah Johnson',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Kyoto, Japan',
        rating: 4.9,
        matchPercentage: 95,
        specialties: ['Cultural Tours', 'Historical Sites', 'Local Traditions'],
        languages: ['English', 'Japanese'],
        experience: 8,
        tourCount: 120,
      },
      {
        id: '2',
        name: 'Miguel Santos',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Barcelona, Spain',
        rating: 4.8,
        matchPercentage: 92,
        specialties: ['Art History', 'Architecture', 'Museums'],
        languages: ['English', 'Spanish', 'Catalan'],
        experience: 6,
        tourCount: 85,
      },
      {
        id: '3',
        name: 'Aisha Patel',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Delhi, India',
        rating: 4.7,
        matchPercentage: 88,
        specialties: ['Heritage Sites', 'Religious History', 'Cultural Festivals'],
        languages: ['English', 'Hindi', 'Urdu'],
        experience: 10,
        tourCount: 150,
      },
    ],
  },
  {
    id: 'adventure-seeker',
    type: 'Adventure Seeker',
    description:
      "You're drawn to thrilling experiences, outdoor activities, and pushing your comfort zone while traveling. You crave adrenaline and physical challenges, and your best travel memories often involve conquering fears or testing your limits.",
    icon: '🧗‍♂️',
    traits: [
      'Thrill-seeker',
      'Outdoor enthusiast',
      'Active lifestyle',
      'Nature lover',
      'Spontaneous',
    ],
    matches: [
      {
        id: '4',
        name: 'James Wilson',
        image:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Queenstown, New Zealand',
        rating: 4.9,
        matchPercentage: 97,
        specialties: ['Extreme Sports', 'Hiking', 'Mountain Biking'],
        languages: ['English'],
        experience: 12,
        tourCount: 210,
      },
      {
        id: '5',
        name: 'Alex Rivera',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Costa Rica',
        rating: 4.8,
        matchPercentage: 94,
        specialties: ['Rainforest Adventures', 'Surfing', 'Zip-lining'],
        languages: ['English', 'Spanish'],
        experience: 9,
        tourCount: 175,
      },
      {
        id: '6',
        name: 'Emma Chen',
        image:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Chiang Mai, Thailand',
        rating: 4.7,
        matchPercentage: 89,
        specialties: ['Jungle Trekking', 'Rock Climbing', 'Whitewater Rafting'],
        languages: ['English', 'Thai', 'Mandarin'],
        experience: 7,
        tourCount: 130,
      },
    ],
  },
  {
    id: 'culinary-enthusiast',
    type: 'Culinary Enthusiast',
    description:
      'Your travels revolve around food experiences, from street food to fine dining, cooking classes, and food markets. You believe that understanding a culture starts with its cuisine, and your itineraries are planned around culinary discoveries.',
    icon: '🍜',
    traits: [
      'Food lover',
      'Cooking enthusiast',
      'Market explorer',
      'Flavor adventurer',
      'Culinary curious',
    ],
    matches: [
      {
        id: '7',
        name: 'Thomas Laurent',
        image:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Lyon, France',
        rating: 4.9,
        matchPercentage: 96,
        specialties: ['Gourmet Tours', 'Wine Tasting', 'Cooking Classes'],
        languages: ['English', 'French'],
        experience: 15,
        tourCount: 230,
      },
      {
        id: '8',
        name: 'Mei Lin',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Hong Kong',
        rating: 4.8,
        matchPercentage: 93,
        specialties: ['Street Food', 'Dim Sum', 'Market Tours'],
        languages: ['English', 'Cantonese', 'Mandarin'],
        experience: 8,
        tourCount: 145,
      },
      {
        id: '9',
        name: 'Sofia Romano',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Rome, Italy',
        rating: 4.9,
        matchPercentage: 91,
        specialties: ['Pasta Making', 'Food History', 'Regional Cuisine'],
        languages: ['English', 'Italian'],
        experience: 11,
        tourCount: 190,
      },
    ],
  },
  {
    id: 'relaxation-seeker',
    type: 'Relaxation Seeker',
    description:
      'You view travel as an opportunity to unwind and recharge. Your ideal vacation involves beautiful settings, comfortable accommodations, and a slower pace that allows you to truly relax. You appreciate wellness experiences and peaceful environments.',
    icon: '🌴',
    traits: [
      'Peace lover',
      'Wellness focused',
      'Beach enthusiast',
      'Slow travel',
      'Comfort seeker',
    ],
    matches: [
      {
        id: '10',
        name: 'Elena Petrova',
        image:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Bali, Indonesia',
        rating: 4.8,
        matchPercentage: 98,
        specialties: ['Wellness Retreats', 'Yoga', 'Beach Getaways'],
        languages: ['English', 'Russian', 'Indonesian'],
        experience: 9,
        tourCount: 160,
      },
      {
        id: '11',
        name: 'David Kim',
        image:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Maldives',
        rating: 4.9,
        matchPercentage: 95,
        specialties: ['Island Retreats', 'Spa Experiences', 'Sunset Cruises'],
        languages: ['English', 'Korean'],
        experience: 7,
        tourCount: 110,
      },
      {
        id: '12',
        name: 'Maria Costa',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Santorini, Greece',
        rating: 4.7,
        matchPercentage: 90,
        specialties: ['Scenic Tours', 'Relaxing Getaways', 'Luxury Experiences'],
        languages: ['English', 'Greek', 'Portuguese'],
        experience: 6,
        tourCount: 95,
      },
    ],
  },
];
