// ===== SHARED INTERFACES (Used by both listing and detail pages) =====

export interface TourLeader {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  personality: string[];
  languages: string[];
  price: number;
  availability: string;

  // Detail page specific fields (optional for listing)
  tagline?: string;
  coverImage?: string;
  yearsExperience?: number;
  tripsCompleted?: number;
  responseTime?: string;
  about?: string;
  travelPhilosophy?: string;
  countrySpecializations?: CountrySpecialization[];
  travelStories?: TravelStory[];
  tours?: TourOffering[];
  reviews?: Review[];
  certifications?: Certification[];
}

// Legacy interface for backward compatibility
export type TourLeaderData = TourLeader;

// ===== DETAIL PAGE SPECIFIC INTERFACES =====

export interface CountrySpecialization {
  country: string;
  regions: string[];
  expertise: string;
  years: number;
  flagCode: string;
}

export interface TravelStory {
  id: string;
  title: string;
  location: string;
  date: string;
  image?: string; // Keep for backward compatibility
  images?: string[]; // New array structure
  content: string;
  likes: number;
  traits: string[];
}

export interface TourDate {
  id: string;
  date: string;
  spotsLeft: number;
  price?: string;
}

export interface TourOffering {
  id: string;
  title: string;
  image: string;
  duration: string;
  groupSize: string;
  includes: string[];
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  dates: TourDate[];
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  icon: string;
  verified: boolean;
}

// Legacy interface for backward compatibility
export type TourLeaderProfile = TourLeader;

// ===== TOUR LEADER DATA (Complete data for both listing and detail views) =====

