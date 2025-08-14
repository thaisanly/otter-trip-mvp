export interface TourItinerary {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation: string;
}

export interface TourGuide {
  id: string;
  name: string;
  image: string;
  experience: string;
  specialties: string[];
  bio: string;
  languages: string[];
}

export interface TourDate {
  id: string;
  date: string;
  spotsLeft: number;
  price: string;
}

export interface TourReview {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface AdditionalInfo {
  title: string;
  content: string;
}

export interface TourDetail {
  id: string;
  title: string;
  code: string;
  breadcrumb: string[];
  heroImage: string;
  duration: string;
  price: string;
  totalJoined: number;
  rating: number;
  reviewCount: number;
  location: string;
  categories: string[]; // Multiple categories for each tour
  overview: string[];
  highlights: string[];
  contentImage: string;
  videoUrl: string; // URL for tour video
  galleryImages: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: TourItinerary[];
  additionalInfo: AdditionalInfo[];
  guide: TourGuide;
  dates: TourDate[];
  reviews: TourReview[];
}

export const tours: Record<string, TourDetail> = {
  'grand-canyon': {
    id: 'grand-canyon',
    title: 'Grand Canyon Adventure',
    code: 'GCA-001',
    breadcrumb: ['Home', 'Explore', 'Adventure', 'Grand Canyon Adventure'],
    heroImage:
      'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    duration: '3 days',
    price: '$8,000',
    totalJoined: 108,
    rating: 4.9,
    reviewCount: 108,
    location: 'Arizona, USA',
    categories: ['adventure'],
    overview: [
      "Experience the majestic Grand Canyon like never before with our 3-day guided adventure tour. Descend into the heart of this natural wonder, where you'll hike along scenic trails, camp under starlit skies, and discover hidden viewpoints away from the tourist crowds.",
      "Our expert guides will share fascinating insights about the canyon's geology, wildlife, and cultural history while ensuring your safety and comfort throughout this unforgettable journey.",
      "Whether you're an experienced hiker or a first-time canyon explorer, this tour offers the perfect balance of challenge and accessibility, with flexible itineraries tailored to your group's preferences and fitness levels.",
    ],
    highlights: [
      'Hike along the iconic South Kaibab Trail with breathtaking panoramic views',
      'Camp at Bright Angel Campground near the Colorado River',
      'Witness stunning sunrise and sunset views from exclusive viewpoints',
      'Cool off in the crystal-clear waters of Havasu Falls',
      'Enjoy stargazing sessions with expert astronomy guides',
    ],
    contentImage:
      'https://images.unsplash.com/photo-1575527048208-933d8f4f44c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Grand Canyon adventure video
    galleryImages: [
      'https://images.unsplash.com/photo-1602088693770-867f3fed105c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1578249949530-6e169da42303?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    ],
    inclusions: [
      'Professional adventure guide throughout the tour',
      'Camping equipment (tents, sleeping bags, mats)',
      'All meals during the trek (breakfast, lunch, dinner)',
      'Permits and entrance fees to Grand Canyon National Park',
      'Transportation to and from trailheads',
      'Emergency satellite communication device',
    ],
    exclusions: [
      'Flights to/from Arizona',
      'Personal hiking gear and clothing',
      'Travel insurance (mandatory)',
      'Personal expenses and souvenirs',
      'Alcoholic beverages',
    ],
    itinerary: [
      {
        day: 1,
        title: 'South Rim & Descent',
        description:
          "Meet at the Grand Canyon Visitor Center for a safety briefing and orientation. Begin your descent down the South Kaibab Trail, enjoying stunning panoramic views. Reach Bright Angel Campground by late afternoon, where you'll set up camp near the Colorado River. Enjoy a hearty dinner and evening stargazing session.",
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Bright Angel Campground',
      },
      {
        day: 2,
        title: 'Phantom Ranch & Ribbon Falls',
        description:
          'After breakfast, hike along the Clear Creek Trail to the stunning Ribbon Falls. Enjoy a picnic lunch and swimming opportunity at this hidden oasis. Return to camp via a different route, passing through the historic Phantom Ranch. Evening includes dinner and stories around the campfire.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Bright Angel Campground',
      },
      {
        day: 3,
        title: 'Ascent & Celebration',
        description:
          'Early morning start for the ascent via the Bright Angel Trail. Enjoy multiple rest stops with incredible views and geological insights from your guide. Reach the rim by mid-afternoon for a celebration meal and certificate presentation before departure.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Not included',
      },
    ],
    additionalInfo: [
      {
        title: 'Fitness requirements',
        content:
          'Moderate to good fitness level required. Participants should be able to hike 5-7 miles per day with elevation changes.',
      },
      {
        title: 'Weather considerations',
        content:
          'Tours operate April-October. Summer months can be extremely hot at the canyon bottom, while spring and fall offer milder temperatures.',
      },
      {
        title: 'Group size',
        content:
          'Maximum 8 participants per guide to ensure personalized attention and minimal environmental impact.',
      },
    ],
    guide: {
      id: 'james-wilson',
      name: 'James Wilson',
      image:
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      experience: '8 years',
      specialties: ['Canyoneering', 'Wilderness Survival', 'Geology'],
      bio: 'James is a certified wilderness guide with over 8 years of experience leading tours in the Grand Canyon. With a background in geology and a passion for conservation, he provides fascinating insights into the natural history of this magnificent landscape.',
      languages: ['English', 'Spanish'],
    },
    dates: [
      {
        id: 'd1',
        date: 'Jun 15-17, 2023',
        spotsLeft: 3,
        price: '$8,000',
      },
      {
        id: 'd2',
        date: 'Jun 22-24, 2023',
        spotsLeft: 6,
        price: '$8,000',
      },
      {
        id: 'd3',
        date: 'Jul 5-7, 2023',
        spotsLeft: 2,
        price: '$8,500',
      },
      {
        id: 'd4',
        date: 'Jul 12-14, 2023',
        spotsLeft: 8,
        price: '$8,500',
      },
      {
        id: 'd5',
        date: 'Aug 2-4, 2023',
        spotsLeft: 4,
        price: '$8,500',
      },
    ],
    reviews: [],
  },
  'swiss-alps': {
    id: 'swiss-alps',
    title: 'Swiss Alps Adventure',
    code: 'SAA-002',
    breadcrumb: ['Home', 'Explore', 'Adventure', 'Swiss Alps Adventure'],
    heroImage:
      'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    duration: '5 days',
    price: '$12,000',
    totalJoined: 86,
    rating: 4.8,
    reviewCount: 86,
    location: 'Interlaken, Switzerland',
    categories: ['adventure'],
    overview: [
      "Immerse yourself in the breathtaking beauty of the Swiss Alps with our 5-day adventure tour based in Interlaken. Experience the perfect blend of adrenaline-pumping activities and serene alpine relaxation in one of Europe's most stunning mountain landscapes.",
      'From soaring above snow-capped peaks on a paragliding flight to exploring crystal-clear mountain lakes, this tour offers unforgettable experiences for nature lovers and adventure seekers alike.',
      'Stay in comfortable alpine accommodations, enjoy authentic Swiss cuisine, and benefit from the expertise of our local guides who will help you discover both famous landmarks and hidden gems throughout the Bernese Oberland region.',
    ],
    highlights: [
      'Paraglide over Interlaken with views of Lakes Thun and Brienz',
      'Hike through meadows and forests to stunning alpine viewpoints',
      'Experience canyoning in pristine mountain gorges',
      "Visit the famous Jungfraujoch – 'Top of Europe'",
      'Enjoy a traditional Swiss fondue dinner in a mountain chalet',
    ],
    contentImage:
      'https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE', // Swiss Alps adventure video
    galleryImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1527489377706-5bf97e608852?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1508953233729-33619e3ab2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1531793046469-1095a5b0ab4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    ],
    inclusions: [
      '4 nights accommodation in a 3-star alpine hotel',
      'Daily breakfast and 3 dinners including traditional Swiss fondue',
      'All adventure activities (paragliding, canyoning, hiking)',
      'Jungfraujoch excursion with mountain railway pass',
      'Professional, English-speaking adventure guides',
      'All necessary equipment for activities',
      'Transportation within the region',
    ],
    exclusions: [
      'Flights to/from Switzerland',
      'Lunches and 1 dinner',
      'Personal expenses and souvenirs',
      'Travel insurance',
      'Optional activities not listed in the itinerary',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Orientation Hike',
        description:
          'Arrive in Interlaken and check into your alpine hotel. Meet your guide for a welcome briefing, followed by an afternoon orientation hike to Harder Kulm for panoramic views of the region. Welcome dinner at a local restaurant.',
        meals: ['Dinner'],
        accommodation: 'Alpine Hotel, Interlaken',
      },
      {
        day: 2,
        title: 'Paragliding & Lake Exploration',
        description:
          'Morning paragliding experience over Interlaken (weather permitting). Afternoon boat trip on Lake Brienz with swimming opportunity at a secluded beach. Free evening to explore Interlaken.',
        meals: ['Breakfast'],
        accommodation: 'Alpine Hotel, Interlaken',
      },
      {
        day: 3,
        title: 'Jungfraujoch Excursion',
        description:
          'Full-day excursion to Jungfraujoch – Top of Europe (3,454m). Journey by scenic mountain railway through Kleine Scheidegg. Explore the Ice Palace, Sphinx Observatory, and enjoy snow activities on the glacier. Evening fondue dinner in a traditional chalet.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Alpine Hotel, Interlaken',
      },
      {
        day: 4,
        title: 'Canyoning Adventure',
        description:
          'Morning canyoning experience in Grimsel region, navigating through gorges, natural slides, and waterfalls. Afternoon visit to Giessbach Falls and leisurely hike. Farewell dinner in Interlaken.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Alpine Hotel, Interlaken',
      },
      {
        day: 5,
        title: 'Grindelwald & Departure',
        description:
          'Morning visit to Grindelwald and the First Cliff Walk for spectacular mountain views. Return to Interlaken for departure in the afternoon.',
        meals: ['Breakfast'],
        accommodation: 'Not included',
      },
    ],
    additionalInfo: [
      {
        title: 'Best time to visit',
        content:
          'June to September offers the best weather for outdoor activities. Some activities are weather-dependent and may be rescheduled.',
      },
      {
        title: 'Physical requirements',
        content:
          'Moderate fitness level recommended. Paragliding and canyoning do not require previous experience.',
      },
      {
        title: 'What to bring',
        content:
          'Hiking boots, warm and waterproof clothing (layers recommended), swimwear, sunscreen, camera.',
      },
    ],
    guide: {
      id: 'lukas-meyer',
      name: 'Lukas Meyer',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      experience: '10 years',
      specialties: ['Mountaineering', 'Paragliding', 'Alpine Ecology'],
      bio: 'Born and raised in the Bernese Oberland, Lukas is a certified mountain guide with a passion for sharing the natural beauty and adventure opportunities of his homeland. His knowledge of local history, culture, and hidden spots will make your Swiss Alps experience truly special.',
      languages: ['English', 'German', 'French'],
    },
    dates: [
      {
        id: 'd1',
        date: 'Jun 10-14, 2023',
        spotsLeft: 4,
        price: '$12,000',
      },
      {
        id: 'd2',
        date: 'Jun 24-28, 2023',
        spotsLeft: 2,
        price: '$12,000',
      },
      {
        id: 'd3',
        date: 'Jul 8-12, 2023',
        spotsLeft: 6,
        price: '$13,000',
      },
      {
        id: 'd4',
        date: 'Jul 22-26, 2023',
        spotsLeft: 5,
        price: '$13,000',
      },
      {
        id: 'd5',
        date: 'Aug 5-9, 2023',
        spotsLeft: 8,
        price: '$13,000',
      },
    ],
    reviews: [],
  },
  'machu-picchu': {
    id: 'machu-picchu',
    title: 'Machu Picchu Trek',
    code: 'MPT-003',
    breadcrumb: ['Home', 'Explore', 'Adventure', 'Machu Picchu Trek'],
    heroImage:
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    duration: '4 days',
    price: '$9,500',
    totalJoined: 124,
    rating: 4.9,
    reviewCount: 124,
    location: 'Peru',
    categories: ['adventure', 'cultural'],
    overview: ['Hike to the ancient ruins of Machu Picchu over 4 days.'],
    highlights: [
      'Trek the famous Inca Trail',
      'Watch sunrise over Machu Picchu',
      'Explore ancient Incan ruins',
    ],
    contentImage:
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    videoUrl: 'https://www.youtube.com/embed/ljvQXd8eJHE', // Machu Picchu trek video
    galleryImages: [],
    inclusions: ['Guide', 'Meals', 'Accommodation'],
    exclusions: ['Flights'],
    itinerary: [],
    additionalInfo: [],
    guide: {
      id: 'carlos-lopez',
      name: 'Carlos Lopez',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      experience: '12 years',
      specialties: ['Inca History', 'Trekking'],
      bio: 'Expert in Incan history and mountain trekking.',
      languages: ['English', 'Spanish', 'Quechua'],
    },
    dates: [],
    reviews: [],
  },
  'kyoto-cultural': {
    id: 'kyoto-cultural',
    title: 'Kyoto Cultural Tour',
    code: 'KCT-004',
    breadcrumb: ['Home', 'Explore', 'Cultural', 'Kyoto Cultural Tour'],
    heroImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    duration: '5 days',
    price: '$10,500',
    totalJoined: 112,
    rating: 4.8,
    reviewCount: 112,
    location: 'Kyoto, Japan',
    categories: ['cultural'],
    overview: ['Discover ancient temples, tea ceremonies, and traditional arts in historic Kyoto.'],
    highlights: [
      'Visit historic temples and shrines',
      'Traditional tea ceremony experience',
      'Explore bamboo forests',
    ],
    contentImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    videoUrl: 'https://www.youtube.com/embed/AUCqQ9YzKvs', // Kyoto cultural tour video
    galleryImages: [],
    inclusions: ['Guide', 'Cultural experiences', 'Transportation'],
    exclusions: ['Flights', 'Some meals'],
    itinerary: [],
    additionalInfo: [],
    guide: {
      id: 'yuki-tanaka',
      name: 'Yuki Tanaka',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      experience: '8 years',
      specialties: ['Japanese Culture', 'Tea Ceremony'],
      bio: 'Traditional culture expert and certified tea master.',
      languages: ['English', 'Japanese'],
    },
    dates: [],
    reviews: [],
  },
  'bali-retreat': {
    id: 'bali-retreat',
    title: 'Bali Wellness Retreat',
    code: 'BWR-005',
    breadcrumb: ['Home', 'Explore', 'Relaxation', 'Bali Wellness Retreat'],
    heroImage:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    duration: '7 days',
    price: '$9,500',
    totalJoined: 136,
    rating: 4.9,
    reviewCount: 136,
    location: 'Bali, Indonesia',
    categories: ['relaxation', 'cultural'],
    overview: ['Relax and rejuvenate with a 7-day retreat in Bali.'],
    highlights: [
      'Daily yoga and meditation',
      'Spa treatments with local herbs',
      'Temple visits and blessings',
    ],
    contentImage:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    videoUrl: 'https://www.youtube.com/embed/nggOxvLBpFg', // Bali wellness retreat video
    galleryImages: [],
    inclusions: ['Accommodation', 'Yoga classes', 'Spa treatments', 'Meals'],
    exclusions: ['Flights', 'Personal expenses'],
    itinerary: [],
    additionalInfo: [],
    guide: {
      id: 'made-sudarma',
      name: 'Made Sudarma',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      experience: '6 years',
      specialties: ['Yoga', 'Balinese Healing'],
      bio: 'Certified yoga instructor and traditional healer.',
      languages: ['English', 'Indonesian', 'Balinese'],
    },
    dates: [],
    reviews: [],
  },
  'italy-culinary': {
    id: 'italy-culinary',
    title: 'Italian Culinary Journey',
    code: 'ICJ-006',
    breadcrumb: ['Home', 'Explore', 'Food', 'Italian Culinary Journey'],
    heroImage:
      'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    duration: '8 days',
    price: '$13,000',
    totalJoined: 118,
    rating: 4.9,
    reviewCount: 118,
    location: 'Italy',
    categories: ['food', 'cultural'],
    overview: ['Taste your way through Italy with cooking classes and food tours.'],
    highlights: [
      'Hands-on cooking classes',
      'Visit local markets and vineyards',
      'Dine at family-owned restaurants',
    ],
    contentImage:
      'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    videoUrl: 'https://www.youtube.com/embed/i7Bt-XNSXUI', // Italian culinary journey video
    galleryImages: [],
    inclusions: ['Cooking classes', 'Food tours', 'Wine tastings', 'Meals'],
    exclusions: ['Flights', 'Accommodation'],
    itinerary: [],
    additionalInfo: [],
    guide: {
      id: 'giuseppe-rossi',
      name: 'Giuseppe Rossi',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      experience: '15 years',
      specialties: ['Italian Cuisine', 'Wine', 'Regional History'],
      bio: 'Master chef and wine expert from Tuscany.',
      languages: ['English', 'Italian', 'French'],
    },
    dates: [],
    reviews: [],
  },
};

// Legacy export for backward compatibility
export const tourData = tours;
