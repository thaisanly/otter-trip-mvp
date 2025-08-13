// ===== SHARED INTERFACES (Used by both listing and detail pages) =====

export interface Expert {
  id: string;
  name: string;
  image: string;
  location: string;
  countryCode: string;
  verified: boolean;
  rating: number;
  reviews: number;
  experience: number;
  languages: string[];
  specialties: string[];
  followers: number;
  videos: number;
  liveStreams: number;
  tours: number;

  // Optional flags - primarily for listing page
  isLive?: boolean;
  isTopCreator?: boolean;
  isRisingStar?: boolean;

  // Detail page specific fields (optional for listing)
  coverImage?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  featuredTours?: FeaturedTour[];
  upcomingStreams?: UpcomingStream[];
  latestVideos?: LatestVideo[];
  consultationPrice?: string;
  audioTrack?: string;
}

// ===== DETAIL PAGE SPECIFIC INTERFACES =====

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

export interface FeaturedTour {
  id: string;
  title: string;
  image: string;
  duration: string;
  price: string;
  description: string;
  rating?: number;
  reviews: number;
}

export interface UpcomingStream {
  id: string;
  title: string;
  date: string;
  time: string;
  thumbnail: string;
}

export interface LatestVideo {
  id: string;
  title: string;
  duration?: string;
  views: string;
  thumbnail: string;
}

// ===== EXPERT DATA (Complete data for both listing and detail views) =====

