import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { tourLeaders } from '../src/mock/tourLeaders';
import { tours } from '../src/mock/tours';
import { experts } from '../src/mock/experts';
import { generateConsultationCode } from '../src/utils/codeGenerator';
import { generateSlug } from '../src/utils/slug';

const prisma = new PrismaClient();

// Generate future tour dates for booking availability
function generateFutureTourDates() {
  const dates = [];
  const today = new Date();
  
  // Generate 6 tour dates over the next 3 months
  for (let i = 0; i < 6; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + (i * 15) + Math.floor(Math.random() * 10) + 7); // Spread dates 15-25 days apart
    
    // Generate random ID for each date
    const randomId = Math.random().toString(36).substring(2, 15);
    
    dates.push({
      id: randomId, // Add random ID for each date
      date: futureDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      spotsLeft: Math.floor(Math.random() * 8) + 3, // Random spots between 3-10
      totalSpots: 12,
      price: Math.floor(Math.random() * 200) + 100 // Random price between $100-300
    });
  }
  
  return dates;
}

// Generate random social media links for experts
function generateSocialMediaLinks(expertName: string) {
  const username = expertName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  const socialMedia: any = {};
  
  // Randomly assign 2-4 social media platforms
  const platforms = ['instagram', 'youtube', 'facebook', 'twitter', 'linkedin'];
  const numPlatforms = Math.floor(Math.random() * 3) + 2; // 2-4 platforms
  const selectedPlatforms = platforms.sort(() => 0.5 - Math.random()).slice(0, numPlatforms);
  
  selectedPlatforms.forEach(platform => {
    switch (platform) {
      case 'instagram':
        socialMedia.instagram = `https://instagram.com/${username}travel`;
        break;
      case 'youtube':
        socialMedia.youtube = `https://youtube.com/@${username}adventures`;
        break;
      case 'facebook':
        socialMedia.facebook = `https://facebook.com/${username}.guide`;
        break;
      case 'twitter':
        socialMedia.twitter = `https://twitter.com/${username}travel`;
        break;
      case 'linkedin':
        socialMedia.linkedin = `https://linkedin.com/in/${username}guide`;
        break;
    }
  });
  
  return socialMedia;
}

// Generate YouTube travel videos for experts
function generateLatestVideos() {
  const travelVideos = [
    {
      id: 'M8oyDU9EehM',
      title: 'Best of Italy: Rome, Florence, Venice & Cinque Terre Guide',
      url: 'https://www.youtube.com/watch?v=M8oyDU9EehM',
      thumbnail: 'https://i.ytimg.com/vi/M8oyDU9EehM/maxresdefault.jpg',
      viewCount: 435000
    },
    {
      id: 'dGKD8CPMmR4',
      title: 'Paris Travel Guide: Art, Culture and French Cuisine',
      url: 'https://www.youtube.com/watch?v=dGKD8CPMmR4',
      thumbnail: 'https://i.ytimg.com/vi/dGKD8CPMmR4/maxresdefault.jpg',
      viewCount: 189000
    },
    {
      id: 'hcr51nyaEBM',
      title: 'Tokyo Luxury Travel: Ultimate Japan Experience',
      url: 'https://www.youtube.com/watch?v=hcr51nyaEBM',
      thumbnail: 'https://i.ytimg.com/vi/hcr51nyaEBM/maxresdefault.jpg',
      viewCount: 267000
    },
    {
      id: 'YBLZmwlPa8A',
      title: 'Europe Travel Guide: Hidden Gems and Local Culture',
      url: 'https://www.youtube.com/watch?v=YBLZmwlPa8A',
      thumbnail: 'https://i.ytimg.com/vi/YBLZmwlPa8A/maxresdefault.jpg',
      viewCount: 156000
    },
    {
      id: 'k2EPG-NZJFY',
      title: 'Wildlife Safari: Best National Parks in Africa',
      url: 'https://www.youtube.com/watch?v=k2EPG-NZJFY',
      thumbnail: 'https://i.ytimg.com/vi/k2EPG-NZJFY/maxresdefault.jpg',
      viewCount: 278000
    },
    {
      id: 'Ks-_Mh1QhMc',
      title: 'Kyoto Cultural Guide: Temples, Gardens & Traditional Japan',
      url: 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc',
      thumbnail: 'https://i.ytimg.com/vi/Ks-_Mh1QhMc/maxresdefault.jpg',
      viewCount: 324000
    },
    {
      id: 'bhgKdoOZ8eY',
      title: 'Adventure Travel: Hiking the Swiss Alps',
      url: 'https://www.youtube.com/watch?v=bhgKdoOZ8eY',
      thumbnail: 'https://i.ytimg.com/vi/bhgKdoOZ8eY/maxresdefault.jpg',
      viewCount: 167000
    },
    {
      id: 'fMUVdIji7bE',
      title: 'Singapore Food & Culture: Complete Travel Guide',
      url: 'https://www.youtube.com/watch?v=fMUVdIji7bE',
      thumbnail: 'https://i.ytimg.com/vi/fMUVdIji7bE/maxresdefault.jpg',
      viewCount: 198000
    }
  ];
  
  // Randomly select 2-3 videos for each expert
  const numVideos = Math.floor(Math.random() * 2) + 2; // 2-3 videos
  const selectedVideos = travelVideos.sort(() => 0.5 - Math.random()).slice(0, numVideos);
  
  return selectedVideos;
}

