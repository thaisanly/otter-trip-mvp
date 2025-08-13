import { getToursByCategoryForListing } from './mockUtils';

export interface Category {
  title: string;
  description: string;
  image: string;
  interests: string[];
}

// Simplified category tour interface for listing view
export interface CategoryTour {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: string;
  rating: number;
  reviews: number;
  talents: number;
}

export const categories: Record<string, Category> = {
  adventure: {
    title: 'Adventure Tours',
    description: 'Thrilling experiences for adrenaline seekers and outdoor enthusiasts',
    image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    interests: ['Hiking', 'Trekking', 'Rafting', 'Climbing', 'Wildlife', 'Camping'],
  },
  cultural: {
    title: 'Cultural Experiences',
    description: 'Immerse yourself in local traditions, history, and authentic cultural encounters',
    image:
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    interests: ['History', 'Architecture', 'Museums', 'Local Traditions', 'Art', 'Festivals'],
  },
  relaxation: {
    title: 'Relaxation Getaways',
    description: 'Unwind and rejuvenate with peaceful retreats and leisurely experiences',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    interests: ['Beaches', 'Spa', 'Wellness', 'Yoga', 'Nature', 'Island Life'],
  },
  food: {
    title: 'Food & Cuisine',
    description: 'Savor local flavors and culinary traditions around the world',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    interests: [
      'Street Food',
      'Cooking Classes',
      'Wine Tasting',
      'Food Markets',
      'Gourmet Tours',
      'Farm to Table',
    ],
  },
};

// Legacy export for backward compatibility - now dynamically generated
export const toursByCategory: Record<string, CategoryTour[]> = {
  get adventure() {
    return getToursByCategoryForListing('adventure');
  },
  get cultural() {
    return getToursByCategoryForListing('cultural');
  },
  get relaxation() {
    return getToursByCategoryForListing('relaxation');
  },
  get food() {
    return getToursByCategoryForListing('food');
  },
};

export const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
];