export const experts: Expert[] = [
  {
    // === BASIC INFO (Used in listing page) ===
    id: 'sarah-chen',
    name: 'Sarah Chen',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    location: 'Singapore',
    countryCode: '🇸🇬',
    verified: true,
    rating: 4.9,
    reviews: 127,
    experience: 8,
    languages: ['English', 'Mandarin', 'Malay'],
    specialties: ['Cultural Tours', 'Food Tours', 'City Exploration'],
    followers: 2300,
    isLive: true, // Listing page flag
    videos: 45,
    liveStreams: 12,
    tours: 8,

    // === DETAIL PAGE SPECIFIC DATA ===
    coverImage:
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    bio: "Hi there! I'm Sarah, a passionate travel guide based in Singapore. With eight years of experience, I specialise in creating immersive cultural experiences that showcase the authentic side of Singapore. From hidden hawker stalls with the best local food to off-the-beaten-path cultural sites, I love sharing my city's rich heritage and vibrant present with travellers from around the world.",
    consultationPrice: '$250',
    socialLinks: {
      instagram: 'https://instagram.com/sarahchen',
      youtube: 'https://youtube.com/sarahchen',
      twitter: 'https://twitter.com/sarahchen',
    },
    featuredTours: [
      {
        id: 'singapore-food-tour',
        title: 'Singapore Food Heritage Tour',
        image:
          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '4 hours',
        price: '$120',
        description:
          "Explore Singapore's diverse culinary scene through its hawker centers and local markets.",
        rating: 4.9,
        reviews: 78,
      },
      {
        id: 'cultural-neighborhoods',
        title: 'Cultural Neighborhoods Walking Tour',
        image:
          'https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '3 hours',
        price: '$85',
        description: "Discover the unique blend of cultures in Singapore's historic neighborhoods.",
        reviews: 42,
      },
    ],
    upcomingStreams: [
      {
        id: 'stream-1',
        title: 'Live from Gardens by the Bay',
        date: 'May 15, 2023',
        time: '7:00 PM SGT',
        thumbnail:
          'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
      {
        id: 'stream-2',
        title: 'Singapore Night Safari Experience',
        date: 'May 20, 2023',
        time: '8:30 PM SGT',
        thumbnail:
          'https://images.unsplash.com/photo-1576085898323-218337e3e43c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
    ],
    latestVideos: [
      {
        id: 'video-1',
        title: 'Top 5 Hidden Gems in Singapore',
        duration: '12:45',
        views: '24K',
        thumbnail:
          'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
      {
        id: 'video-2',
        title: 'Singapore Street Food Guide',
        duration: '18:32',
        views: '56K',
        thumbnail:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
      {
        id: 'video-3',
        title: 'Gardens by the Bay Night Tour',
        duration: '15:17',
        views: '32K',
        thumbnail:
          'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
    ],
  },
  {
    // === BASIC INFO (Used in listing page) ===
    id: 'marco-rodriguez',
    name: 'Marco Rodriguez',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    location: 'Barcelona',
    countryCode: '🇪🇸',
    verified: true,
    rating: 4.8,
    reviews: 203,
    experience: 12,
    languages: ['English', 'Spanish', 'Catalan', 'Italian'],
    specialties: ['Adventure Tours', 'Historical Sites', 'Local Experiences'],
    followers: 2500,
    isTopCreator: true, // Listing page flag
    videos: 62,
    liveStreams: 18,
    tours: 15,

    // === DETAIL PAGE SPECIFIC DATA ===
    coverImage:
      'https://images.unsplash.com/photo-1558642084-fd07fae5282e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    bio: '¡Hola amigos! Soy Marco, su guía de aventuras en Barcelona. Nacido y criado en esta hermosa ciudad, he pasado los últimos 12 años mostrando a los viajeros el Barcelona auténtico más allá de los lugares turísticos. Desde joyas históricas escondidas hasta los mejores bares de tapas locales, combino aventura, historia y cultura local para crear experiencias inolvidables.',
    consultationPrice: '$250',
    socialLinks: {
      instagram: 'https://instagram.com/marcorodriguez',
      youtube: 'https://youtube.com/marcorodriguez',
      twitter: 'https://twitter.com/marcorodriguez',
    },
    featuredTours: [
      {
        id: 'barcelona-hidden-gems',
        title: 'Barcelona Hidden Gems Tour',
        image:
          'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '5 hours',
        price: '$150',
        description: 'Discover the secret spots and local favorites that most tourists never see.',
        rating: 4.9,
        reviews: 87,
      },
      {
        id: 'gaudi-architecture',
        title: 'Gaudí Architecture Experience',
        image:
          'https://images.unsplash.com/photo-1583779457094-ab6f9164a1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '4 hours',
        price: '$130',
        description:
          'Explore the masterpieces of Antoni Gaudí with expert commentary and skip-the-line access.',
        rating: 4.8,
        reviews: 65,
      },
    ],
    upcomingStreams: [
      {
        id: 'stream-1',
        title: 'Live from Park Güell',
        date: 'May 18, 2023',
        time: '6:00 PM CEST',
        thumbnail:
          'https://images.unsplash.com/photo-1594394489098-74ca7267182a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
    ],
    latestVideos: [
      {
        id: 'video-1',
        title: 'Barcelona Like a Local',
        duration: '16:24',
        views: '37K',
        thumbnail:
          'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
      {
        id: 'video-2',
        title: 'Best Tapas Bars in Barcelona',
        duration: '14:18',
        views: '42K',
        thumbnail:
          'https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
    ],
  },
  {
    // === BASIC INFO (Used in listing page) ===
    id: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    location: 'Tokyo',
    countryCode: '🇯🇵',
    verified: true,
    rating: 4.7,
    reviews: 89,
    experience: 6,
    languages: ['English', 'Japanese'],
    specialties: ['Cultural Tours', 'Shopping', 'Food Tours'],
    followers: 1800,
    videos: 38,
    liveStreams: 5,
    tours: 12,

    // === DETAIL PAGE SPECIFIC DATA ===
    coverImage:
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    bio: "Konnichiwa! I'm Yuki, a Tokyo native with a passion for sharing Japanese culture with visitors. My tours focus on authentic experiences that blend traditional and modern Japan. Whether you're interested in historic temples, cutting-edge fashion districts, or the best ramen shops, I'll help you navigate Tokyo like a local, providing cultural insights you won't find in guidebooks.",
    consultationPrice: '$250',
    socialLinks: {
      instagram: 'https://instagram.com/yukitanaka',
      youtube: 'https://youtube.com/yukitanaka',
    },
    featuredTours: [
      {
        id: 'tokyo-contrast',
        title: 'Tokyo Contrast: Tradition & Innovation',
        image:
          'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '6 hours',
        price: '$180',
        description:
          'Experience the fascinating contrast between ancient traditions and futuristic innovations in Tokyo.',
        rating: 4.8,
        reviews: 42,
      },
      {
        id: 'food-adventure',
        title: 'Tokyo Food Adventure',
        image:
          'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '4 hours',
        price: '$140',
        description: 'Sample authentic Japanese cuisine from street food to high-end izakayas.',
        rating: 4.9,
        reviews: 36,
      },
    ],
    upcomingStreams: [],
    latestVideos: [
      {
        id: 'video-1',
        title: "Tokyo's Hidden Alleyways",
        views: '18K',
        thumbnail:
          'https://images.unsplash.com/photo-1554797589-7241bb691973?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
      {
        id: 'video-2',
        title: 'Ultimate Guide to Japanese Street Food',
        duration: '20:12',
        views: '32K',
        thumbnail:
          'https://images.unsplash.com/photo-1521856729154-7118f7181af9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
    ],
  },
  {
    // === BASIC INFO (Used in listing page) ===
    id: 'david-thompson',
    name: 'David Thompson',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    location: 'London',
    countryCode: '🇬🇧',
    verified: true,
    rating: 4.9,
    reviews: 156,
    experience: 15,
    languages: ['English', 'French', 'German'],
    specialties: ['Historical Tours', 'Museum Tours', 'Architecture'],
    followers: 3100,
    isTopCreator: true, // Listing page flag
    videos: 78,
    liveStreams: 22,
    tours: 31,

    // === DETAIL PAGE SPECIFIC DATA ===
    coverImage:
      'https://images.unsplash.com/photo-1520986606214-8b456906c813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    bio: "Hello! I'm David, a London-based historian and tour guide with 15 years of experience in bringing British history to life. My background in art history and architecture enables me to offer in-depth tours of London's museums, historical sites, and architectural landmarks. I specialise in creating engaging narratives that connect the past with the present, making history accessible and fascinating for everyone.",
    consultationPrice: '$250',
    socialLinks: {
      instagram: 'https://instagram.com/davidthompson',
      youtube: 'https://youtube.com/davidthompson',
      twitter: 'https://twitter.com/davidthompson',
    },
    featuredTours: [
      {
        id: 'london-history',
        title: 'London Through the Ages',
        image:
          'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '6 hours',
        price: '$160',
        description:
          "Walk through 2,000 years of London's history from Roman ruins to modern landmarks.",
        rating: 4.9,
        reviews: 87,
      },
      {
        id: 'british-museum',
        title: 'British Museum Highlights Tour',
        image:
          'https://images.unsplash.com/photo-1574322768247-e5db3e1e7bea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
        duration: '3 hours',
        price: '$90',
        description: 'Discover the most important artifacts and hidden gems of the British Museum.',
        rating: 4.8,
        reviews: 62,
      },
    ],
    upcomingStreams: [
      {
        id: 'stream-1',
        title: 'Live from the Tower of London',
        date: 'May 22, 2023',
        time: '2:00 PM BST',
        thumbnail:
          'https://images.unsplash.com/photo-1592509255531-161181e0cb8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
    ],
    latestVideos: [
      {
        id: 'video-1',
        title: 'Secret History of Westminster Abbey',
        duration: '22:15',
        views: '45K',
        thumbnail:
          'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
      {
        id: 'video-2',
        title: "London's Medieval Mysteries",
        views: '38K',
        thumbnail:
          'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      },
    ],
  },
  {
    // === BASIC INFO (Used in listing page) ===
    id: 'priya-sharma',
    name: 'Priya Sharma',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    location: 'Mumbai',
    countryCode: '🇮🇳',
    verified: true,
    rating: 4.8,
    reviews: 112,
    experience: 10,
    languages: ['English', 'Hindi', 'Marathi'],
    specialties: ['Heritage Sites', 'Spiritual Tours', 'Local Culture'],
    followers: 1650,
    isRisingStar: true, // Listing page flag
    videos: 42,
    liveStreams: 9,
    tours: 14,
  },
  {
    // === BASIC INFO (Used in listing page) ===
    id: 'ahmed-hassan',
    name: 'Ahmed Hassan',
    image:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    location: 'Cairo',
    countryCode: '🇪🇬',
    verified: true,
    rating: 4.9,
    reviews: 189,
    experience: 20,
    languages: ['English', 'Arabic', 'French'],
    specialties: ['Archaeological Tours', 'Historical Sites', 'Desert Expeditions'],
    followers: 2800,
    videos: 56,
    liveStreams: 14,
    tours: 28,
  },
  {
    // === BASIC INFO (Used in listing page) ===
    id: 'emma-wilson',
    name: 'Emma Wilson',
    image:
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    location: 'Sydney',
    countryCode: '🇦🇺',
    verified: true,
    rating: 4.7,
    reviews: 76,
    experience: 5,
    languages: ['English'],
    specialties: ['Nature Tours', 'Wildlife', 'Beach Activities'],
    followers: 1200,
    isLive: true, // Listing page flag
    videos: 32,
    liveStreams: 7,
    tours: 9,
  },
  {
    // === BASIC INFO (Used in listing page) ===
    id: 'carlos-santos',
    name: 'Carlos Santos',
    image:
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    location: 'Rio de Janeiro',
    countryCode: '🇧🇷',
    verified: true,
    rating: 4.8,
    reviews: 103,
    experience: 9,
    languages: ['English', 'Portuguese', 'Spanish'],
    specialties: ['Adventure Tours', 'Beach Tours', 'Nightlife'],
    followers: 3500,
    videos: 87,
    liveStreams: 29,
    tours: 16,
  },
  {
    // === BASIC INFO (Used in listing page) ===
    id: 'sofia-martinez',
    name: 'Sofia Martinez',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    location: 'Buenos Aires',
    countryCode: '🇦🇷',
    verified: true,
    rating: 4.9,
    reviews: 92,
    experience: 7,
    languages: ['English', 'Spanish'],
    specialties: ['Tango Tours', 'Food & Wine', 'City Exploration'],
    followers: 1450,
    isRisingStar: true, // Listing page flag
    videos: 28,
    liveStreams: 11,
    tours: 6,
  },
];

// ===== HELPER FUNCTIONS =====

/**
 * Get expert by ID - returns full expert data for detail page
 * Used by: ExpertDetail.tsx
 */
export function getExpertById(id: string): Expert | undefined {
  return experts.find((expert) => expert.id === id);
}

/**
 * Get experts for listing page - returns only necessary fields
 * Used by: MeetExperts.tsx
 */
export function getExpertsForListing(): Expert[] {
  return experts;
}

/**
 * Get related experts - used for "Similar Experts" sections
 * Used by: ExpertDetail.tsx (sidebar)
 */
export function getRelatedExperts(currentExpertId: string, limit = 3): Expert[] {
  return experts.filter((expert) => expert.id !== currentExpertId).slice(0, limit);
}

// ===== LEGACY EXPORTS FOR BACKWARD COMPATIBILITY =====

// Export as Record for detail page compatibility
export const expertsData: Record<string, Expert> = experts.reduce(
  (acc, expert) => {
    acc[expert.id] = expert;
    return acc;
  },
  {} as Record<string, Expert>
);

// Export related experts array for backward compatibility
export const relatedExperts = experts.slice(4, 7); // Priya, Ahmed, Emma