// Generate featured tours for experts
function generateFeaturedTours(availableTourIds: string[]) {
  // Randomly select 2-4 tour IDs for each expert
  const numTours = Math.floor(Math.random() * 3) + 2; // 2-4 tours
  const selectedTours = availableTourIds.sort(() => 0.5 - Math.random()).slice(0, numTours);
  
  return selectedTours;
}

// Generate travel styles for tour leaders
function generateTravelStyles() {
  const allStyles = [
    'Adventure Seeker',
    'Cultural Explorer',
    'Luxury Traveler',
    'Budget Backpacker',
    'Wildlife Enthusiast',
    'Photography Focus',
    'Solo Journey',
    'Group Experience',
    'Family Friendly',
    'Romantic Getaway',
    'Wellness & Spa',
    'Food & Culinary',
    'Historical Discovery',
    'Off the Beaten Path',
    'Urban Explorer'
  ];
  
  // Randomly select 3-8 travel styles
  const numStyles = Math.floor(Math.random() * 6) + 3; // 3-8 styles
  return allStyles.sort(() => 0.5 - Math.random()).slice(0, numStyles);
}

// Generate travel stories for tour leaders
function generateTravelStories() {
  const storyTemplates = [
    {
      title: 'Cherry Blossoms and Ancient Temples in Kyoto',
      description: 'Walking through the bamboo groves of Arashiyama at dawn, surrounded by thousands of blooming sakura trees, was a spiritual experience that captured the essence of Japan\'s timeless beauty. The golden light filtering through temple gates created magical moments for every traveler.',
    },
    {
      title: 'Sunrise Over Mount Fuji',
      description: 'After a challenging night climb, reaching the summit just as the first rays of sunlight painted the sky was an unforgettable moment that reminded me why I became a tour guide. The view from Japan\'s sacred mountain is truly life-changing.',
    },
    {
      title: 'Culinary Journey Through Singapore',
      description: 'From hawker centers in Chinatown to Michelin-starred establishments in Marina Bay, Singapore\'s food scene tells the story of a multicultural nation. Each dish represents a different heritage, creating a unique fusion that defines modern Asian cuisine.',
    },
    {
      title: 'Northern Lights Chase in Iceland',
      description: 'After five nights of cloudy skies, the aurora finally appeared in all its glory. Watching my guests\' faces light up as the green curtains danced overhead made every cold moment worthwhile in this Nordic paradise.',
    },
    {
      title: 'Renaissance Art Tour Through Florence',
      description: 'Standing before Michelangelo\'s David in the Accademia Gallery, surrounded by centuries of artistic mastery, reminded me why Italy remains the heart of Renaissance culture. Each fresco and sculpture tells a story of human creativity at its peak.',
    },
    {
      title: 'Alpine Adventure in the Swiss Mountains',
      description: 'The train journey through the Swiss Alps revealed landscapes so pristine they seemed otherworldly. Crystal-clear lakes, snow-capped peaks, and charming villages created the perfect backdrop for an unforgettable mountain adventure.',
    },
    {
      title: 'Flamenco Nights in Seville',
      description: 'The passionate rhythms of flamenco echoing through Seville\'s narrow streets captured the soul of Andalusian culture. Late nights in traditional tablaos, surrounded by centuries-old architecture, showed us Spain\'s most authentic cultural expression.',
    },
    {
      title: 'Island Hopping in the Greek Cyclades',
      description: 'Each island revealed its own character - from Santorini\'s dramatic cliffs to Mykonos\' vibrant nightlife. The crystal-clear waters and warm hospitality made this Mediterranean journey truly unforgettable.',
    }
  ];
  
  // High-quality Unsplash travel images
  const unsplashImages = [
    'https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1504598318550-17eba1008a68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1476900543704-4312b78632f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1568849676085-51415703900f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ];
  
  // Select 2-4 random stories
  const numStories = Math.floor(Math.random() * 3) + 2; // 2-4 stories
  const selectedStories = storyTemplates.sort(() => 0.5 - Math.random()).slice(0, numStories);
  
  // Add real Unsplash travel images (5-10 per story)
  return selectedStories.map((story, index) => {
    const numImages = Math.floor(Math.random() * 6) + 5; // 5-10 images
    const images = [];
    
    for (let i = 0; i < numImages; i++) {
      const randomImageIndex = Math.floor(Math.random() * unsplashImages.length);
      images.push(unsplashImages[randomImageIndex]);
    }
    
    return {
      ...story,
      images
    };
  });
}

// Generate country specializations for tour leaders
function generateCountrySpecializations() {
  const countries = [
    { country: 'Japan', tours: 45, rating: 4.9, yearCount: Math.floor(Math.random() * 8) + 3, icon: '🇯🇵' },
    { country: 'Italy', tours: 38, rating: 4.8, yearCount: Math.floor(Math.random() * 7) + 4, icon: '🇮🇹' },
    { country: 'Peru', tours: 29, rating: 4.9, yearCount: Math.floor(Math.random() * 6) + 2, icon: '🇵🇪' },
    { country: 'Iceland', tours: 22, rating: 4.7, yearCount: Math.floor(Math.random() * 5) + 2, icon: '🇮🇸' },
    { country: 'Singapore', tours: 35, rating: 4.8, yearCount: Math.floor(Math.random() * 6) + 3, icon: '🇸🇬' },
    { country: 'Morocco', tours: 31, rating: 4.6, yearCount: Math.floor(Math.random() * 7) + 3, icon: '🇲🇦' },
    { country: 'Greece', tours: 35, rating: 4.8, yearCount: Math.floor(Math.random() * 8) + 2, icon: '🇬🇷' },
    { country: 'Nepal', tours: 18, rating: 4.9, yearCount: Math.floor(Math.random() * 5) + 2, icon: '🇳🇵' },
    { country: 'Kenya', tours: 26, rating: 4.7, yearCount: Math.floor(Math.random() * 6) + 3, icon: '🇰🇪' },
    { country: 'Switzerland', tours: 33, rating: 4.8, yearCount: Math.floor(Math.random() * 9) + 4, icon: '🇨🇭' },
    { country: 'India', tours: 42, rating: 4.6, yearCount: Math.floor(Math.random() * 10) + 3, icon: '🇮🇳' },
    { country: 'Chile', tours: 24, rating: 4.7, yearCount: Math.floor(Math.random() * 6) + 2, icon: '🇨🇱' },
    { country: 'Norway', tours: 28, rating: 4.8, yearCount: Math.floor(Math.random() * 7) + 3, icon: '🇳🇴' },
    { country: 'Egypt', tours: 19, rating: 4.5, yearCount: Math.floor(Math.random() * 5) + 2, icon: '🇪🇬' },
    { country: 'France', tours: 41, rating: 4.8, yearCount: Math.floor(Math.random() * 8) + 4, icon: '🇫🇷' },
    { country: 'Spain', tours: 36, rating: 4.7, yearCount: Math.floor(Math.random() * 7) + 3, icon: '🇪🇸' }
  ];

  // Generate level based on yearCount and rating
  function generateLevel(yearCount: number, rating: number, tours: number) {
    // Expert: 7+ years OR high rating (4.8+) with 5+ years OR 35+ tours
    if (yearCount >= 7 || (rating >= 4.8 && yearCount >= 5) || tours >= 35) {
      return 'Expert';
    }
    // Advanced: 4+ years OR good rating (4.6+) with 3+ years OR 20+ tours
    else if (yearCount >= 4 || (rating >= 4.6 && yearCount >= 3) || tours >= 20) {
      return 'Advanced';
    }
    // Intermediate: everything else
    else {
      return 'Intermediate';
    }
  }
  
  // Select 2-4 countries for each tour leader and add level
  const numCountries = Math.floor(Math.random() * 3) + 2; // 2-4 countries
  const selectedCountries = countries.sort(() => 0.5 - Math.random()).slice(0, numCountries);
  
  return selectedCountries.map(country => ({
    ...country,
    level: generateLevel(country.yearCount, country.rating, country.tours)
  }));
}

// Generate average response time
function generateAverageResponseTime() {
  const responseTimes = [
    'Within 1 hour',
    'Within 2 hours', 
    'Within 4 hours',
    'Within 6 hours',
    'Within 12 hours',
    'Within 1 day'
  ];
  
  return responseTimes[Math.floor(Math.random() * responseTimes.length)];
}

// Generate rate (3-5 range)
function generateRate() {
  const rates = ['$35/hour', '$45/hour', '$55/hour', '$65/hour', '$75/hour'];
  return rates[Math.floor(Math.random() * rates.length)];
}

// Generate tour completion count
function generateTourCompleteCount() {
  // Generate realistic tour completion counts between 25-200
  return Math.floor(Math.random() * 176) + 25; // 25-200 completed tours
}

// Generate location-specific YouTube video and images for tours
function generateTourMediaByLocation(location: string) {
  const locationMedia = {
    'Arizona, USA': {
      videoUrl: 'https://www.youtube.com/embed/NuXGVjKMSIk', // Grand Canyon National Park video
      images: [
        'https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
      ]
    },
    'Interlaken, Switzerland': {
      videoUrl: 'https://www.youtube.com/embed/zLLWR7qRtJ0', // Swiss Alps nature video
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1504598318550-17eba1008a68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1476900543704-4312b78632f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
      ]
    },
    'Peru': {
      videoUrl: 'https://www.youtube.com/embed/5IlS1JEXdgI', // Machu Picchu documentary video
      images: [
        'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1568849676085-51415703900f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
      ]
    },
    'Kyoto, Japan': {
      videoUrl: 'https://www.youtube.com/embed/Ks-_Mh1QhMc', // Kyoto cultural guide
      images: [
        'https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1504598318550-17eba1008a68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
      ]
    },
    'Bali, Indonesia': {
      videoUrl: 'https://www.youtube.com/embed/fMUVdIji7bE', // Cultural and wellness travel
      images: [
        'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1476900543704-4312b78632f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1568849676085-51415703900f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
      ]
    },
    'Italy': {
      videoUrl: 'https://www.youtube.com/embed/M8oyDU9EehM', // Best of Italy travel guide
      images: [
        'https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1504598318550-17eba1008a68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
      ]
    }
  };

  const media = locationMedia[location as keyof typeof locationMedia] || locationMedia['Arizona, USA'];
  
  // Select 3-10 random images
  const numImages = Math.floor(Math.random() * 8) + 3; // 3-10 images
  const selectedImages = media.images.sort(() => 0.5 - Math.random()).slice(0, numImages);
  
  return {
    videoUrl: media.videoUrl,
    galleryImages: selectedImages
  };
}