export const tourLeaders: TourLeader[] = [
  {
    // === BASIC INFO (Used in SearchResults listing page) ===
    id: '1',
    name: 'Sarah Johnson',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Bali, Indonesia',
    rating: 4.9,
    reviewCount: 127,
    specialties: ['Adventure', 'Photography', 'Culture', 'Nature', 'Hidden Gems'],
    personality: [
      'High-energy',
      'Educational',
      'Social',
      'Photography',
      'Nature-focused',
      'Adventurous',
      'Cultural',
    ],
    languages: ['English', 'Indonesian', 'Spanish'],
    price: 85,
    availability: '3 spots left',

    // === DETAIL PAGE SPECIFIC DATA (Used in TourLeaderProfile page) ===
    tagline: 'Adventure photographer & cultural explorer',
    coverImage:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    yearsExperience: 5,
    tripsCompleted: 342,
    responseTime: '< 1 hour',
    about:
      "Hi there! I'm Sarah, a passionate photographer and adventurer who has called Bali home for the past 5 years. After falling in love with the island's incredible landscapes and rich culture, I decided to share my knowledge and passion with travelers looking for authentic experiences beyond the tourist traps.\n\nI specialize in adventure photography tours, taking you to hidden waterfalls, secret beaches, and stunning rice terraces while helping you capture amazing photos. Whether you're a photography enthusiast or just want to experience the real Bali, I'll customize each tour to match your interests and energy level.\n\nWhen I'm not guiding tours, you'll find me surfing at sunrise, exploring new hiking trails, or immersing myself in local ceremonies. I believe travel should be transformative, and I'm here to help you create meaningful memories that will last a lifetime.",
    travelPhilosophy:
      "I believe travel should be about meaningful connections with both people and places. My approach is to go slow, immerse deeply, and leave a positive impact. I'm passionate about responsible tourism that benefits local communities and preserves natural environments.",
    countrySpecializations: [
      {
        country: 'Indonesia',
        regions: ['Bali', 'Java', 'Lombok'],
        expertise: 'Expert',
        years: 5,
        flagCode: '🇮🇩',
      },
      {
        country: 'Thailand',
        regions: ['Bangkok', 'Chiang Mai', 'Phuket'],
        expertise: 'Advanced',
        years: 3,
        flagCode: '🇹🇭',
      },
      {
        country: 'Vietnam',
        regions: ['Hanoi', 'Ho Chi Minh City'],
        expertise: 'Intermediate',
        years: 2,
        flagCode: '🇻🇳',
      },
    ],
    travelStories: [
      {
        id: 'story1',
        title: 'Finding Serenity at a Hidden Waterfall',
        location: 'Munduk, Bali',
        date: 'March 2023',
        image:
          'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        content:
          "Last month, I ventured deep into the jungles of Munduk to find a waterfall that locals had told me about but isn't on any tourist map. After a challenging 2-hour trek through dense vegetation, I was rewarded with the most breathtaking sight: a 50-meter waterfall cascading into a pristine emerald pool, completely untouched by tourism. I spent the entire afternoon swimming, meditating, and capturing the magical light as it filtered through the canopy. These are the moments that remind me why I fell in love with Bali - there's always another hidden gem waiting to be discovered if you're willing to venture off the beaten path.",
        likes: 156,
        traits: ['Adventurous', 'Nature-focused', 'Photography'],
      },
      {
        id: 'story2',
        title: 'Sunrise Ceremony with a Balinese Priest',
        location: 'Tirta Empul Temple, Bali',
        date: 'January 2023',
        image:
          'https://images.unsplash.com/photo-1604480133435-25b86862d276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        content:
          "I was incredibly honored to be invited to participate in a private purification ceremony at Tirta Empul temple before it opened to the public. A local priest who has become a dear friend guided me through the sacred rituals as the sun rose over the ancient springs. We made offerings, prayed, and then immersed ourselves in the holy water. The experience was deeply spiritual and gave me a much deeper understanding of Balinese Hinduism. What made this experience special wasn't just the ceremony itself, but the personal stories and wisdom the priest shared with me about how these traditions have shaped Balinese culture for centuries.",
        likes: 89,
        traits: ['Cultural', 'Spiritual', 'Educational'],
      },
      {
        id: 'story3',
        title: 'Teaching Photography to Local Children',
        location: 'Sidemen Village, Bali',
        date: 'December 2022',
        image:
          'https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        content:
          'One of my most rewarding experiences has been volunteering at a small school in Sidemen, teaching photography to local children. Last month, we organized a special project where each child was given a simple camera to document their daily life and what makes their village special. The results were incredible - seeing their community through their eyes revealed so many beautiful details I had never noticed before. We created an exhibition of their work for the whole village, and the pride on their faces as they showed their families their photographs was unforgettable. These children have taught me that the most authentic way to understand a place is through the eyes of those who call it home.',
        likes: 203,
        traits: ['Educational', 'Cultural', 'Photography'],
      },
      {
        id: 'story4',
        title: 'Sunset at Mount Batur',
        location: 'Mount Batur, Bali',
        date: 'November 2022',
        image:
          'https://images.unsplash.com/photo-1604608678051-64d46d8d0eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        content:
          'The view from Mount Batur at sunset is absolutely breathtaking. The colors reflecting off Lake Batur create a magical atmosphere.',
        likes: 178,
        traits: ['Nature-focused', 'Photography'],
      },
      {
        id: 'story5',
        title: 'Traditional Dance Performance',
        location: 'Ubud, Bali',
        date: 'October 2022',
        image:
          'https://images.unsplash.com/photo-1604480132736-44c188fe4d20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        content:
          'Watching traditional Balinese dance performances in Ubud is a cultural experience not to be missed. The intricate movements tell ancient stories.',
        likes: 134,
        traits: ['Cultural', 'Educational'],
      },
      {
        id: 'story6',
        title: 'Rice Terrace Exploration',
        location: 'Tegallalang, Bali',
        date: 'September 2022',
        image:
          'https://images.unsplash.com/photo-1476158085676-e67f57ed9ed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        content:
          'The Tegallalang rice terraces are a testament to traditional Balinese farming techniques. The layered landscape is perfect for photography.',
        likes: 221,
        traits: ['Nature-focused', 'Photography', 'Cultural'],
      },
    ],
    tours: [
      {
        id: 'tour1',
        title: 'Hidden Waterfalls & Rice Terraces',
        image:
          'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '1 day (8 hours)',
        groupSize: 'Small group (max 6)',
        includes: ['Transportation', 'Lunch', 'Photography tips', 'Water'],
        price: 85,
        rating: 4.9,
        reviewCount: 78,
        description:
          "Discover Bali's most beautiful hidden waterfalls and rice terraces on this full-day adventure. We'll trek through lush jungles, swim in pristine natural pools, and capture stunning photos away from the tourist crowds. This tour is perfect for nature lovers and photography enthusiasts of all skill levels.",
        dates: [
          { id: 'd1', date: 'Jun 15, 2023', spotsLeft: 3 },
          { id: 'd2', date: 'Jun 22, 2023', spotsLeft: 6 },
          { id: 'd3', date: 'Jul 5, 2023', spotsLeft: 2 },
        ],
      },
      {
        id: 'tour2',
        title: 'Sunrise Volcano Hike & Hot Springs',
        image:
          'https://images.unsplash.com/photo-1604608678051-64d46d8d0eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '1 day (10 hours)',
        groupSize: 'Small group (max 8)',
        includes: ['Transportation', 'Breakfast', 'Guide', 'Hot springs entry'],
        price: 95,
        rating: 4.8,
        reviewCount: 56,
        description:
          "Experience the magic of sunrise from Mount Batur, an active volcano with breathtaking views. After a moderate 2-hour hike in the pre-dawn darkness, we'll reach the summit just in time to watch the sun rise over Mount Agung and Lake Batur. Afterward, we'll soothe our muscles in natural hot springs before returning to your accommodation.",
        dates: [
          { id: 'd1', date: 'Jun 18, 2023', spotsLeft: 4 },
          { id: 'd2', date: 'Jun 25, 2023', spotsLeft: 8 },
          { id: 'd3', date: 'Jul 2, 2023', spotsLeft: 5 },
        ],
      },
      {
        id: 'tour3',
        title: 'Cultural Villages & Local Crafts',
        image:
          'https://images.unsplash.com/photo-1604480132736-44c188fe4d20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '1 day (7 hours)',
        groupSize: 'Small group (max 6)',
        includes: ['Transportation', 'Lunch', 'Craft workshop', 'Local guide'],
        price: 75,
        rating: 4.9,
        reviewCount: 42,
        description:
          "Immerse yourself in authentic Balinese culture by visiting traditional villages and meeting local artisans. We'll learn about daily life, witness ancient crafting techniques, and even try our hand at making traditional crafts. This tour provides deep cultural insights while supporting local communities.",
        dates: [
          { id: 'd1', date: 'Jun 20, 2023', spotsLeft: 6 },
          { id: 'd2', date: 'Jun 27, 2023', spotsLeft: 4 },
          { id: 'd3', date: 'Jul 4, 2023', spotsLeft: 6 },
        ],
      },
    ],
    reviews: [],
    certifications: [
      {
        id: 'cert1',
        name: 'Certified Adventure Guide',
        issuer: 'International Adventure Guide Association',
        year: '2020',
        icon: 'award',
        verified: true,
      },
      {
        id: 'cert2',
        name: 'Wilderness First Responder',
        issuer: 'Red Cross',
        year: '2021',
        icon: 'shield',
        verified: true,
      },
      {
        id: 'cert3',
        name: 'Professional Photography Certification',
        issuer: 'Photography Institute',
        year: '2019',
        icon: 'check',
        verified: false,
      },
    ],
  },
  {
    // === BASIC INFO (Used in SearchResults listing page) ===
    id: '2',
    name: 'Miguel Santos',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Mexico City, Mexico',
    rating: 4.8,
    reviewCount: 94,
    specialties: ['Food', 'History', 'Art'],
    personality: ['Foodie', 'Educational', 'Art-lover', 'Laid-back', 'Social'],
    languages: ['English', 'Spanish'],
    price: 75,
    availability: 'Small group - 6 max',
  },
  {
    // === BASIC INFO (Used in SearchResults listing page) ===
    id: '3',
    name: 'Aisha Patel',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Marrakech, Morocco',
    rating: 4.7,
    reviewCount: 108,
    specialties: ['Culture', 'Shopping', 'Food'],
    personality: ['Social', 'Foodie', 'Laid-back', 'Cultural', 'Spiritual'],
    languages: ['English', 'Arabic', 'French'],
    price: 65,
    availability: '10 seats available',
  },
  {
    // === BASIC INFO (Used in SearchResults listing page) ===
    id: '4',
    name: 'Liam Chen',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Kyoto, Japan',
    rating: 4.9,
    reviewCount: 156,
    specialties: ['History', 'Culture', 'Photography'],
    personality: ['Educational', 'History', 'Photography', 'Laid-back', 'Spiritual'],
    languages: ['English', 'Japanese', 'Mandarin'],
    price: 90,
    availability: 'Last 2 spots!',
  },
  {
    // === BASIC INFO (Used in SearchResults listing page) ===
    id: '5',
    name: 'Elena Petrova',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Barcelona, Spain',
    rating: 4.6,
    reviewCount: 89,
    specialties: ['Art', 'Architecture', 'Food'],
    personality: ['Art-lover', 'Educational', 'High-energy', 'Social', 'Family-oriented'],
    languages: ['English', 'Spanish', 'Russian'],
    price: 80,
    availability: 'Available next week',
  },
  {
    // === BASIC INFO (Used in SearchResults listing page) ===
    id: '6',
    name: 'James Wilson',
    image:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Cape Town, South Africa',
    rating: 4.8,
    reviewCount: 112,
    specialties: ['Wildlife', 'Adventure', 'Photography'],
    personality: ['Adventurous', 'Nature-focused', 'High-energy', 'Photography', 'Educational'],
    languages: ['English', 'Afrikaans'],
    price: 95,
    availability: '4 spots left',
  },
];

// ===== FILTER OPTIONS (Used in SearchResults page) =====

export const interests = [
  'Adventure',
  'Culture',
  'Food',
  'Photography',
  'Wellness',
  'History',
  'Wildlife',
  'Art',
  'Architecture',
  'Shopping',
];

export const personalityTraits = [
  'Laid-back',
  'High-energy',
  'Educational',
  'Social',
  'Solo-friendly',
  'Family-oriented',
  'Art-lover',
  'Foodie',
  'Adventurous',
  'Spiritual',
  'Nature-focused',
];

export const languages = [
  'English',
  'Spanish',
  'French',
  'Japanese',
  'Mandarin',
  'Arabic',
  'Russian',
  'Indonesian',
  'Italian',
  'German',
];

// ===== LEGACY EXPORTS FOR BACKWARD COMPATIBILITY =====

// Export country specializations (only available for Sarah Johnson)
export const countrySpecializations = tourLeaders[0].countrySpecializations || [];

// Export single tour leader profile for detail page compatibility
export const tourLeaderProfile = tourLeaders[0];