// Generate realistic bio text for experts
function generateExpertBio(expertName: string, location: string, specialties: string[]) {
  const bioTemplates = [
    `Hi, I'm ${expertName}! I'm a passionate travel consultant based in ${location} with over a decade of experience helping travelers create unforgettable journeys. My expertise spans ${specialties.slice(0, 2).join(' and ')}, and I believe that travel is the best education you can give yourself. I've personally explored over 40 countries and love sharing insider tips that you won't find in guidebooks. Whether you're planning a romantic getaway, family adventure, or solo expedition, I'm here to help you discover the world's hidden gems while ensuring every detail is perfectly arranged. Let's turn your travel dreams into reality!`,
    
    `Welcome! I'm ${expertName}, a certified travel specialist from ${location}. For the past 8 years, I've been crafting bespoke travel experiences with a focus on ${specialties[0]} and sustainable tourism. My journey in travel began when I backpacked through Southeast Asia and fell in love with connecting cultures through authentic experiences. I hold certifications in ${specialties.slice(0, 2).join(' and ')}, and I'm particularly passionate about helping travelers discover destinations off the beaten path. My clients often tell me that my personalized recommendations and attention to detail made their trips truly exceptional. I can't wait to help you plan your next adventure!`,
    
    `Hello fellow adventurers! I'm ${expertName}, your travel companion from ${location}. With extensive experience in ${specialties[0]} and ${specialties[1] || 'cultural tourism'}, I specialize in creating meaningful travel experiences that go beyond typical tourist attractions. I've lived in 3 different countries and speak 4 languages, which helps me provide insider perspectives on destinations worldwide. My approach combines careful planning with flexibility, ensuring you have a structured itinerary while leaving room for spontaneous discoveries. I'm particularly known for my expertise in budget optimization without compromising on quality. Let me help you explore the world with confidence!`,
    
    `Greetings! I'm ${expertName}, a travel consultant and cultural enthusiast based in ${location}. My specialization in ${specialties[0]} comes from 12 years of hands-on experience and extensive travel throughout 50+ countries. I believe that the best trips are those that challenge you, inspire you, and leave you with stories to tell for years to come. I'm particularly passionate about responsible travel and work closely with local communities to ensure your journey has a positive impact. From luxury escapes to adventure expeditions, I tailor every aspect of your trip to match your interests, budget, and travel style. Ready to embark on your next great adventure?`,
    
    `Hi there! I'm ${expertName}, your dedicated travel expert from ${location}. What started as a personal passion for ${specialties[0]} has evolved into a career helping others discover the transformative power of travel. I hold advanced certifications in travel planning and have partnerships with local guides in over 30 destinations. My strength lies in understanding what makes each traveler unique and crafting experiences that resonate with their personal interests and goals. Whether you're seeking relaxation, adventure, cultural immersion, or culinary delights, I have the connections and knowledge to make it happen. Let's create memories that will last a lifetime!`
  ];
  
  return bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (skip if tables don't exist)
  console.log('🗑️  Clearing existing data...');
  try {
    await prisma.booking.deleteMany();
    await prisma.consultationBooking.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.consultationCode.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.tourLeader.deleteMany();
    await prisma.tour.deleteMany();
    await prisma.expert.deleteMany();
    await prisma.tourCategory.deleteMany();
  } catch (error) {
    console.log('📝 Some tables may not exist yet, skipping cleanup...');
  }

  // Seed Tour Categories
  console.log('📂 Seeding tour categories...');
  
  const categories = [
    {
      id: 'adventure',
      name: 'Adventure Tours',
      description: 'Push your limits with thrilling expeditions and heart-pounding activities around the globe',
      coverImage: 'https://images.unsplash.com/photo-1533692328991-08159ff19fca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      icon: '🏔️',
      interests: ['Hiking', 'Rock Climbing', 'Water Sports', 'Extreme Sports', 'Wildlife Safari', 'Camping'],
      displayOrder: 1,
    },
    {
      id: 'cultural',
      name: 'Cultural Experiences',
      description: 'Immerse yourself in rich traditions, ancient history, and local customs worldwide',
      coverImage: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      icon: '🏛️',
      interests: ['Historical Sites', 'Museums', 'Local Traditions', 'Art & Architecture', 'Festivals', 'Cuisine'],
      displayOrder: 2,
    },
    {
      id: 'relaxation',
      name: 'Relaxation & Wellness',
      description: 'Rejuvenate your mind and body with peaceful retreats and wellness experiences',
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      icon: '🧘',
      interests: ['Spa & Massage', 'Yoga', 'Meditation', 'Beach Resorts', 'Hot Springs', 'Nature Retreats'],
      displayOrder: 3,
    },
    {
      id: 'food',
      name: 'Culinary Adventures',
      description: 'Savor authentic flavors and discover culinary traditions from farm to table',
      coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      icon: '🍽️',
      interests: ['Cooking Classes', 'Wine Tasting', 'Street Food', 'Farm Tours', 'Local Markets', 'Fine Dining'],
      displayOrder: 4,
    },
    {
      id: 'wildlife',
      name: 'Wildlife & Nature',
      description: 'Encounter amazing wildlife and explore pristine natural habitats',
      coverImage: 'https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      icon: '🦁',
      interests: ['Safari', 'Bird Watching', 'Marine Life', 'National Parks', 'Conservation', 'Photography'],
      displayOrder: 5,
    },
    {
      id: 'beach',
      name: 'Beach & Island',
      description: 'Discover paradise with crystal-clear waters and pristine sandy beaches',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      icon: '🏖️',
      interests: ['Snorkeling', 'Diving', 'Island Hopping', 'Beach Sports', 'Sailing', 'Sunset Cruises'],
      displayOrder: 6,
    },
    {
      id: 'city',
      name: 'City Tours',
      description: 'Explore vibrant urban destinations and discover hidden city gems',
      coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      icon: '🏙️',
      interests: ['City Tours', 'Nightlife', 'Shopping', 'Street Art', 'Local Neighborhoods', 'Public Transport'],
      displayOrder: 7,
    },
    {
      id: 'mountain',
      name: 'Mountain Adventures',
      description: 'Conquer peaks and explore breathtaking mountain landscapes',
      coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      icon: '⛰️',
      interests: ['Trekking', 'Mountaineering', 'Skiing', 'Cable Cars', 'Alpine Lakes', 'Mountain Biking'],
      displayOrder: 8,
    },
  ];

  for (const category of categories) {
    await prisma.tourCategory.create({
      data: category,
    });
  }
  
  console.log(`✅ Created ${categories.length} tour categories`);

  // Seed Tour Leaders
  console.log('👥 Seeding tour leaders...');
  
  // Track used slugs to handle duplicates
  const usedSlugs = new Set<string>();
  const tourLeaderIds: string[] = []; // Track created tour leader IDs
  
  for (const leader of tourLeaders) {
    // Generate slug from name
    let baseSlug = generateSlug(leader.name);
    let slug = baseSlug;
    let counter = 1;
    
    // Handle duplicates by adding a number
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);
    tourLeaderIds.push(slug); // Store the ID for later use with tours
    
    await prisma.tourLeader.create({
      data: {
        id: slug, // Use slug as ID instead of numeric ID
        name: leader.name,
        image: leader.image,
        coverImage: leader.coverImage || `https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80&sig=${slug}`, // Use coverImage from mock data or fallback
        location: leader.location,
        rating: leader.rating,
        reviewCount: leader.reviewCount,
        specialty: leader.specialties ? leader.specialties[0] : 'Adventure Guide', // Use first specialty as main
        description: leader.tagline || `Expert ${leader.specialties?.[0] || 'tour'} guide in ${leader.location}`,
        price: `$${leader.price}`,
        isSuperhost: leader.rating >= 4.8, // Consider high-rated guides as superhosts
        languages: leader.languages || [],
        experience: leader.yearsExperience ? `${leader.yearsExperience} years` : null,
        certifications: leader.certifications || [],
        bio: leader.about || null,
        expertise: leader.specialties || [],
        travelStyle: generateTravelStyles(), // Add 3-8 travel styles
        travelStories: generateTravelStories(), // Add travel stories with title, description and images
        countrySpecializations: generateCountrySpecializations(), // Add country specializations
        tourCompleteCount: generateTourCompleteCount(), // Add tour completion count
        averageResponseTime: generateAverageResponseTime(), // Add average response time
        rate: generateRate(), // Add rate (3-5 range)
        reviews: leader.reviews || [],
        availability: leader.availability || null,
      },
    });
  }
  console.log(`✅ Created ${tourLeaders.length} tour leaders`);

  // Seed Tours
  console.log('🗺️  Seeding tours...');
  let tourIndex = 0;
  const createdTourIds: string[] = []; // Track created tour IDs for expert featured tours
  
  for (const [tourId, tour] of Object.entries(tours)) {
    // Assign a tour leader to each tour (cycling through available leaders)
    const tourLeaderId = tourLeaderIds[tourIndex % tourLeaderIds.length];
    
    // Generate location-specific media
    const tourMedia = generateTourMediaByLocation(tour.location);
    
    await prisma.tour.create({
      data: {
        id: tour.id,
        code: tour.code,
        title: tour.title,
        heroImage: tour.heroImage,
        duration: tour.duration,
        price: tour.price,
        totalJoined: tour.totalJoined,
        rating: tour.rating,
        reviewCount: tour.reviewCount,
        location: tour.location,
        categories: tour.categories,
        overview: tour.overview,
        highlights: tour.highlights,
        contentImage: tour.contentImage || null,
        videoUrl: tourMedia.videoUrl, // Use location-specific YouTube video
        galleryImages: tourMedia.galleryImages, // Use location-specific Unsplash images (3-10)
        inclusions: tour.inclusions || [],
        exclusions: tour.exclusions || [],
        itinerary: tour.itinerary || [],
        additionalInfo: tour.additionalInfo || [],
        guide: tour.guide || null,
        dates: generateFutureTourDates(),
        reviews: tour.reviews || [],
        description: Array.isArray(tour.overview) ? tour.overview[0] : null,
        groupSize: 10, // Default group size
        spotsLeft: Math.floor(Math.random() * 8) + 3, // Random spots between 3-10
        tourLeaderId: tourLeaderId, // Assign tour leader
      },
    });
    
    createdTourIds.push(tour.id); // Store tour ID for expert featured tours
    tourIndex++;
  }
  console.log(`✅ Created ${Object.keys(tours).length} tours`);

  // Seed Experts
  console.log('🎓 Seeding experts...');
  for (const [index, expert] of experts.entries()) {
    // Make first 6 experts active, rest inactive for testing
    const isActive = index < 6;
    
    await prisma.expert.create({
      data: {
        id: expert.id,
        name: expert.name,
        title: expert.specialties ? expert.specialties[0] : 'Travel Expert', // Use first specialty as title
        image: expert.image,
        banner: expert.coverImage || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80&sig=${index}`, // Use coverImage from mock data or fallback
        location: expert.location,
        rating: expert.rating,
        reviewCount: expert.reviews || 0,
        hourlyRate: expert.consultationPrice || '$50/hour',
        languages: expert.languages || [],
        expertise: expert.specialties || [],
        certifications: [], // Experts don't have certifications in mock data
        availability: null, // No availability in mock data
        bio: generateExpertBio(expert.name, expert.location, expert.specialties || []),
        experience: expert.experience ? `${expert.experience} years` : null,
        socialMedia: generateSocialMediaLinks(expert.name),
        latestVideos: generateLatestVideos(), // Add 2-3 YouTube travel videos
        featuredTours: generateFeaturedTours(createdTourIds), // Add 2-4 featured tour IDs
        isActive: isActive,
      },
    });
  }
  console.log(`✅ Created ${experts.length} experts`);

  // Seed Consultation Codes
  console.log('🔑 Seeding consultation codes...');
  
  // Active code with no restrictions
  await prisma.consultationCode.create({
    data: {
      code: 'OT-1234-ABCD',
      status: 'active',
      description: 'General access code',
      createdBy: 'System',
    },
  });
  
  // Code with max uses
  await prisma.consultationCode.create({
    data: {
      code: generateConsultationCode(),
      status: 'active',
      description: 'Limited use promotional code',
      maxUses: 5,
      usedCount: 2,
      createdBy: 'Marketing',
    },
  });
  
  // Code with expiration date (expires in 30 days)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  await prisma.consultationCode.create({
    data: {
      code: generateConsultationCode(),
      status: 'active',
      description: 'Promotional code for Q1 2024',
      expiresAt: futureDate,
      createdBy: 'Marketing',
    },
  });
  
  // Inactive code
  await prisma.consultationCode.create({
    data: {
      code: generateConsultationCode(),
      status: 'inactive',
      description: 'Deactivated code',
      usedCount: 10,
      createdBy: 'Admin',
    },
  });
  
  // Expired code
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7);
  await prisma.consultationCode.create({
    data: {
      code: generateConsultationCode(),
      status: 'expired',
      description: 'Past promotional code',
      expiresAt: pastDate,
      usedCount: 15,
      createdBy: 'Marketing',
    },
  });
  
  console.log('✅ Created 5 consultation codes with various configurations');

  // Seed Admin Users
  console.log('👤 Seeding admin users...');
  
  // Create default admin
  const hashedPassword = await bcrypt.hash('password123', 12);
  await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'super_admin',
      isActive: true,
    },
  });
  
  console.log('✅ Created admin user:');
  console.log('   Email: admin@example.com, Password: password123 (Super Admin)');

  console.log('✨ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });